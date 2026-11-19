# iADUAN IPV — Fasa 7C: Laporan Audit Pra-Pemasangan (19 November 2026)

**Branch diuji:** `integration/staff-pr1-pr2-pr3-dev`  
**Skop:** audit source GitHub dan simulasi setempat; bukan pemeriksaan GAS runtime / penerimaan produksi.  
**Perubahan kepada `main`, GAS Staf/Admin, Google Sheets/Drive, Script Properties:** Tiada.

## Keputusan yang benar-benar diperiksa

| Semakan | Hasil | Kaedah |
|---|---|---|
| Sintaks enam fail `.gs` | **6 PASS** | JavaScript parse dengan V8 Function constructor |
| Sintaks inline JavaScript dalam `gas/Index.html` | **PASS** | Ekstrak tag script, compile JS |
| Manifest `gas/appsscript.json` | **PASS** | JSON.parse |
| Nama fungsi global berganda di antara `.gs` | **Tiada** | Inventori function declarations |
| Pembacaan & pengesahan UUID, N/O, lookup receipt, hash bagi input sama/berubah | **10/10 mock PASS** | Mock Sheet in-memory dan digest stub peka kandungan |
| Bootstrap PIN, semakan PIN, PIN silang staf, 5 cubaan, lockout, tamat lockout | **8/8 mock PASS** | Mock Script Properties, LockService, Sheets dan signature stub |
| PIN disemak sebelum lookup receipt aduan pendua | **PASS statik** | Susunan panggilan `submitComplaint` |
| Medan PIN dan requestId dihantar bersama frontend | **PASS statik** | Pemeriksaan payload `Index.html` |
| Fungsi upload `saveComplaintImages_` dan setup private dikekalkan | **PASS statik** | Semakan source |

**Penting tentang mock:** fungsi digest/HMAC ujian menggunakan stub deterministik bukan kriptografi. Keputusan 18/18 menunjukkan *aliran logik* pada mock, bukan kekuatan hashing sebenar, kefungsian API Google, timing/concurrency sebenar atau ujian pada Apps Script.

## Pembetulan yang dibuat dalam branch integrasi

- UUID pending hanya diwujudkan **selepas** `prepareImages()` selesai; mengelakkan rekod pending palsu apabila pembacaan gambar gagal sebelum RPC.
- Semakan PIN `verifyStaffPin_` diletakkan sebelum `findComplaintRequest_`, termasuk untuk retry UUID yang telah disimpan.
- PIN input dibersihkan pada callback berjaya dan ralat RPC.

## Pemerhatian dan had yang belum disahkan

1. **Salinan GAS Staf sebenar belum lengkap.** ZIP awal pemilik hanya ada `Index.html`, `ComplaintService.gs`, `ImageService.gs`, dan telah disemak terhadap snapshot `main` lebih awal. Sebelum pemasangan, semak sekali lagi **semua fail** dan manifest sebenar, termasuk script editor/trigger peribadi.
2. **Migrasi database belum dibuat:** `ADUAN!N1` dan `ADUAN!O1` perlu disahkan/ditambah owner selepas backup. Tanpanya submission sengaja gagal.
3. **Provisioning PIN belum dibuat** dalam Script Properties GAS Staf. Kod mewajibkan PIN; tanpa provisioning, submission gagal.
4. **Runtime GAS dan browser belum diuji:** `google.script.run`, Google Sheets/Drive real, lock konkurensi, kuota, ralat rangkaian, pengendalian fail kamera/galeri, dan pembacaan Admin.
5. **Pemulihan selepas refresh ada batasan UX:** `sessionStorage` menyimpan UUID, bukan kandungan borang/gambar. Jika tiada receipt, pengguna perlu masukkan semula butiran dan pilih gambar yang sama; payload berubah dengan UUID lama ditolak. Uji dan terangkan jelas dalam UAT.
6. **Endpoint status baca sahaja** `checkComplaintSubmissionStatus(requestId)` hanya memerlukan UUID untuk memulangkan nombor rujukan. Semak model akses dan privasi deployment; UUID ialah token sensitif.
7. PR #3 menukar nama fungsi setup dan diagnostik. Kewujudan trigger/skrip luar yang memanggil nama lama **belum dapat diperiksa melalui GitHub sahaja**.
8. Screenshot, localhost mock dan parse kod tidak membuktikan kawalan akses Workspace atau keselamatan persekitaran produksi.

## Keputusan

**LULUS PRA-SEMAKAN KOD TERHAD — BELUM DILULUSKAN UNTUK DEPLOY.**

Tindakan seterusnya: audit kesepadanan **keseluruhan GAS Staf DEV** dengan branch, backup, sediakan N/O dan PIN ujian selepas kebenaran owner, kemudian laksanakan matriks ujian di `docs/STAFF_PR123_DEV_TEST_MATRIX.md`.

**Tiada alasan untuk merge ke `main` sebelum keputusan ujian GAS DEV sebenar direkodkan.**
