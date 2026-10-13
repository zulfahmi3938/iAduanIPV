# iADUAN IPV

Sistem pengurusan aduan kerosakan dan penyelenggaraan untuk Institut Pengurusan Veterinar (IPV), dengan sasaran Progressive Web App (PWA) yang ringkas dan mesra telefon pintar.

Projek ini bertujuan memudahkan warga IPV menghantar aduan serta membantu pentadbir merekod, memantau dan mengemas kini tindakan penyelenggaraan.

## Status semasa — checkpoint Fasa 3.1

Pada 13 Oktober 2026, snapshot diterima daripada ZIP pemilik `iADUAN_IPV_GAS_v0.3.1.zip` dan disimpan dalam `gas/`. Ini salinan fail yang dibekalkan pemilik; tiada penarikan terus atau perubahan kepada projek GAS asal dilakukan.

Pemilik melaporkan ujian pembangunan berjaya: database DEV, dropdown 13 staf, borang, lokasi teks bebas, nombor rujukan, simpanan Sheets, upload Drive dan ID gambar dalam Sheets. Aduan ujian terakhir dilaporkan `IPV-2026-0002`; tiada kandungan rekod aduan dimasukkan ke repository.

Semakan setempat: keenam-enam fail tersedia, sintaks JavaScript dan JSON manifest sah, serta tiada token/password/private key atau data aduan ditemui dalam pemeriksaan kod. Ujian hujung ke hujung tidak diulang dalam sesi checkpoint ini.

- UI semasa ialah web app responsif GAS; pemasangan PWA belum dilaksanakan dalam snapshot.
- Staf memilih nama daripada dropdown tanpa Google Sign-In. Pemilihan nama bukan pengesahan identiti.
- Manifest snapshot: `executeAs: USER_DEPLOYING`, `access: MYSELF`; keadaan deployment sebenar tidak diperiksa.
- Dashboard urus setia, semakan status staf, sejarah tindakan dan notifikasi belum dilaksanakan dalam enam fail ini.
- Emel whitelist admin disamarkan dalam salinan GitHub sahaja. Baca [nota checkpoint](docs/CHECKPOINT_PHASE_3_1.md) sebelum menggunakan salinan ini.

## Rujukan projek

| Perkara | Rujukan |
| --- | --- |
| Repository | https://github.com/zulfahmi3938/iAduanIPV |
| Script ID | `1f4XhGnl6DAIMLJBzt5i7ZOk5zVCFPf7IgUtZxVKCTCXziQAahqq-TEmG` |
| Editor GAS | https://script.google.com/home/projects/1f4XhGnl6DAIMLJBzt5i7ZOk5zVCFPf7IgUtZxVKCTCXziQAahqq-TEmG/edit |
| Spreadsheet ID | Belum ditetapkan |
| Folder gambar | Belum ditetapkan |
| URL aplikasi | Belum ditetapkan |

Script ID ialah rujukan projek, bukan bukti akses atau tetapan deployment. Jangan simpan token, kata laluan atau kelayakan akses dalam repository.

## Sasaran produk dan baki pembangunan

1. Borang penghantaran aduan kerosakan.
2. Nombor rujukan unik bagi setiap aduan yang berjaya disimpan.
3. Paparan senarai dan butiran aduan untuk pentadbir.
4. Kemas kini status, pegawai tindakan dan catatan tindakan.
5. Sejarah tindakan bagi setiap aduan.
6. Lampiran gambar dan semakan status aduan oleh staf yang dibenarkan.

Upload gambar tersedia dalam snapshot; semakan status masih baki pembangunan. kaedah muat naik, identiti pengguna dan akses masih perlu diputuskan. Dashboard urus setia dibina selepas aliran penghantaran asas; notifikasi dan laporan lanjutan menyusul. Kebolehan pemasangan PWA perlu disahkan melalui audit seni bina dan ujian telefon, bukan diandaikan tersedia pada GAS.

## Seni bina yang dicadangkan

| Komponen | Peranan | Status |
| --- | --- | --- |
| Google Apps Script | Logik aplikasi dan antara muka web | Projek tersedia; kandungan belum diperiksa |
| Google Sheets | Database DEV dengan tab ADUAN, TINDAKAN, PENGGUNA, KONFIGURASI | Setup tersedia; kejayaan ujian dilaporkan pemilik |
| Google Drive | Gambar aduan dalam folder DEV | Setup/upload tersedia; kejayaan ujian dilaporkan pemilik |
| GitHub | Kod sumber dan dokumentasi | Repository tersedia |

Penggunaan Google Sheets dan Drive untuk data projek masih perlu disahkan sesuai dengan keperluan organisasi.

## Panduan pembangunan

1. Baca snapshot `gas/` dan nota checkpoint sebelum menambah atau menggantikan kod.
2. Sahkan aliran kerja, medan borang dan siapa yang boleh mengakses sistem.
3. Gunakan database DEV sedia ada. Jangan jalankan setup atau mencipta database semasa tugas checkpoint.
4. Tetapkan ID spreadsheet dan folder lampiran melalui konfigurasi, bukan berulang kali dalam kod.
5. Bawa kod GAS ke repository dan pilih kaedah penyelarasan kod.
6. Bina serta uji aliran aduan asas dengan data ujian.
7. Sahkan tetapan akses sebelum membuat deployment untuk penggunaan sebenar.

GitHub ialah sumber kod utama. Pembangunan boleh menggunakan workspace sementara atau cloud; pengguna tidak perlu menyediakan local repository. Untuk menyediakan workspace pembangunan baharu, clone repository yang sama:

```bash
git clone https://github.com/zulfahmi3938/iAduanIPV.git
```

Kaedah penyelarasan GAS dengan repository belum ditetapkan. Menyimpan kod di GitHub tidak secara automatik mengemas kini GAS atau deployment aplikasi.

## Dokumentasi

- [PROJECT.md](PROJECT.md): skop, cadangan struktur data, keputusan tertunggak dan pelan pembangunan.
- [AGENTS.md](AGENTS.md): arahan untuk pembantu pembangunan yang bekerja dalam repository.
- [PHASE1_REPORT.md](PHASE1_REPORT.md): laporan sejarah Fasa 1; status akses/kod di dalamnya bukan status semasa.
- [docs/CHECKPOINT_PHASE_3_1.md](docs/CHECKPOINT_PHASE_3_1.md): asal snapshot, semakan, redaksi dan batas penggunaan.

Dokumentasi akan dikemas kini apabila keputusan dibuat atau pelaksanaan berubah. Bezakan dengan jelas cadangan, fungsi yang sudah dibina dan fungsi yang sudah diuji.

## Had tugas checkpoint semasa

Hanya salinan kod serta dokumentasi GitHub disimpan. Jangan mengubah GAS asal, menjalankan fungsi setup, melakukan `clasp push`, mengubah deployment atau meminda data Sheets/Drive. Fasa 4 ialah Dashboard Urus Setia selepas checkpoint disahkan.
