# Checkpoint iADUAN IPV Fasa 3.1

Tarikh: 13 Oktober 2026. Source: ZIP `iADUAN_IPV_GAS_v0.3.1.zip` yang dibekalkan pemilik. Tiada source direka semula daripada penerangan atau screenshot.

## Penyimpanan dan redaksi

Enam fail dalam `gas/` disalin daripada ZIP. Lima fail dikekalkan byte-for-byte. Dalam `Code.gs` sahaja, dua kemunculan emel whitelist admin sebenar diganti dengan `admin@example.invalid` (konfigurasi dan fixture ujian). Tiada perubahan logik lain dibuat. Jangan gunakan placeholder ini untuk mengaktifkan akses admin; nilai sebenar perlu disediakan secara persendirian apabila konfigurasi admin dibangunkan.

Tiada nilai Script Properties, spreadsheet, rekod aduan, gambar, senarai staf, kelayakan OAuth atau deployment credentials disalin. Key konfigurasi yang diperlukan ialah `IADUAN_DEV_SPREADSHEET_ID` dan `IADUAN_DEV_IMAGE_FOLDER_ID`. GitHub ialah backup source, bukan backup data atau persekitaran GAS lengkap.

## Semakan yang dilakukan

- Semua enam fail dibaca dan diperiksa untuk secrets/data tertanam; token/password/private key tidak ditemui. Emel operasi admin disamarkan sebelum penerbitan public.
- Sintaks empat fail GS dan JavaScript dalam Index.html diperiksa menggunakan parser Node tanpa menjalankan kod aplikasi.
- Manifest diparse sebagai JSON: V8, Asia/Singapore, dependencies kosong, webapp MYSELF / USER_DEPLOYING.
- Hash lima fail tanpa redaksi dibandingkan dengan ZIP asal. Hash salinan repository direkodkan di bawah.
- Tiada fungsi GAS, deployment, operasi Sheets/Drive atau ujian hujung ke hujung dijalankan.

Pemilik melaporkan aliran pembangunan berjaya: database DEV, dropdown 13 staf, borang, lokasi teks bebas, nombor rujukan, simpanan aduan dan upload gambar serta ID gambar dalam Sheets. Rujukan ujian terakhir: `IPV-2026-0002`. Ini laporan pemilik, bukan keputusan runtime sesi checkpoint.

## Dapatan source dan baki pembangunan

- Code.gs menyediakan konfigurasi, helper whitelist/peranan dan doGet untuk Index.html. Nilai versi utama masih 0.1.0; footer UI masih v0.3. Checkpoint ini dinamakan Fasa 3.1 berdasarkan ZIP dan fungsi gambar, tanpa mengubah nilai versi asal.
- DatabaseSetup.gs menyediakan tab ADUAN, TINDAKAN, PENGGUNA, KONFIGURASI dan menyimpan ID DEV dalam Script Properties.
- ComplaintService.gs menyediakan dropdown nama, validasi, perlindungan formula Sheets, ScriptLock, penjanaan nombor rujukan, had global 100 aduan/hari dan simpanan row dengan ID gambar.
- ImageService.gs menyemak saiz, MIME dan signature asas JPEG/PNG/WebP. Fail separa dibersihkan apabila upload/simpanan gagal; tiada transaksi atomik merentas Drive dan Sheets.
- Staf memilih nama tanpa autentikasi. Helper role/whitelist bukan login admin. Tiada dashboard, kemas kini status, sejarah tindakan aktif atau semakan aduan staf dalam snapshot.
- Fungsi setup/check/test yang tidak berakhiran underscore masih top-level. Semak kawalan akses fungsi yang boleh dipanggil melalui google.script.run sebelum meluaskan akses deployment, khususnya setupDatabase/setupImageFolder/checkDatabase/checkImageFolder/testStaffDropdown. Checkpoint tidak mengubah fungsi tersebut.
- Manifest MYSELF menunjukkan sasaran akses pemilik dalam snapshot; bukan pengesahan konfigurasi deployment yang sedang aktif. Kekalkan DEVELOPMENT sehingga kawalan akses siap.
- Penjanaan nombor rujukan membaca semua ID; sesuai dinilai semula apabila data berkembang. Kunci global dipegang semasa upload, jadi penghantaran besar boleh melambatkan permintaan lain.
- Butang frontend menghalang klik berganda pada halaman sama; belum ada kunci idempotensi backend untuk retry rangkaian. Jangan anggap ia perlindungan duplikasi lengkap.
- Zon waktu manifest Asia/Singapore dan kod Asia/Kuala_Lumpur berbeza pada nama konfigurasi; selaraskan dalam tugasan pembangunan akan datang, tanpa mengubah snapshot ini.
- Tiada PWA manifest/service worker, backup data atau notifikasi dalam source yang diterima.

## Langkah berikutnya

Fasa 4: Dashboard Urus Setia. Mulakan dengan kaedah pengesahan admin, semakan kebenaran setiap fungsi pelayan, senarai aduan, butiran dan paparan gambar secara terhad. Kemudian tambah status/tindakan/sejarah dan ujian akses. Jangan menganggap login Google staf diwajibkan; keputusan staf tanpa login sudah direkodkan.

## Hash SHA-256 salinan repository

| Fail | SHA-256 |
| --- | --- |
| gas/Code.gs | `15d761fad79a3628c66c9f233eb0ab29c46482ee402b63f71efdc93f75d54980` |
| gas/ComplaintService.gs | `f2e4d96e759d12e97224ef5c01dd86e31dd5166d5f591ebd1f98788e16851611` |
| gas/DatabaseSetup.gs | `37f673d33c73a297c671bec45a20331b83d36524e3f1aba899ee3b63959ff2b6` |
| gas/ImageService.gs | `815de1eb66c94ad7c8a7999552da6c7d4854f33305a6f2446ce6a6b16faaf1ae` |
| gas/Index.html | `24c97177781365de77d3225bc6863dd35a86cebae18dbdfa0231f0e4407de515` |
| gas/appsscript.json | `b8e8389e9c8393e3c393b80e00de07182f3bc39ea62c463fa96e19c865bedcb1` |
