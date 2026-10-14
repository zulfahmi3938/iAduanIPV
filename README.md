# iADUAN IPV

Sistem pengurusan aduan kerosakan dan penyelenggaraan untuk Institut Pengurusan Veterinar (IPV), dengan sasaran Progressive Web App (PWA) yang ringkas dan mesra telefon pintar.

Projek ini bertujuan memudahkan warga IPV menghantar aduan serta membantu pentadbir merekod, memantau dan mengemas kini tindakan penyelenggaraan.

## Status terkini — checkpoint Admin Fasa 5.0A

Pada 14 Oktober 2026, enam fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.5.0A.zip`. Checkpoint ini menyambung Fasa 4.4 (`4233cad`) pada branch `main`. Folder aplikasi staf `gas/` dikekalkan tanpa perubahan.

Dashboard kini mempunyai carian langsung melalui medan `id`, `location`, `description` dan `category`. Setiap input memanggil `renderComplaints()`; kata carian dipangkas dan dibandingkan tanpa mengira huruf besar/kecil. Padanan carian digabungkan dengan penapis status melalui syarat AND. Carian kosong mengekalkan penapisan status sahaja. Mesej berasingan tersedia untuk tiada padanan carian, tiada rekod bagi status dan database kosong.

**Ujian yang dilaporkan pemilik:** fungsi carian serta empat ujian regresi asas — Muat Semula, Lihat Gambar, Rekod Tindakan dan Sejarah Tindakan — lulus. Penggunaan production belum diuji.

**Semakan sesi checkpoint:** semua fail GS dan JavaScript HTML lulus parsing sintaks, termasuk deklarasi GS gabungan; struktur HTML/tag/ID dan input carian disemak; manifest kekal V8, Asia/Singapore, USER_ACCESSING / MYSELF. Sebelas semakan terasing menggunakan fungsi renderComplaints sebenar dengan DOM simulasi/data rekaan lulus untuk empat medan, normalisasi carian, gabungan status, carian kosong dan mesej tiada padanan. Ini bukan pengulangan ujian runtime GAS atau dashboard sebenar.

Diff terhadap remote Fasa 4.4 menunjukkan hanya `gas-admin/AdminDashboard.html` berubah. Lima fail Admin lain sama selepas penyamaran dua nilai konfigurasi dalam `Code.gs`. Emel admin dan ID database sebenar tidak diterbitkan; kaedah pemulihan persendirian Fasa 4.4 masih terpakai. Tiada fungsi tambahan dibina, dan tiada GAS asal, deployment, Sheets atau Drive diubah.

Carian ialah penapisan di browser terhadap rekod yang sudah dimuatkan, bukan carian backend baharu. Medan category boleh dicari apabila mempunyai nilai; checkpoint ini tidak menambah input kategori pada aplikasi staf. Pengesahan admin, sejarah dan batas terdahulu kekal. Tunggu arahan pemilik sebelum langkah pembangunan seterusnya.

## Checkpoint terdahulu — Admin Fasa 4.4

Pada 14 Oktober 2026, enam fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.4.4.zip`. Checkpoint ini menyambung Fasa 4.3 (`9d74856`) pada branch `main`. Folder aplikasi staf `gas/` dikekalkan tanpa perubahan.

Fasa 4.4 menambah `AdminHistoryService.gs` dan butang Sejarah Tindakan pada dashboard. Backend menyemak admin, ID aduan, database DEV serta kewujudan aduan, kemudian membaca rekod berkaitan dalam TINDAKAN. Paparan menunjukkan tarikh, status asal/baharu, pihak bertanggungjawab, catatan dan tarikh sasaran; butang tunjuk/sembunyi sejarah tersedia.

**Ujian yang dilaporkan pemilik:** backend berjaya membaca dua rekod sejarah; paparan dashboard serta regresi asas gambar, Rekod Tindakan dan tunjuk/sembunyi berjaya. Sesi penyimpanan ini tidak mengulang ujian GAS atau operasi data. Penggunaan production belum diuji.

**Semakan sesi ini:** sintaks empat fail GS secara individu/gabungan, JavaScript HTML, struktur tag HTML dan manifest lulus. Source dibandingkan dengan ZIP dan remote; hanya fail sejarah baharu serta HTML berubah. Emel admin dan ID database disamarkan dengan placeholder checkpoint terdahulu. Tiada GAS asal, deployment, Sheets atau Drive diubah.

Sejarah dipaparkan terbaharu dahulu berdasarkan baris rekod yang ditambah secara kronologi: kod menggunakan `.reverse()`, bukan pengisihan timestamp. Jika baris TINDAKAN disusun semula, susunan paparan mungkin tidak mengikut tarikh. Source dikekalkan; batas ini direkodkan untuk penilaian seterusnya.

## Checkpoint terdahulu — Admin Fasa 4.3

Snapshot lima fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.4.3.zip` pada 13 Oktober 2026. Folder `gas-admin/` dikemas kini daripada checkpoint Fasa 4.2; folder aplikasi staf `gas/` dikekalkan tanpa perubahan.

Fasa 4.3 menambah `AdminActionService.gs` serta borang Rekod Tindakan dalam dashboard. Backend menyemak identiti admin dan input, memastikan database DEV, mengemas kini status/tarikh dalam ADUAN dan menambah log TINDAKAN. Input termasuk status, pihak bertanggungjawab, catatan dan tarikh sasaran pilihan. UI meminta pengesahan simpan dan memuat semula data selepas kejayaan.

Pemilik melaporkan kod berjaya diuji. Sesi checkpoint ini hanya memeriksa source, sintaks GS/JavaScript, deklarasi gabungan dan manifest; tiada fungsi GAS atau operasi data dijalankan. Nilai database ID dan emel admin disamarkan dalam salinan GitHub sahaja. Manifest kekal `USER_ACCESSING` / `MYSELF`; deployment aktif tidak diperiksa.

Baca [nota Fasa 4.3](docs/CHECKPOINT_ADMIN_PHASE_4_3.md) untuk kaedah pemulihan konfigurasi, had rollback/idempotensi dan fungsi ujian yang boleh menulis data. Checkpoint ini tidak menjamin penggunaan production; langkah berikutnya ditentukan oleh pemilik selepas penyimpanan selesai.

## Checkpoint terdahulu — Admin Fasa 4.2

Pada 13 Oktober 2026, empat fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.4.2.zip` dan disimpan secara berasingan dalam `gas-admin/`. Folder `gas/` kekal sebagai checkpoint staf Fasa 3.1 tanpa perubahan.

Snapshot Admin menyediakan dashboard baca sahaja, senarai dan jumlah aduan, tapisan status, muat semula, serta paparan gambar melalui backend. `requireAdmin_()` menyemak emel pengguna aktif pada pelayan untuk halaman dashboard, senarai aduan dan gambar. Manifest Admin ialah `USER_ACCESSING` / `MYSELF`; konfigurasi deployment sebenar tidak diperiksa.

Semakan sesi ini meliputi empat fail, sintaks GS/JavaScript, JSON manifest dan pemeriksaan secrets. Tiada fungsi GAS atau ujian sambungan data dijalankan. Nilai database ID dan emel admin disamarkan dalam salinan GitHub sahaja; baca [nota pemulihan](docs/CHECKPOINT_ADMIN_PHASE_4_2.md) sebelum menggunakan snapshot.

Kemas kini status, penetapan tindakan dan penulisan sejarah belum tersedia dalam empat fail Admin ini. Langkah pembangunan seterusnya ialah menentukan serta menguji aliran kemas kini status dan log tindakan apabila diminta. Tugas semasa hanya menyimpan checkpoint.

## Checkpoint staf Fasa 3.1 — gas/

Pada 13 Oktober 2026, snapshot diterima daripada ZIP pemilik `iADUAN_IPV_GAS_v0.3.1.zip` dan disimpan dalam `gas/`. Ini salinan fail yang dibekalkan pemilik; tiada penarikan terus atau perubahan kepada projek GAS asal dilakukan.

Pemilik melaporkan ujian pembangunan berjaya: database DEV, dropdown 13 staf, borang, lokasi teks bebas, nombor rujukan, simpanan Sheets, upload Drive dan ID gambar dalam Sheets. Aduan ujian terakhir dilaporkan `IPV-2026-0002`; tiada kandungan rekod aduan dimasukkan ke repository.

Semakan setempat: keenam-enam fail tersedia, sintaks JavaScript dan JSON manifest sah, serta tiada token/password/private key atau data aduan ditemui dalam pemeriksaan kod. Ujian hujung ke hujung tidak diulang dalam sesi checkpoint ini.

- UI semasa ialah web app responsif GAS; pemasangan PWA belum dilaksanakan dalam snapshot.
- Staf memilih nama daripada dropdown tanpa Google Sign-In. Pemilihan nama bukan pengesahan identiti.
- Manifest snapshot: `executeAs: USER_DEPLOYING`, `access: MYSELF`; keadaan deployment sebenar tidak diperiksa.
- Semakan status staf, sejarah tindakan dan notifikasi belum dilaksanakan dalam enam fail staf ini. Dashboard Admin baca sahaja tersedia secara berasingan dalam `gas-admin/`.
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

## Struktur checkpoint\n\n- `gas/`: enam fail checkpoint staf Fasa 3.1, dikekalkan.\n- `gas-admin/`: enam fail checkpoint dashboard Admin Fasa 5.0A, termasuk carian, pengurusan tindakan dan sejarah.\n- Jangan menggabungkan kedua-dua folder ke satu projek GAS tanpa pemeriksaan: masing-masing mempunyai `Code.gs`, `doGet()` dan manifest sendiri.\n\n## Dokumentasi

- [PROJECT.md](PROJECT.md): skop, cadangan struktur data, keputusan tertunggak dan pelan pembangunan.
- [AGENTS.md](AGENTS.md): arahan untuk pembantu pembangunan yang bekerja dalam repository.
- [PHASE1_REPORT.md](PHASE1_REPORT.md): laporan sejarah Fasa 1; status akses/kod di dalamnya bukan status semasa.
- [docs/CHECKPOINT_PHASE_3_1.md](docs/CHECKPOINT_PHASE_3_1.md): asal snapshot, semakan, redaksi dan batas penggunaan.

Dokumentasi akan dikemas kini apabila keputusan dibuat atau pelaksanaan berubah. Bezakan dengan jelas cadangan, fungsi yang sudah dibina dan fungsi yang sudah diuji.

## Had tugas checkpoint semasa

Hanya salinan kod serta dokumentasi GitHub disimpan. Jangan mengubah GAS asal, menjalankan fungsi setup, melakukan `clasp push`, mengubah deployment atau meminda data Sheets/Drive. Dashboard Admin Fasa 5.0A sudah disalin ke `gas-admin/`, termasuk carian langsung bersama penapis status. Tugas semasa hanya menyimpan kod dan menyemak secara setempat; tiada fungsi GAS dijalankan.
