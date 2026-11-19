# iADUAN IPV — Semakan Backup GAS Staf Sebenar (19 November 2026)

**Status:** perbandingan source sahaja. Tiada perubahan GAS, Google Sheets, deployment atau `main`.  
**Sumber:** ZIP milik owner `iADUAN_STAFF_PRE_INTEGRATION_BACKUP.zip` mengandungi enam fail GAS Staf: `ImageService.gs`, `DatabaseSetup.gs`, `Code.gs`, `appsscript.json`, `ComplaintService.gs` dan `Index.html`.

## Perbandingan ZIP dengan GitHub main

Selepas menyeragamkan format `CRLF`/baris, perbandingan hash kandungan:

| Fail | Hubungan dengan main |
|---|---|
| `ImageService.gs` | Sepadan |
| `DatabaseSetup.gs` | Sepadan |
| `ComplaintService.gs` | Sepadan |
| `Index.html` | Sepadan |
| `Code.gs` | **Berbeza** — ZIP GAS sebenar mengandungi konfigurasi alamat e-mel admin sebenar pada `ADMIN_EMAILS` dan satu nilai e-mel ujian dalam `testAdminConfiguration`; `main` menggunakan e-mel contoh `example.invalid` |
| `appsscript.json` | **Berbeza secara keselamatan** — ZIP menyatakan `webapp.executeAs=USER_ACCESSING`, `webapp.access=ANYONE`; `main` dan branch integrasi menyatakan `USER_DEPLOYING`, `MYSELF` |

**Jangan commit alamat e-mel admin daripada backup tanpa keputusan owner tentang sumber konfigurasi dan privasi repositori. Jangan salin manifest GitHub ke GAS secara membuta tuli; semak tetapan deployment sebenar `/dev` dan `/exec` dahulu.** Kandungan manifest sumber bukan bukti tetapan sebenar deployment semasa.

## Perbandingan ZIP dengan branch integrasi

Branch integrasi sengaja mengubah `Index.html`, `ComplaintService.gs`, `DatabaseSetup.gs`, `ImageService.gs`, `Code.gs` dan menambah `StaffPinService.gs` serta `ComplaintIdempotency.gs`. Perubahan lain dalam lima fail ialah skop PR #1/#2/#3 yang perlu ujian DEV. Konfigurasi e-mel admin dalam `Code.gs` branch sekarang masih contoh GitHub, **bukan** nilai GAS sebenar. Manifest integrasi mengekalkan versi GitHub yang tidak sama dengan backup.

## Sekatan sebelum pemasangan

1. **BLOCKER:** tentukan sumber konfigurasi `ADMIN_EMAILS` yang betul tanpa mendedahkan butiran peribadi di repo; jangan overwrite `Code.gs` sebenar tanpa mengekalkan konfigurasi yang sah.
2. **BLOCKER:** semak tetapan Web App sebenar daripada Apps Script *Deploy → Manage deployments*; bezakan nilai dalam manifest dengan tetapan deployment aktif. `ANYONE` yang dipadankan dengan `USER_ACCESSING` memerlukan penilaian berasingan kerana penggunaan PIN dan kebolehcapaian staf bergantung deployment.
3. Semak fail GAS Staf yang dikumpul dari editor benar-benar snapshot terkini dan tiada fail tersembunyi/trigger yang tidak termasuk backup.
4. Selepas prasyarat di atas selesai, lakukan backup spreadsheet DEV dan migrasi header N/O, provisioning PIN ujian serta ujian fungsi menurut `STAFF_PR123_DEV_TEST_MATRIX.md` — hanya dengan kelulusan owner.
5. **Tiada alasan untuk deploy atau merge berdasarkan ZIP semata-mata.**

## Nota keselamatan

Fail backup mungkin mengandungi alamat peribadi atau konfigurasi akses; jangan muat naik ZIP mentah ke repository awam. Laporan ini sengaja tidak mengandungi alamat e-mel sebenar atau sebarang PIN/secret.
