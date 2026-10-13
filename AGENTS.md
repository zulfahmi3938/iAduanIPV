# Panduan Pembangunan iADUAN IPV

## Konteks

Projek ini ialah sistem aduan kerosakan dan penyelenggaraan Institut Pengurusan Veterinar (IPV). Bahasa antara muka dan dokumentasi utama ialah Bahasa Melayu.

Sasaran ialah PWA mesra telefon dan staf dengan literasi digital rendah. GitHub ialah sumber kod utama; workspace cloud boleh digunakan dan local repository pada komputer pengguna tidak diperlukan.

Baca `README.md` dan `PROJECT.md` sebelum mengubah projek. Kedua-duanya membezakan fakta semasa, cadangan dan keputusan yang belum dibuat.

Projek GAS yang diberikan pemilik:

`1f4XhGnl6DAIMLJBzt5i7ZOk5zVCFPf7IgUtZxVKCTCXziQAahqq-TEmG`

Script ID tidak membuktikan bahawa akses tersedia. Periksa kandungan sebenar GAS sebelum mengganti, menarik atau menghantar kod. Jangan anggap GAS kosong kerana repository bermula kosong.

## Cara bekerja

- Teruskan kerja yang telah diminta atau dibenarkan. Gunakan pertimbangan sendiri untuk pilihan pelaksanaan rutin dan boleh dibalikkan.
- Tanya hanya apabila keputusan yang belum diketahui benar-benar mempengaruhi hasil, akses atau data.
- Maklumkan pemilik tentang perubahan skop, cadangan baharu yang penting atau halangan sebenar.
- Jangan melaksanakan semua ciri tambahan hanya kerana ia disebut sebagai cadangan.
- Utamakan aliran aduan asas sebelum dashboard dan notifikasi.
- Jangan menambah keperluan kelulusan baharu melalui dokumentasi tanpa sebab atau arahan pemilik.

## Kod dan data

- Dalam Fasa 1, hanya dokumentasi repository boleh diubah. Audit GAS adalah read-only: jangan jalankan `clasp push`, ubah kod/deployment/keselamatan, ubah data atau cipta spreadsheet production. Jangan bina fungsi baharu.

- Simpan kod sumber dan dokumentasi dalam GitHub; rekod aduan sebenar berada dalam stor data aplikasi.
- Jangan commit data pengadu, gambar aduan sebenar, token, kata laluan atau kelayakan akses.
- Gunakan data rekaan untuk contoh dan ujian.
- Asingkan konfigurasi persekitaran daripada logik aplikasi.
- Jika menggunakan alat penyelarasan GAS, semak projek sasaran dan fail yang akan berubah sebelum operasi tulis.
- Jangan menulis ganti perubahan GAS atau GitHub yang belum diperiksa.
- Jangan mendakwa kod telah dipasang di GAS hanya kerana fail tempatan atau commit GitHub telah dibuat.

## Pelaksanaan

- Semak input pada pelayan, termasuk ID aduan, status dan medan wajib.
- Semak kebenaran membaca atau mengubah data pada pelayan.
- Pastikan ID aduan unik dan kendalikan penghantaran serentak atau berulang.
- Kekalkan sejarah tindakan apabila status atau pegawai tindakan berubah.
- Paparkan kejayaan hanya selepas operasi simpanan berjaya.
- Pastikan mesej ralat membantu pengguna tanpa mendedahkan data atau butiran dalaman yang sensitif.
- Pastikan borang sesuai digunakan pada telefon dan komputer.
- Tetapan akses, identiti pelaksana deployment dan akses lampiran perlu diketahui sebelum penggunaan sebenar.

## Pengesahan dan laporan

- Pilih semakan yang sesuai dengan perubahan; jangan menambah ujian yang hanya mengulang pelaksanaan.
- Untuk aliran simpanan atau akses, uji kejayaan, kegagalan dan pengguna tanpa kebenaran.
- Jangan menggunakan aduan sebenar untuk ujian tanpa arahan yang sesuai.
- Laporkan fail yang berubah, hasil semakan dan perkara yang belum boleh diuji.
- Bezakan status fail tempatan, commit/push GitHub, kod GAS dan deployment aplikasi.
- Kemas kini `PROJECT.md` apabila keputusan atau skop berubah, serta `README.md` apabila status projek berubah.

## Status checkpoint Fasa 3.1

Source diterima melalui ZIP pemilik dan disimpan dalam `gas/`; baca `docs/CHECKPOINT_PHASE_3_1.md` sebelum membuat perubahan. Staf menggunakan dropdown nama tanpa Google Sign-In mengikut keputusan pemilik. Dashboard admin belum tersedia. Pemasangan PWA belum dilaksanakan.

Tugas checkpoint hanya membenarkan salinan kod dan dokumentasi GitHub: jangan ubah GAS asal, deployment atau Sheets/Drive; jangan jalankan fungsi setup atau ujian yang menulis data. Emel admin telah disamarkan dalam salinan repository; source asal dan Script Properties tidak diubah. Ujian runtime yang dilaporkan pemilik mesti dibezakan daripada semakan statik sesi ini.

Fasa berikutnya ialah Dashboard Urus Setia. Sebelum endpoint admin dibina, sahkan identiti admin di pelayan; dropdown nama atau emel dari browser tidak memberikan kebenaran admin.
