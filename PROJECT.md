# Pelan Projek iADUAN IPV

Tarikh asas dokumentasi: 13 Oktober 2026.

## Status terkini — checkpoint Admin Fasa 4.4

Pada 14 Oktober 2026, enam fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.4.4.zip`. Checkpoint ini menyambung Fasa 4.3 (`9d74856`) pada branch `main`. Folder aplikasi staf `gas/` dikekalkan tanpa perubahan.

Fasa 4.4 menambah `AdminHistoryService.gs` dan butang Sejarah Tindakan pada dashboard. Backend menyemak admin, ID aduan, database DEV serta kewujudan aduan, kemudian membaca rekod berkaitan dalam TINDAKAN. Paparan menunjukkan tarikh, status asal/baharu, pihak bertanggungjawab, catatan dan tarikh sasaran; butang tunjuk/sembunyi sejarah tersedia.

**Ujian yang dilaporkan pemilik:** backend berjaya membaca dua rekod sejarah; paparan dashboard serta regresi asas gambar, Rekod Tindakan dan tunjuk/sembunyi berjaya. Sesi penyimpanan ini tidak mengulang ujian GAS atau operasi data. Penggunaan production belum diuji.

**Semakan sesi ini:** sintaks empat fail GS secara individu/gabungan, JavaScript HTML, struktur tag HTML dan manifest lulus. Source dibandingkan dengan ZIP dan remote; hanya fail sejarah baharu serta HTML berubah. Emel admin dan ID database disamarkan dengan placeholder checkpoint terdahulu. Tiada GAS asal, deployment, Sheets atau Drive diubah.

Sejarah dipaparkan terbaharu dahulu berdasarkan baris rekod yang ditambah secara kronologi: kod menggunakan `.reverse()`, bukan pengisihan timestamp. Jika baris TINDAKAN disusun semula, susunan paparan mungkin tidak mengikut tarikh. Source dikekalkan; batas ini direkodkan untuk penilaian seterusnya.

## Prinsip dan objektif projek

| Prinsip | Panduan pelaksanaan |
| --- | --- |
| **Zero Cost First** | Utamakan sumber sedia ada dan pilihan tanpa kos tambahan; semak quota, storan dan keperluan sebenar sebelum perkhidmatan berbayar. Ini keutamaan reka bentuk, bukan jaminan kos sifar tanpa had. |
| **Mobile First** | Utamakan borang dan dashboard yang mudah digunakan pada telefon; butang, teks dan aliran mesti jelas pada skrin kecil. |
| **User Friendly** | Gunakan Bahasa Melayu ringkas, langkah minimum dan maklum balas jelas untuk staf dengan literasi digital rendah. |
| **Sustainable** | Kekalkan kod/dokumentasi yang mudah diselenggara, konfigurasi persendirian, sejarah versi, backup dan panduan pemulihan serta serahan tugas. |

Objektif projek ialah PWA dengan ikon Home Screen, kesinambungan pentadbiran apabila pegawai bertukar, dan rekod penyelenggaraan berpusat yang boleh dijejaki. PWA/ikon Home Screen ialah objektif, bukan fungsi yang sudah dibuktikan dalam snapshot Admin ini. Rekod ADUAN dan TINDAKAN menjadi asas rekod berpusat; panduan backup dan serahan pentadbiran perlu terus dibangunkan.

## Pemulihan konfigurasi checkpoint Fasa 4.4

Dalam `gas-admin/Code.gs` salinan GitHub sahaja, `ADMIN_CONFIG.databaseId` ialah `REPLACE_WITH_DEV_SPREADSHEET_ID` dan `ADMIN_CONFIG.adminEmail` ialah `admin@example.invalid`. Pendekatan ini sama dengan Fasa 4.2/4.3. Lima fail lain dikekalkan byte-for-byte daripada ZIP; tiada perubahan logik tambahan dibuat.

Untuk pemulihan kemudian, ambil dua nilai sebenar daripada ZIP asal yang disimpan persendirian atau konfigurasi GAS pemilik, dan gantikan placeholder dalam salinan kerja persendirian. Sahkan database DEV serta akaun admin yang betul. Jangan commit nilai dipulihkan atau data aduan ke repository public. Tugas ini tidak memulihkan atau mengubah konfigurasi GAS sebenar.

## Semakan diff dan batas Fasa 4.4

- `gas-admin/AdminHistoryService.gs`: fail baharu, membaca sejarah sahaja; mengembalikan tarikh, admin, status, catatan, pihak bertanggungjawab dan tarikh sasaran. Data sebenar dibaca ketika aplikasi dijalankan, bukan disimpan dalam kod GitHub.
- `gas-admin/AdminDashboard.html`: tambahan pemuatan sejarah, keadaan kosong/ralat dan butang tunjuk/sembunyi; teks dinamik menggunakan textContent.
- `Code.gs`, `AdminActionService.gs`, `AdminImageService.gs` dan `appsscript.json`: hash selepas redaksi sama dengan remote Fasa 4.3.
- `gas/`, AGENTS.md dan dokumentasi checkpoint terdahulu tidak diubah.
- Manifest kekal V8, Asia/Singapore, dependencies kosong, USER_ACCESSING / MYSELF; ini bukan pengesahan deployment aktif.
- Log ujian `testAdminActionHistory()` boleh mengandungi emel admin dan catatan sebenar ketika dijalankan. Log/data tersebut tidak disalin atau dijalankan dalam tugas ini.
- Kaedah reverse mengandaikan baris ditambah mengikut masa. Sejarah belum diisih timestamp secara khusus; jangan mendakwa ia tahan terhadap penyusunan semula baris.
- Batas Fasa 4.3 tentang rollback, idempotensi dan fungsi ujian yang menulis data masih terpakai. Ia tidak diubah dalam checkpoint ini.
- Tiada production readiness atau keputusan ujian runtime baharu didakwa. Tunggu arahan pemilik sebelum pembangunan/deployment seterusnya.

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

## Checkpoint terdahulu — Fasa 3.1 (gas/)

Snapshot enam fail sebenar diterima melalui ZIP pemilik pada 13 Oktober 2026. Semakan statik mengenal pasti borang, dropdown staf, simpanan aduan, ID berurutan, validasi gambar dan penyimpanan Drive. Pemilik melaporkan ujian berjaya termasuk 13 staf dan rujukan terakhir `IPV-2026-0002`; sesi ini tidak menjalankan semula fungsi GAS.

| Perkara | Status semasa |
| --- | --- |
| Lokasi | Teks bebas wajib, maksimum 150 aksara |
| Keterangan | 5–2000 aksara |
| Gambar | Maksimum 3; 5 MB setiap fail; JPEG/PNG/WebP |
| Database DEV | ADUAN, TINDAKAN, PENGGUNA, KONFIGURASI |
| Staf | Dropdown nama tanpa login; bukan bukti identiti |
| Urus setia | Snapshot staf hanya menyediakan helper whitelist; dashboard baca sahaja kini disimpan dalam gas-admin/ |
| Manifest | MYSELF / USER_DEPLOYING; deployment sebenar belum diperiksa |
| PWA | Belum ada manifest PWA atau service worker |
| Konfigurasi | ID spreadsheet/folder dalam Script Properties; nilainya tidak disalin |
| Langkah berikutnya | Fasa 4 — Dashboard Urus Setia dengan identiti admin yang disahkan di pelayan |

Lihat [nota checkpoint](docs/CHECKPOINT_PHASE_3_1.md). Pilihan Google Sign-In untuk staf dalam cadangan awal di bawah telah diganti dengan dropdown nama mengikut keputusan pemilik. Kawalan admin masih diperlukan sebelum fungsi pentadbiran boleh digunakan. Kod asal tidak diubah; emel admin dalam salinan GitHub disamarkan.

## Pelan asal Fasa 1 — rekod sejarah

Bahagian berikut dikekalkan daripada dokumen workspace asal sebagai rekod perancangan. Status seperti spreadsheet belum ada, keperluan login staf dan struktur tab cadangan di bawah bukan status semasa; rujuk seksyen Kedudukan terkini serta source `gas/`.

## Objektif

Menyediakan saluran aduan kerosakan dalaman IPV yang mudah digunakan dan mempunyai rekod tindakan yang boleh dijejaki.

Sasaran produk ialah PWA HTML/CSS/JavaScript yang mesra telefon dan staf dengan literasi digital rendah. GAS, Sheets dan Drive ialah cadangan teknologi yang perlu dinilai melalui audit. GitHub menjadi sumber kod utama; workspace cloud dibenarkan tanpa local repository pada komputer pengguna.

Hasil yang disasarkan:

- Aduan diterima dengan maklumat yang mencukupi.
- Setiap aduan mempunyai nombor rujukan unik.
- Pentadbir boleh mengetahui status dan pegawai tindakan.
- Sejarah tindakan dikekalkan untuk rujukan.

## Fakta dan cadangan

| Perkara | Kedudukan |
| --- | --- |
| GitHub | Telah diwujudkan: https://github.com/zulfahmi3938/iAduanIPV |
| GAS | Script ID telah diberikan; kandungan belum diperiksa |
| Spreadsheet | Belum ada, berdasarkan maklumat pemilik projek |
| Google Sheets sebagai stor rekod | Cadangan asas; belum dilaksanakan |
| Drive sebagai stor lampiran | Cadangan jika gambar diperlukan |
| Akses aplikasi | Belum diputuskan |
| Deployment | Belum diperiksa atau disahkan |

## Pengguna dan aliran kerja yang dicadangkan

| Peranan | Fungsi |
| --- | --- |
| Staf / pengadu | Menghantar aduan, melampirkan gambar, menerima nombor rujukan dan menyemak status aduan yang dibenarkan |
| Urus setia / pentadbir | Menyemak aduan, menetapkan pihak bertanggungjawab, mengemas kini status dan merekodkan penyelesaian |
| Pegawai tindakan | Menjalankan tindakan; akses terus ke sistem belum diputuskan |

Aliran asas: pengadu menghantar borang → sistem menyimpan aduan → nombor rujukan dipaparkan → pentadbir menyemak → tindakan direkod → aduan diselesaikan.

Status awal yang dicadangkan:

| Status | Maksud |
| --- | --- |
| Baharu | Aduan diterima dan belum disemak |
| Dalam Tindakan | Aduan sedang diuruskan |
| Selesai | Tindakan selesai dan catatan penyelesaian direkodkan |

Keperluan status tambahan, pembatalan, penolakan atau pembukaan semula aduan akan ditentukan berdasarkan operasi sebenar.

## Struktur spreadsheet yang dicadangkan

Struktur ini ialah draf, bukan spreadsheet yang sudah diwujudkan. ID aduan menjadi penghubung antara rekod aduan dan log tindakan. Elakkan menggunakan nombor baris sebagai ID kekal kerana susunan baris boleh berubah.

### Tab `Aduan`

| Medan | Tujuan |
| --- | --- |
| `id_aduan` | Nombor rujukan unik |
| `tarikh_dicipta` | Masa penerimaan aduan |
| `nama_pengadu` | Nama pengadu |
| `emel_pengadu` | Hubungan atau pengenalan pengguna, mengikut kaedah akses |
| `lokasi_id` | Rujukan kepada tab Lokasi |
| `kategori` | Kategori kerosakan yang dipersetujui |
| `keterangan` | Butiran kerosakan |
| `lampiran_id` | Rujukan fail Drive jika gambar dilaksanakan |
| `status` | Status semasa |
| `pegawai_tindakan` | Pegawai yang menguruskan aduan |
| `tarikh_dikemas_kini` | Masa perubahan terakhir |
| `tarikh_selesai` | Masa penyelesaian; kosong sebelum selesai |

Medan wajib, had panjang keterangan, format nombor rujukan dan kategori belum dimuktamadkan. Jangan mengumpul nombor telefon atau maklumat tambahan tanpa tujuan operasi yang jelas.

### Tab `Lokasi`

| Medan | Tujuan |
| --- | --- |
| `lokasi_id` | Pengenal lokasi yang stabil |
| `nama_lokasi` | Nama yang dipaparkan dalam borang |
| `aktif` | Sama ada lokasi masih boleh dipilih |

### Tab `Log_Tindakan`

| Medan | Tujuan |
| --- | --- |
| `id_log` | Pengenal unik bagi catatan |
| `id_aduan` | Aduan berkaitan |
| `tarikh_tindakan` | Masa tindakan direkodkan |
| `pelaku` | Pengguna yang membuat perubahan |
| `status_sebelum` | Status sebelum perubahan |
| `status_selepas` | Status selepas perubahan |
| `catatan` | Keterangan tindakan atau penyelesaian |

Log tindakan dicadangkan sebagai rekod tambahan yang tidak ditulis ganti setiap kali status berubah. Sebarang pembetulan perlu dapat dijejaki.

## Konfigurasi dan akses

- Cadangan konfigurasi: ID spreadsheet, ID folder lampiran dan senarai pentadbir disimpan secara berpusat. Lokasi konfigurasi sebenar akan dipilih semasa pembangunan.
- Tentukan sama ada akses menggunakan akaun Google organisasi, akaun Google tertentu atau kaedah lain sebelum membina kawalan akses.
- Semakan kebenaran pentadbir mesti dibuat pada bahagian pelayan, termasuk untuk membaca senarai aduan dan mengubah rekod.
- Jangan dedahkan senarai penuh aduan kepada semua pengadu secara lalai.
- Jika semakan status pengadu ditambah, tentukan cara memastikan pengadu hanya melihat rekod yang dibenarkan.
- Akses gambar mesti sepadan dengan akses rekod aduan; jangan jadikan folder atau fail boleh dicapai secara umum tanpa keputusan pemilik projek.
- Tempoh penyimpanan dan pemadaman data perlu diputuskan sebelum penggunaan sebenar.

## Pelan pembangunan

| Peringkat | Kerja | Syarat siap |
| --- | --- | --- |
| 1. Pemeriksaan | Periksa GAS dan sahkan keperluan | Kod sedia ada serta keputusan akses dikenal pasti |
| 2. Data | Wujudkan spreadsheet dan konfigurasi | Tab serta medan disahkan dengan data ujian |
| 3. Penghantaran | Bina borang dan simpan aduan | Aduan sah disimpan dan nombor rujukan dipaparkan |
| 4. Pentadbiran | Bina senarai, kemas kini status dan log | Pengguna dibenarkan boleh mengurus aduan |
| 5. Pengesahan | Uji aliran, akses dan ralat | Semakan penerimaan lulus |
| 6. Penggunaan | Sahkan deployment dan panduan ringkas | Pemilik projek mengesahkan tetapan penggunaan |

## Semakan penerimaan versi pertama

- Borang menolak aduan yang tiada maklumat wajib.
- Aduan sah disimpan dengan ID unik, termasuk apabila dua penghantaran berlaku hampir serentak.
- Penghantaran berganda akibat klik berulang dikendalikan dengan jelas.
- Borang memaparkan kejayaan hanya selepas rekod berjaya disimpan.
- Ralat simpanan ditunjukkan tanpa mendakwa aduan berjaya.
- Pentadbir boleh mengemas kini status dan melihat sejarah tindakan.
- Pengguna tanpa kebenaran tidak boleh membaca senarai pentadbiran atau mengubah rekod.
- Status Selesai merekodkan masa dan catatan penyelesaian.
- Borang boleh digunakan pada telefon dan komputer.
- Jika gambar dilaksanakan, had jenis/saiz, kegagalan muat naik dan akses lampiran diuji.

## Keputusan yang masih diperlukan

1. Kandungan sedia ada dalam GAS dan kaedah penyelarasan dengan GitHub.
2. Akaun yang dibenarkan menggunakan sistem serta identiti pentadbir.
3. Senarai lokasi, kategori kerosakan dan medan wajib.
4. Had bilangan/saiz gambar dan kaedah akses lampiran; lampiran gambar ialah keperluan projek.
5. Kaedah semakan status staf dan saluran notifikasi; semakan status ialah keperluan projek.
6. Zon waktu aplikasi dan spreadsheet; cadangan operasi IPV ialah `Asia/Kuala_Lumpur`.
7. Pemilikan fail, tempoh penyimpanan data dan tetapan deployment.

Keputusan ini boleh diperincikan secara berperingkat. Jangan menganggap cadangan dalam fail ini sebagai kelulusan untuk mendedahkan data atau menukar tetapan akses.

## Skop Fasa 1 yang dibenarkan

Semak dan masukkan dokumentasi asal ke GitHub, commit/push jika akses tersedia, audit GAS secara read-only dan sediakan cadangan seni bina. Jangan bina fungsi baharu, mengubah GAS/deployment/keselamatan, menjalankan `clasp push`, meminda data atau mencipta spreadsheet production.

## Rekod perubahan

| Tarikh | Perubahan |
| --- | --- |
| 2026-10-13 | Dokumentasi awal disediakan berdasarkan repository kosong dan Script ID yang diberikan. Tiada spreadsheet, kod aplikasi atau deployment diubah. |
| 2026-10-13 | Arahan Fasa 1 diselaraskan: sasaran PWA, gambar dan semakan status staf, peranan urus setia, GitHub sebagai sumber kod utama dan audit GAS read-only. |
| 2026-10-13 | Commit dokumentasi tempatan siap; push gagal kerana tiada pengesahan GitHub. Kandungan GAS tidak diperoleh; laporan dan cadangan bersyarat tersedia dalam PHASE1_REPORT.md. |

Tambah keputusan atau perubahan penting di sini, dan kemas kini README jika status projek berubah.
