# Checkpoint Admin Fasa 4.3

Tarikh: 13 Oktober 2026. Source: ZIP pemilik `iADUAN_IPV_ADMIN_v0.4.3.zip`. Lima fail sebenar digunakan; tiada kod direka semula daripada penerangan atau screenshot. Checkpoint ini menyambung Fasa 4.2 (`ef5da8a`). Folder `gas/` kekal tanpa perubahan.

## Kandungan dan fungsi

| Fail | Peranan |
| --- | --- |
| Code.gs | Konfigurasi, semakan admin, halaman dan senarai dashboard |
| AdminDashboard.html | Senarai/tapisan/gambar serta borang Rekod Tindakan dan panggilan simpan |
| AdminImageService.gs | Bacaan gambar aduan dengan semakan admin |
| AdminActionService.gs | Validasi, dry-run, simpan status dan sejarah TINDAKAN, serta rollback ralat biasa |
| appsscript.json | V8, Asia/Singapore, USER_ACCESSING / MYSELF, dependencies kosong |

saveAdminAction memanggil requireAdmin_ sebelum menyentuh data, mengesahkan input, memegang ScriptLock, menyemak nama database DEV dan mencari aduan. Ia menambah sejarah dengan UUID, admin, status asal/baharu, catatan, pihak bertanggungjawab dan tarikh sasaran; kemudian mengemas kini status serta tarikh aduan. Tarikh selesai dikekalkan jika aduan kekal SELESAI, dan dikosongkan jika bertukar keluar daripada SELESAI.

Validasi: ID aduan berformat IPV-tahun-nombor, status dalam senarai lima status, pihak bertanggungjawab 3–150 aksara, catatan 10–2000 aksara, tarikh sasaran pilihan dalam YYYY-MM-DD yang sah. Teks catatan/pihak dilindungi daripada formula Sheets. Tiada state machine khusus untuk menghadkan peralihan antara status.

UI meminta pengesahan, menyahaktifkan butang semasa simpanan dan membaca semula aduan selepas respons success=true. Jika respons gagal/tidak pasti, UI meminta semakan rekod sebelum cuba semula.

## Konfigurasi yang disamarkan dan pemulihan

Dalam salinan GitHub `gas-admin/Code.gs` sahaja, dua nilai ADMIN_CONFIG disamarkan:

- databaseId: `REPLACE_WITH_DEV_SPREADSHEET_ID`.
- adminEmail: `admin@example.invalid`.

Empat fail lain dikekalkan byte-for-byte daripada ZIP. Tiada perubahan logik lain dibuat. ID database ialah rujukan dalaman, bukan credentials; ia disamarkan bersama emel operasi bagi repository public.

Untuk memulihkan pada masa akan datang, ambil nilai dua medan itu daripada ZIP asal atau konfigurasi GAS pemilik dan gantikan placeholder dalam salinan kerja persendirian. Sahkan ia database DEV dan akaun admin yang betul. Jangan commit nilai dipulihkan, token, rekod aduan atau gambar ke GitHub. Tiada pemulihan, perubahan GAS atau deployment dilakukan dalam tugas ini.

## Pengesahan sesi checkpoint

- Semua lima fail dibaca; token/password/private key dan data aduan peribadi tidak ditemui dalam snapshot selepas redaksi.
- Tiga fail GS diparse secara individu dan gabungan untuk mengesan ralat sintaks/deklarasi; JavaScript dalam HTML diparse tanpa menjalankan aplikasi.
- Manifest diparse dan medan V8, USER_ACCESSING serta MYSELF diperiksa. Ini bukan pengesahan deployment aktif.
- Fail dibandingkan dengan ZIP: hanya dua nilai konfigurasi dalam Code.gs berbeza.
- Pemilik melaporkan ujian Fasa 4.3 berjaya. Sesi ini tidak menjalankan semula ujian runtime, saveAdminAction atau fungsi ujian.
- Kod yang boleh menulis data disimpan sebagai source sahaja. GAS asal, deployment, Sheets dan Drive tidak diubah.

## Batas yang direkodkan tanpa mengubah source

- Rollback ialah usaha pemulihan ralat biasa, bukan transaksi atomik. Timeout atau kegagalan pemulihan boleh memerlukan semakan ADUAN/TINDAKAN secara manual.
- Belum ada idempotency key backend. Perlindungan butang tidak meliputi reload, dua tab atau retry permintaan; semak rekod sebelum ulang simpanan yang tidak pasti.
- ScriptLock mengunci projek GAS Admin sahaja; ia tidak mengunci projek GAS staf yang berasingan atau editor Sheets. Nilai semula konsistensi jika operasi serentak berkembang.
- testSaveAdminActionOnce benar-benar menulis data DEV setiap kali dipanggil; nama Once tidak menguatkuasakan sekali sahaja. Jangan jalankan hanya untuk menyimpan checkpoint.
- Header AdminActionService masih menyebut Fasa 4.3A/BELUM MENULIS DATA walaupun saveAdminAction tersedia. Sebahagian komen dashboard juga lama; kod dikekalkan dan fungsi tulis dijelaskan di sini.
- Fungsi ujian Code.gs dan isu log/perluasan akses yang direkodkan dalam nota Fasa 4.2 masih perlu dinilai sebelum production. Jangan anggap semua helper ujian dilindungi seperti endpoint utama.
- Sejarah tindakan disimpan dalam TINDAKAN, tetapi paparan sejarah pada dashboard belum terdapat dalam source ini. Pihak bertanggungjawab/tarikh sasaran dicatat dalam sejarah, bukan kolum tambahan ADUAN.
- gas/ dan gas-admin/ ialah snapshot berasingan dengan doGet/Code.gs/manifest sendiri. Jangan gabungkan secara terus.

## Langkah berikutnya

Tunggu arahan pemilik. Pilihan susulan ialah paparan sejarah tindakan, semakan status SELESAI/DITOLAK serta kegagalan simpanan pada DEV, dan polisi retry/backup. Tiada fungsi tambahan dibina dalam checkpoint ini.

## SHA-256 salinan repository

| Fail | SHA-256 |
| --- | --- |
| gas-admin/AdminActionService.gs | `1233f922474d121d7409cb850b8c2c98a47015df48a0dd5b4695353acf2fcb48` |
| gas-admin/AdminDashboard.html | `2051dd37cb307bd01771ed803e92e08699264c4f4520a939c002b59807d8913b` |
| gas-admin/AdminImageService.gs | `528b51c1903cf2c7f5bd6ae43b9e773fb4e80bce6cde754b2bff6264216dbd48` |
| gas-admin/Code.gs | `4847cdf5b7b7d92113a84b3cfdb915d1780a53e266ea1f704a0ec755c77d01d9` |
| gas-admin/appsscript.json | `dd759ccc2865bbcea5e0ab984535d76bd5908842de955b2674d002126fe10183` |
