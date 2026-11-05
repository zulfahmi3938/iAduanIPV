# iADUAN IPV — Fasa 2: Duplicate Submission Protection (GAS Staf)

**Status: CODE CANDIDATE / Draft PR, belum deploy atau diuji di Google.**  
Branch: `feature/burndvs-staff-submission-idempotency-v1`  
Asas: `main` commit `1cd41b09a95654ce5cc0a61fcacb2920494bb64b`  
Skop: `gas/` + dokumentasi sahaja; GAS Admin tidak diubah.

## Masalah dan penyelesaian

Borang Staf asal menghalang klik berganda ketika satu request sedang dihantar, tetapi selepas timeout/refresh user boleh mencuba lagi dan mencipta aduan serta gambar berganda.

Setiap cubaan menghantar kini menggunakan UUID v4 rawak sebagai `requestId`, disimpan dalam `sessionStorage` browser **sebelum RPC**. Retry dalam tab sama menggunakan UUID sama. Backend menggunakan `LockService.getScriptLock()`, mengesahkan staf, menyemak receipt dalam tab `ADUAN`, dan hanya menyimpan gambar/aduan jika UUID belum wujud. Receipt turut mencatat `REQUEST_HASH` (SHA-256 payload staf, lokasi, keterangan dan gambar) supaya penggunaan token sama dengan kandungan berbeza **ditolak**.

Jika sudah wujud dan hash sepadan, pulangkan `complaintId` lama tanpa mencipta aduan/gambar baharu. Lookup read-only `checkComplaintSubmissionStatus(requestId)` membolehkan UI memulihkan nombor rujukan selepas refresh. `found:false` bukan bukti cubaan asal sudah selesai—UI memaparkan amaran, dan retry dengan UUID/payload sama kekal selamat di bawah ScriptLock GAS Staf.

## Skema database DEV sedia ada — PERLU tindakan owner sebelum deployment

**Tiada spreadsheet, tab atau data Google diubah dalam PR ini.** Perubahan ini memerlukan **dua kolum baharu pada tab `ADUAN` sedia ada**:

| Kolum | Header baris 1 | Kandungan |
|---|---|---|
| N (14) | `REQUEST_ID` | UUID v4 bagi satu cubaan submit |
| O (15) | `REQUEST_HASH` | Cap jari SHA-256 heksadesimal payload |

Semua kolum A–M dikekalkan dengan urutan asal. Existing rows boleh kosong dalam N/O; jangan ubah ID aduan atau rekod sejarah. Owner buat backup database DEV sendiri, kemudian **set header N1/O1 sahaja** pada tab `ADUAN` yang telah disahkan, tanpa mencipta spreadsheet baharu. Jangan jalankan `setupDatabase()` sebagai cara migrasi: ia fungsi setup projek dan bukan alat migrasi in-place. Kod `DatabaseSetup.gs` dikemaskini untuk spreadsheet baharu sahaja; ia tidak menambah kolum pada database lama. Jika N/O belum wujud/tersalah label, submission ditolak sebelum gambar atau aduan baharu disimpan (*fail closed*).

**Risiko deployment:** aplikasi staf lama tidak mengisi N/O, walaupun header telah ditambah; jadi selepas cutover semua entry point staf perlu menjalankan kod baharu. Jangan deploy backend baharu sahaja sementara frontend lama masih aktif, atau sebaliknya. Fahmi perlu mengawal versi deployment yang tepat.

## Fail yang berubah

- `gas/ComplaintIdempotency.gs` — validasi UUID v4, SHA-256 payload, skema N/O, lookup receipt dan endpoint semakan read-only.
- `gas/ComplaintService.gs` — wajib UUID, cari receipt sebelum had harian/gambar/appendRow, tulis 15 kolum, rekonsiliasi jika appendRow gagal selepas row sebenarnya masuk.
- `gas/Index.html` — UUID kriptografi, `sessionStorage`, retry UUID sama, lookup pemulihan dan semak respons dengan `requestId` asal.
- `gas/DatabaseSetup.gs` — header baharu bagi setup database baharu sahaja.
- `README.md`, `PROJECT.md` — catatan status cadangan belum deploy.

## Integrasi dengan Draft PR #1 Staff PIN

Fasa 2 bercabang dari `main` untuk mengekalkan dua PR bebas. **PR #1 PIN masih Draft.** Ia juga mengubah `gas/Index.html` dan `gas/ComplaintService.gs`. Selepas Fahmi menerima PR PIN, rebase/merge Fasa 2 dan gabungkan kedua-dua bahagian, bukan replace kedua-dua fail secara membuta tuli.

Urutan selamat pada backend yang digabungkan:
1. Validasi input dan `requestId`.
2. Di bawah ScriptLock, sahkan staf daripada `PENGGUNA` dan **`verifyStaffPin_` jika PR PIN telah diintegrasikan**.
3. Semak `REQUEST_ID` + `REQUEST_HASH` untuk duplicate.
4. Untuk request baharu, simpan gambar, kemudian append row dengan receipt.

**Penting:** PIN perlu kekal disemak walaupun penghantaran terdahulu sudah wujud. Endpoint lookup hanya pulangkan nombor rujukan kepada pemegang UUID berentropi tinggi; jangan pulangkan nama/penerangan/gambar. UUID ialah token yang patut dilindungi daripada logging/URL perkongsian.

## Semakan setempat

Mock service dilakukan menggunakan data rekaan, ScriptLock dan Sheet in-memory (bukan API Google). **16 PASS, 0 FAIL**:

- JS parsing 4 fail; create pertama satu row dan satu gambar.
- Retry UUID/payload sama pulangkan ID lama, tiada gambar tambahan.
- Payload berbeza dengan UUID sama ditolak.
- Status lookup pulangkan ID, bukan isi aduan; UUID rosak ditolak.
- Header N/O tiada menyebabkan fail tertutup.
- `appendRow` gagal selepas row ditulis → receipt ditemui dan rujukan lama dipulangkan.
- Retry selepas respons ambiguous tidak mencipta row lagi.
- `appendRow` gagal sebelum tulis → gambar dibersihkan.
- Header setup baharu, penggunaan secure UUID / sessionStorage, dan regex rujukan disemak.

**NOT VERIFIED**: runtime GAS sebenar, API Sheets/Drive, perlindungan skop deployment, browser mobile/iOS, concurrency sebenar, keserasian dengan snapshot `/dev` Fahmi dan PIN PR #1. Ujian mock tidak membuktikan atomicity API Google; ScriptLock hanya menyelaras satu projek GAS Staf, bukan projek GAS berlainan.

## Ujian DEV minimum selepas owner integrasi

1. Simpan satu aduan (dengan gambar), semak A–O serta nombor rujukan.
2. Hantar semula payload sama dan UUID sama → **tepat satu row dan satu set gambar**.
3. Ulang UUID dengan keterangan/gambar lain → ditolak.
4. Simulasi hilang respons/refresh dalam tab sama → lookup memulihkan receipt atau amaran; retry menggunakan UUID lama.
5. Semak nombor rujukan dan gambar dalam dashboard Admin; tiada pecah kolum A–M.
6. Jika PIN juga diintegrasi, PIN salah mesti ditolak sebelum duplicate lookup.

Rekod ujian DEV jika disimpan hanya dibersihkan dengan kelulusan Fahmi, termasuk rujukan gambar Drive. Jangan delete baris secara rambang.

## Batasan dan rollback

- `sessionStorage` adalah **per tab/origin**; browser/private session baharu atau peranti lain menghasilkan UUID baharu dan tidak dilindungi daripada duplikasi semantik. Jika storan sesi/secure random gagal, UI menolak submission daripada berpura-pura selamat.
- Jika pengguna mengubah payload selepas timeout, UUID lama akan ditolak. Pengguna perlu merujuk urus setia sebelum menghantar aduan baharu.
- `REQUEST_HASH` bukan pengesahan pengguna; PIN atau kawalan akses staf masih diperlukan.
- Jika panggilan `appendRow` dilapor gagal dan bacaan receipt turut gagal, sistem **tidak memadam gambar secara automatik** kerana penulisan mungkin telah berjaya. Urus setia perlu semak secara manual; orphan images mungkin berlaku.
- Kewujudan receipt bermakna row ADUAN disimpan, bukan jaminan notification/operasi luaran selesai.
- Rollback: pulihkan source GAS Staf dan deployment ke versi terdahulu; **biarkan kolum N/O dan receipt sejarah**, jangan padam nombor rujukan/data aduan. Pastikan frontend/backend rollback sebagai satu set.
- Kod belum dipasang di GAS DEV/LIVE. Hanya pemilik boleh melakukan pemasangan selepas review, backup, perbandingan dengan GAS sebenar serta penerimaan skema.
