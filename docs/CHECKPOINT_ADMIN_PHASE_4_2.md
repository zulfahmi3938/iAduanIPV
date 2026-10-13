# Checkpoint Admin Fasa 4.2

Tarikh: 13 Oktober 2026. Source ialah empat fail daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.4.2.zip`. Fail disalin ke `gas-admin/`; folder `gas/` dan checkpoint Fasa 3.1 tidak diubah.

## Kandungan

| Fail | Peranan |
| --- | --- |
| Code.gs | Konfigurasi, semakan identiti admin, doGet, bacaan senarai/jumlah aduan dan fungsi ujian |
| AdminDashboard.html | Dashboard, jumlah/baharu/selesai, tapisan status, muat semula dan paparan gambar |
| AdminImageService.gs | Semakan admin, carian gambar melalui ID aduan, bacaan Drive dan pemulangan data URL |
| appsscript.json | V8, Asia/Singapore, dependencies kosong, USER_ACCESSING / MYSELF |

## Konfigurasi yang disamarkan dan kaedah pemulihan

Dalam `gas-admin/Code.gs` sahaja:

- Nilai `ADMIN_CONFIG.databaseId` diganti dengan `REPLACE_WITH_DEV_SPREADSHEET_ID`.
- Nilai `ADMIN_CONFIG.adminEmail` diganti dengan `admin@example.invalid`.

ID database bukan kata laluan, tetapi rujukan sumber dalaman disamarkan untuk mengelakkan penerbitan yang tidak perlu. Tiga fail lain dikekalkan byte-for-byte daripada ZIP. Tiada perubahan logik lain dibuat.

Untuk pemulihan pada masa akan datang, ambil nilai dua medan itu daripada ZIP asal yang disimpan secara persendirian, atau salinan konfigurasi GAS pemilik. Gantikan placeholder dalam salinan kerja persendirian sahaja. Jangan commit nilai yang dipulihkan ke repository public. Nilai spreadsheet mesti merujuk database DEV yang betul, dan emel mesti akaun admin yang mempunyai akses Sheets/Drive. Jangan memulihkan dengan menyalin rekod aduan, token atau Script Properties ke GitHub.

Dokumen ini bukan arahan untuk mengubah GAS atau deployment sekarang. Snapshot public yang disamarkan tidak boleh terus digunakan tanpa pemulihan konfigurasi. Tiada projek GAS Admin ID diberikan/disahkan dalam tugas ini; jangan menganggap Script ID aplikasi staf ialah projek Admin.

## Semakan dan batas

- Dua fail GS dan JavaScript dalam HTML diparse untuk sintaks; manifest diparse sebagai JSON.
- Semua empat fail diperiksa untuk token, password, private key, emel operasi dan data tertanam. Tiada credentials atau rekod aduan peribadi ditemui selepas redaksi.
- Hash dibandingkan dengan ZIP: hanya dua nilai konfigurasi dalam Code.gs berbeza. Hash salinan repository dicatat di bawah.
- Tiada fungsi GAS dijalankan. Ujian runtime/dashboard di Google tidak diulang dalam sesi checkpoint ini.
- Source dashboard membina teks dengan textContent; getAdminComplaints dan getAdminComplaintImages serta doGet memanggil requireAdmin_. Emel kosong atau tidak sepadan ditolak.
- Manifest yang dibekalkan mempunyai executeAs USER_ACCESSING dan access MYSELF. Ini bukan pengesahan deployment aktif atau bukti akses akaun lain.
- Fungsi testAdminDatabaseConnection tidak memanggil requireAdmin_; ia membaca metadata/bilangan rekod. Jangan meluaskan akses deployment sebelum semakan fungsi ujian/top-level. testAdminComplaints boleh menulis data aduan ke log apabila dijalankan; fungsi itu tidak dijalankan dalam tugas ini.
- Gambar dicari berdasarkan ID aduan dan ID tersimpan di Sheets, bukan file ID terus daripada browser; had MIME/saiz/bilangan tersedia. Fail dibaca sepenuhnya dan dipulangkan sebagai base64, jadi nilai semula payload/memori bagi lampiran besar.
- Semua aduan dibaca sekaligus. Pagination dan fungsi kemas kini status/tindakan/sejarah belum tersedia dalam snapshot ini.
- Kedua-dua gas/ dan gas-admin/ mempunyai Code.gs, doGet dan manifest. Ia snapshot berasingan; jangan digabungkan secara terus atau push kedua-dua folder ke satu projek GAS.

## Langkah berikutnya

Tunggu arahan pemilik. Cadangan berikutnya ialah aliran kemas kini status dan catatan tindakan dengan semakan admin di pelayan serta penulisan log TINDAKAN. Ini belum dibina atau diaktifkan dalam tugas checkpoint.

## SHA-256 salinan GitHub

| Fail | SHA-256 |
| --- | --- |
| gas-admin/AdminDashboard.html | `ca169e546c4c3c12c43d509d7bace7d89a4ef7713937b0c86ebd1c0fd48e9a06` |
| gas-admin/AdminImageService.gs | `528b51c1903cf2c7f5bd6ae43b9e773fb4e80bce6cde754b2bff6264216dbd48` |
| gas-admin/Code.gs | `4847cdf5b7b7d92113a84b3cfdb915d1780a53e266ea1f704a0ec755c77d01d9` |
| gas-admin/appsscript.json | `dd759ccc2865bbcea5e0ab984535d76bd5908842de955b2674d002126fe10183` |
