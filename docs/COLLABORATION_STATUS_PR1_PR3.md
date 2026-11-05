# iADUAN IPV — Status Kolaborasi BurnDVS (5 November 2026)

**Dokumen kerja untuk semakan Fahmi — bukan pengesahan pemasangan GAS.**

## Keadaan disahkan di GitHub

- Repository: `zulfahmi3938/iAduanIPV`.
- `main` masih pada `1cd41b09a95654ce5cc0a61fcacb2920494bb64b` ketika semakan.
- Ketiga-tiga Pull Request masih **OPEN / DRAFT / UNMERGED**.
- Setiap PR mempunyai branch berasingan yang bermula daripada baseline `main` sama. Kod ketiga-tiganya **belum** digabungkan sebagai satu release.
- Tiada kerja dalam siri PR ini mengubah GAS, Google Sheets, Drive, Script Properties atau deployment sebenar.

| PR | Skop | Branch | Semakan setempat | Dokumentasi |
| --- | --- | --- | --- | --- |
| [#1](https://github.com/zulfahmi3938/iAduanIPV/pull/1) | PIN staf 6 digit | `feature/burndvs-staff-pin-v1` | JS syntax PASS; runtime NOT VERIFIED | [STAFF_PIN_HANDOVER.md](https://github.com/zulfahmi3938/iAduanIPV/blob/feature/burndvs-staff-pin-v1/docs/STAFF_PIN_HANDOVER.md) |
| [#2](https://github.com/zulfahmi3938/iAduanIPV/pull/2) | Duplicate Submission Protection | `feature/burndvs-staff-submission-idempotency-v1` | 16 PASS, 0 FAIL mock/static; runtime NOT VERIFIED | [STAFF_DUPLICATE_SUBMISSION_V1.md](https://github.com/zulfahmi3938/iAduanIPV/blob/feature/burndvs-staff-submission-idempotency-v1/docs/STAFF_DUPLICATE_SUBMISSION_V1.md) |
| [#3](https://github.com/zulfahmi3938/iAduanIPV/pull/3) | Keselamatan RPC GAS Staf | `security/burndvs-staff-rpc-hardening-v1` | 22 PASS, 0 FAIL static; runtime NOT VERIFIED | [STAFF_RPC_HARDENING_V1.md](STAFF_RPC_HARDENING_V1.md) |

**PASS setempat bukan bukti fungsi sudah dipasang, diuji dengan servis Google sebenar atau production-ready.** Keputusan ujian setiap PR tidak boleh dijumlahkan sebagai ujian integrasi seluruh sistem.

## Apa yang Fahmi perlu semak sebelum integrasi

1. **Source sebenar**: Bandingkan kod `gas/` GitHub dengan GAS Staf `/dev` terkini. Pastikan upload gambar dan perubahan pemilik yang lebih baharu tidak tertimpa. Kod `gas-admin/` ialah projek berasingan; jangan overwrite.
2. **PIN PR #1**: Fahmi semak penggunaan identiti dan rancangan provisioning 13 staf. PIN sebenar belum dijana/diedarkan dan hash belum dipasang ke Script Properties. Jangan aktifkan borang yang mewajibkan PIN sebelum provisioning berjaya.
3. **PR #2**: Ia memerlukan dua header `ADUAN!N1=REQUEST_ID` dan `ADUAN!O1=REQUEST_HASH` pada **spreadsheet DEV sedia ada**. Perubahan ini **belum dibuat**. Backup dan sahkan ID database sebenar dahulu. Tiada spreadsheet, tab atau GAS baharu diperlukan.
4. **PR #3**: Semak pemanggil nama fungsi lama (`setupDatabase`, `setupImageFolder`, fungsi check/test) termasuk arahan operator dan trigger. Fungsi private berakhiran `_` tidak tersedia sebagai RPC browser; pastikan arahan manual dikemas kini. Jangan tinggal wrapper setup global dalam kod deploy.
5. **Akses dan keselamatan**: Semak `Execute as`, `Who has access`, perkongsian Editor GAS, dan permission folder gambar. Private RPC naming tidak menggantikan authentication. Staf hanya boleh dianggap dikenal pasti selepas PIN diintegrasikan dan disahkan di backend.

## Pelan integrasi minimum (cadangan, belum dilaksanakan)

1. Fahmi sahkan versi GAS Staf `/dev` sebagai sumber rujukan terkini dan buat salinan/backup versi boleh-rollback serta database DEV yang betul.
2. Review PR #1, #2 dan #3 secara berasingan. **Jangan merge automatik tanpa menggabungkan konflik** pada `gas/Index.html` dan `gas/ComplaintService.gs`. PR #1 dan #2 mengubah kedua-dua fail tersebut; PR #3 turut mengubah `ComplaintService.gs` untuk nama fungsi ujian.
3. Integrasi backend: validasi input → ambil staf sah dari `PENGGUNA` → **sahkan PIN pada setiap permintaan, termasuk retry** → dalam ScriptLock semak durable `REQUEST_ID` / `REQUEST_HASH` → untuk permintaan baharu sahaja, upload gambar dan simpan row ADUAN. Jangan bypass PIN ketika duplicate request ditemui.
4. Pastikan frontend membawa **kedua-dua `staffPin` dan `requestId`**. Jangan replace keseluruhan fail lama secara buta. Borang upload gambar kekal.
5. Lengkapkan prasyarat: set PIN hash di Script Properties mengikut panduan PR #1; tambah header N/O kepada tab ADUAN DEV mengikut panduan PR #2 selepas backup. PR #3 tidak memerlukan perubahan skema.
6. Pasang frontend dan backend **sebagai satu set** hanya selepas semakan owner. Jangan aktifkan permintaan lama tanpa `requestId` ketika backend baharu diwajibkan.
7. Ujian DEV: PIN betul/salah/lockout, submit pertama, retry UUID sama, payload berbeza dengan UUID sama, upload gambar, refresh/response timeout, nombor rujukan, bacaan Admin, dan cubaan RPC setup dari browser. Rekod PASS/FAIL/NOT VERIFIED sebenar.
8. Owner tentukan release dan rollback. Jangan buang gambar/rekod aduan atau padam kolum N/O apabila rollback.

## Batasan semasa

- Tidak ada akses yang disahkan untuk menilai deployment aktif dan database DEV Fahmi dalam siri kerja ini.
- Ini **bukan** security penetration test atau concurrency test sebenar.
- PR #2 menghalang duplicate untuk UUID yang sama, bukan aduan bermaksud sama yang dibuat semula daripada tab/peranti lain dengan UUID baharu.
- PR #3 mengehadkan exposure melalui `google.script.run`, bukan semua laluan akses kepada Google Apps Script.
- **Owner approval dan integrasi manual masih diperlukan**. Tiada merge atau deploy dilakukan.

## Keputusan kerja

**Checkpoint: HOLD FOR FAHMI REVIEW.** Keutamaan berikutnya ialah menyatukan perubahan secara terkawal dan mengesahkan runtime DEV, bukan terus membina feature baharu.
