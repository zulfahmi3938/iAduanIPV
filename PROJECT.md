# Pelan Projek iADUAN IPV

Tarikh asas dokumentasi: 13 Oktober 2026.

## Status terkini — checkpoint Admin Fasa 6.1A: Pencegahan Rekod Tindakan Berganda

Pada 15 Oktober 2026, enam fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.6.1A.zip`. Branch main disahkan pada `9d4bde6` sebelum penyediaan checkpoint ini. Snapshot disimpan dalam gas-admin/; folder gas/ aplikasi staf dikekalkan tanpa perubahan.

Frontend menjana actionId dengan `window.crypto.randomUUID()` selepas input dan pengesahan pengguna lulus. UUID disimpan sebagai pendingActionId dalam memori borang dan disertakan dalam payload. Backend validateAdminAction_ memeriksa format UUID, dan saveAdminAction memanggil assertActionIdNotUsed_ **selepas ScriptLock diperoleh dan sebelum menulis sejarah**. Pengesanan ID tidak membezakan huruf besar/kecil. UUID daripada permintaan digunakan sebagai ID rekod, menggantikan penjanaan baharu semasa save.

Endpoint baca sahaja `checkAdminActionSaveStatus()` mengesahkan admin, UUID dan database DEV sebelum membaca kolum ID TINDAKAN. Butang **Semak Status Simpanan** muncul apabila respons simpanan tidak dapat dipastikan; ia mengendalikan found:true, found:false dan ralat. Handler semakan tidak lagi memanggil loadComplaints, supaya borang serta mesej semakan tidak hilang. Tiada penghantaran semula automatik; simpan kekal dikunci apabila hasil belum pasti.

Audit sintaks GS/JavaScript, deklarasi gabungan, HTML/ID dan manifest lulus. Lima panggilan google.script.run berpadanan dengan fungsi backend. window.testCheckSaveStatus sudah tiada. Dua puluh semakan terasing (12 backend pure/baca sahaja bermock dan 8 frontend bermock) lulus tanpa memanggil operasi Google atau fungsi ujian simpanan. Semakan ini bukan bukti transaksi atomik atau ujian concurrency sebenar.

Maklumat ujian DEV dan batasan di bawah direkodkan daripada laporan pemilik; ujian tulis tidak diulang dalam sesi checkpoint. Tiada isu kritikal yang dikenal pasti dalam skop audit ini. Sistem belum diisytiharkan production-ready. Emel admin dan ID database salinan GitHub kekal disamarkan.

## Keputusan DEV Fasa 6.1A — dilaporkan pemilik

| Perkara | Keputusan dilaporkan |
| --- | --- |
| Validasi UUID | Lulus |
| ID tindakan wujud dan tidak wujud | Lulus |
| Pengesanan UUID pendua | Lulus |
| Integrasi penyimpanan DEV | Lulus; simpanan pertama berjaya dan penghantaran kedua dengan UUID sama ditolak |
| Bilangan sejarah | Bertambah daripada 2 kepada 3 sahaja |
| Aduan ujian | IPV-2026-0002 berubah kepada DALAM_TINDAKAN |
| Handler Semak Status Simpanan | found:true dan found:false lulus |
| Borang hilang selepas semakan | Diselesaikan dengan membuang loadComplaints daripada handler semakan; borang dikekalkan |

Ini keputusan DEV yang dilaporkan pemilik, bukan ujian simpanan sesi ini. Tiada kandungan rekod aduan, log sebenar atau nilai Script Properties disalin ke GitHub.

## Had idempotensi dan semakan status Fasa 6.1A

- pendingActionId berada dalam closure/memori borang sahaja. Refresh halaman, Muat Semula yang membina semula senarai atau kehilangan borang tidak memulihkan ID itu; penghantaran baharu boleh mendapat UUID baharu.
- Guard menolak UUID yang sudah ada; ia bukan mekanisme retry yang memulangkan hasil asal. Pengguna perlu menyemak sejarah dan status sebelum mencuba lagi apabila hasil tidak pasti.
- found:true membuktikan kewujudan ID dalam sejarah pada masa bacaan, bukan pengesahan atomik bahawa semua medan ADUAN selesai dikemas kini. Endpoint semakan tidak memegang lock, dan proses simpanan/rollback boleh sedang berjalan. found:false juga tidak membuktikan operasi tulis yang sedang berjalan sudah gagal.
- Simpanan pendua telah diuji secara berurutan oleh pemilik. LockService melindungi aliran semakan/tulis dalam projek GAS yang sama, tetapi bukan transaksi atomik merentas ADUAN/TINDAKAN, projek berasingan, editor Sheets atau semua situasi dua tab. Ujian concurrency sebenar belum dilakukan.
- Semakan ID mengembalikan found/actionId sahaja dan tidak menyemak kesamaan payload atau kaitan aduan melalui parameter tambahan. UUID ialah pengecam permintaan, bukan bukti identiti.
- Laluan utama kekal memanggil requireAdmin_ dan memeriksa database iADUAN_IPV_DATABASE_DEV. Manifest kekal V8, Asia/Singapore, USER_ACCESSING / MYSELF; deployment aktif tidak diperiksa.
- Semak Status Simpanan mengekalkan borang kerana tiada loadComplaints dalam handler itu. Handler simpanan berjaya yang biasa masih memuat semula senarai seperti sebelum ini.
- Pelayar tanpa crypto.randomUUID diberi mesej ralat dan tidak menghantar tindakan. Keserasian pelayar sebenar selain ujian DEV pemilik belum disahkan.
- Penggunaan production belum diluluskan. Batas rollback, backup, laporan dan pengiraan sejarah checkpoint terdahulu masih terpakai.

## Fungsi ujian backend yang masih perlu diasingkan sebelum production

Fungsi berikut **dikekalkan** sebagai sebahagian snapshot ZIP, bukan dipadam secara senyap. Tiada satu pun dijalankan dalam sesi ini. Sebelum production, asingkan ke projek/sumber ujian atau keluarkan daripada permukaan panggilan aplikasi melalui tugasan khusus yang dipersetujui.

| Fungsi | Kesan / tindakan yang diperlukan |
| --- | --- |
| testSaveAdminActionOnce | Menulis tindakan DEV dengan UUID baharu setiap panggilan; nama Once tidak menguatkuasakan sekali sahaja |
| testActionIdempotencyIntegration | Menulis tindakan pertama melalui saveAdminAction kemudian cuba UUID sama; mempunyai prasyarat status/bilangan sejarah, bukan ujian selamat dijalankan sewenang-wenangnya |
| prepareDevIdempotencyTestId | Menjana dan menyimpan UUID dalam Script Properties DEV_IDEMPOTENCY_TEST_ACTION_ID jika belum ada; tidak read-only |
| testAdminActionValidation, testAdminActionDryRun, testActionDuplicateGuard | Validasi/bacaan DEV; asingkan helper pembangunan, kekalkan batas akses |
| testActionSaveStatusFound, testActionSaveStatusNotFound, testActionSaveStatusInvalid | Ujian endpoint baca sahaja; asingkan sebelum production |
| testAdminActionHistory, testAdminComplaints, testAdminImageAccess | Boleh membaca/log sejarah, aduan atau metadata gambar sebenar apabila dijalankan; jangan menerbitkan output sebenar |
| testAdminDatabaseConnection, testAdminIdentity | Pemeriksaan konfigurasi/akaun; testAdminDatabaseConnection tidak memanggil requireAdmin_ secara langsung dan patut diasingkan atau dikawal sebelum peluasan akses |

window.testCheckSaveStatus telah dibuang daripada frontend; fungsi semakan sebenar dan butangnya dikekalkan. Fungsi ujian yang membina payload tindakan kini menyertakan actionId. Penyingkiran/penamaan semula helper backend belum dibuat kerana tugas semasa ialah checkpoint dan audit.

## Sanitasi dan skop fail Fasa 6.1A

Hanya dua nilai dalam Code.gs salinan GitHub disamarkan: ADMIN_CONFIG.databaseId = REPLACE_WITH_DEV_SPREADSHEET_ID dan ADMIN_CONFIG.adminEmail = admin@example.invalid. Untuk pemulihan kemudian, ambil nilai sebenar daripada ZIP/config pemilik yang disimpan persendirian dan pulihkan dalam salinan kerja projek GAS Admin yang betul apabila dibenarkan. Jangan commit nilai sebenar. Snapshot ini tidak memulihkan atau menukar konfigurasi GAS.

Diff source dengan main Fasa 5.0D: AdminActionService.gs, AdminHistoryService.gs dan AdminDashboard.html berubah. Code.gs, AdminImageService.gs dan appsscript.json sama selepas sanitasi. Folder gas/, AGENTS.md dan fail lain dikekalkan. Tiada dependency, perkhidmatan berbayar atau fungsi baharu di luar ZIP ditambah. Prinsip Zero Cost First, Mobile First, User Friendly dan Sustainable kekal.

## Checkpoint terdahulu — Admin Fasa 5.0D: Laporan Bulanan Pengarah IPV

Pada 14 Oktober 2026, enam fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.5.0D.zip`. Checkpoint ini menyambung Fasa 5.0C (`8bbc938`) pada branch `main`; folder aplikasi staf `gas/` dikekalkan tanpa perubahan.

Fungsi `prepareMonthlyReport()` mengesahkan pilihan satu bulan dan tahun. `buildMonthlyReportData()` mengumpulkan semua aduan diterima dalam bulan laporan tanpa mengehadkan senarai kepada carian/status dashboard, mengira jumlah/selesai/belum selesai/ditolak, dan menyediakan senarai berasingan aduan bulan terdahulu yang masih aktif berdasarkan status terkini. Tarikh tidak sah, hari masa depan atau status tidak dikenali menghentikan laporan untuk semakan, termasuk rekod bermasalah di luar bulan pilihan.

`showMonthlyReportPreview()` memaparkan ringkasan, senarai lengkap, tunggakan lama serta tarikh/masa rujukan status dalam waktu Malaysia. `printMonthlyReport()` membuka dialog cetakan pelayar. Pratonton menyediakan **Cetak / Simpan PDF** dan **Tutup Pratonton**; menutup pratonton mengekalkan senarai serta penapis dan membolehkan laporan dijana semula.

Cetakan menetapkan A4 potret, Arial minimum 12 pt bagi kandungan utama, tajuk jadual berulang dan elakan pemecahan baris setakat kemampuan pelayar. Lebar lajur ialah 8%/67%/25%. Kedua-dua butang disembunyikan dalam cetakan. Sasaran 1–2 halaman tidak menghadkan rekod: tambah halaman apabila perlu, tanpa mengecilkan font atau membuang rekod.

**Semakan sesi checkpoint:** enam fail disemak; sintaks GS/JavaScript, deklarasi gabungan, struktur HTML, manifest dan CSS cetakan diperiksa. Enam belas semakan terasing dengan DOM simulasi/data rekaan/jam tetap lulus untuk tempoh, statistik/senarai penuh, tunggakan lama, ralat integriti, kawalan pratonton/cetak dan kelengkapan 25 rekod. Ia bukan cetakan PDF sebenar atau ujian deployment GAS.

Ketiga-tiga fungsi ujian sementara `testMonthlyReportData()`, `testMonthlyReportIntegrity()` dan `testLongMonthlyReport()` sudah tiada dalam AdminDashboard.html. Teks aduan dipaparkan melalui textContent; emel admin dan ID database sebenar disamarkan secara konsisten. Diff terhadap main/checkpoint Fasa 5.0C menunjukkan hanya AdminDashboard.html berubah; lima fail Admin lain sama selepas redaksi konfigurasi.

GAS asal, deployment, Sheets dan Drive tidak diubah. Tiada dependency/perkhidmatan berbayar atau fungsi tambahan dicipta. Prinsip Zero Cost First, Mobile First, User Friendly dan Sustainable dikekalkan.

## Keputusan DEV Fasa 5.0D — dilaporkan pemilik

| Ujian | Keputusan dilaporkan |
| --- | --- |
| Pengesahan bulan/tahun | Empat ujian lulus |
| Pengumpulan Oktober 2026 | 2 aduan, 2 belum selesai; lulus |
| Pratonton dan masa rujukan | Lulus, tarikh/masa Malaysia dipaparkan |
| PDF data sebenar | PDF dua aduan berjaya dihasilkan |
| Simulasi cetakan 25 aduan | PDF A4 lima halaman berjaya dihasilkan |
| Kelengkapan dan pagination | Semua 25 rekod lengkap, tajuk jadual diulang dan tiada baris terpotong dikesan |
| Lebar lajur | Diperbaiki tanpa mengecilkan Arial 12 pt |
| Integriti asas | Empat ujian lulus termasuk mesej ralat |
| Regresi Fasa 5.0D | Tujuh ujian dilaporkan lulus: Muat Semula, carian/penapis, gambar, tindakan, sejarah, laporan Oktober 2026 dan PDF |
| UX Tutup Pratonton | Lima ujian dilaporkan lulus: kedua-dua butang, tutup, senarai/penapis kekal, jana semula dan kawalan tersembunyi dalam cetakan |
| Selepas pembersihan ujian sementara | Ujian laporan sebenar dilaporkan lulus |

Keputusan ini berasal daripada laporan pemilik dalam tugasan, bukan pemeriksaan PDF atau ulang uji runtime sesi ini. Fail PDF, gambar, data aduan sebenar dan output log peribadi tidak dimasukkan ke GitHub.

## Peraturan dan batas laporan Fasa 5.0D

- Tempoh berdasarkan **tarikh aduan diterima**. Status dalam laporan ialah status terkini data yang dimuatkan ketika laporan disediakan, bukan keadaan pada hari terakhir bulan laporan. Tarikh/masa rujukan penjanaan mesti dipaparkan dengan jelas.
- Laporan mengambil allComplaints daripada muatan dashboard terakhir. Gunakan Muat Semula sebelum menghasilkan laporan untuk mendapatkan data terkini; source ini tidak membuat bacaan backend baharu khusus sewaktu Jana Laporan. Tarikh rujukan ialah masa penjanaan pratonton, bukan bukti transaksi/snapshot atomik database.
- Statistik bulanan menggunakan semua aduan dalam bulan/tahun dipilih. Carian dan penapis status dashboard tidak mengeluarkan rekod daripada laporan. Kad dashboard kekal statistik keseluruhan.
- Senarai B ialah aduan daripada tempoh lebih awal yang masih BAHARU/DALAM_SEMAKAN/DALAM_TINDAKAN pada data semasa. Ia berasingan daripada jumlah aduan diterima dalam bulan laporan; bukan rekonstruksi tunggakan pada hujung bulan lampau.
- Status yang tidak dikenali, tarikh tidak sah dan hari masa depan menghentikan laporan untuk semakan; jangan menghasilkan laporan separa sambil membuang rekod bermasalah. Validasi kalendar laporan tidak sama dengan regex penapis bulan/tahun yang hanya membaca bentuk tarikh.
- Source memeriksa tarikh kalendar, bukan setiap komponen jam/minit dalam teks asal atau jam masa depan pada hari yang sama.
- Ujian production belum dijalankan. Ujian tekanan dengan rekod jauh lebih banyak belum dibuat.
- Keterangan sangat panjang dan bulan tanpa aduan belum diuji secara khusus pada DEV. Source menyediakan keadaan Tiada rekod, tetapi itu bukan bukti ujian kes kosong.
- Cetakan/PDF bergantung pada pelayar dan tetapan cetakan. CSS break-inside: avoid serta table-header-group ialah arahan layout, bukan jaminan semua pelayar atau baris melebihi satu halaman tidak akan terpotong.
- Sasaran 1–2 halaman A4; tambah halaman untuk mengekalkan semua rekod. Kekalkan Arial 12 pt minimum bagi kandungan utama.
- Simulasi setempat dan simulasi cetakan bukan pengganti ujian data sebenar. Ujian DOM sesi ini tidak membuktikan jumlah halaman, ukuran fizikal atau hasil PDF.
- Fungsi ujian sementara yang dinamakan telah dikeluarkan daripada HTML. Fungsi ujian GAS lain dalam fail backend tidak diubah dan tidak dijalankan.
- Batas lama mengenai rollback/idempotensi, susunan sejarah dan kawalan helper ujian masih terpakai. Tiada perubahan seni bina atau production readiness didakwa.

## Pemulihan konfigurasi persendirian

Salinan public `gas-admin/Code.gs` menggunakan `ADMIN_CONFIG.databaseId = 'REPLACE_WITH_DEV_SPREADSHEET_ID'` dan `ADMIN_CONFIG.adminEmail = 'admin@example.invalid'`. Hanya dua nilai ini diganti; lima fail lain sama byte-for-byte dengan ZIP.

Jika pemulihan GAS diperlukan dalam tugasan akan datang, ambil nilai sebenar daripada ZIP asal/config pemilik yang disimpan persendirian. Dalam editor **projek GAS Admin yang betul**, pulihkan dua medan ADMIN_CONFIG itu kepada database DEV serta akaun admin yang dibenarkan. Semak ID projek, akses database/folder dan source sebelum sebarang salinan kod. Jangan gabungkan gas/ dengan gas-admin/ kerana kedua-duanya mempunyai doGet/Code.gs/manifest sendiri. Jangan commit nilai dipulihkan atau credentials ke GitHub. Arahan ini hanya dokumentasi pemulihan; tiada pemulihan, push GAS atau deployment dilakukan dalam checkpoint ini.

## Checkpoint terdahulu — Admin Fasa 5.0C

Pada 14 Oktober 2026, enam fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.5.0C.zip`. Checkpoint ini menyambung Fasa 5.0B (`2dee9bf`) pada branch `main`. Folder aplikasi staf `gas/` dikekalkan tanpa perubahan.

Dashboard menambah kad `pendingCount` (jumlah aduan belum selesai), `oldestPending` (umur aduan tertua belum selesai) dan fungsi `updatePendingStats()`. Status aktif ialah BAHARU, DALAM_SEMAKAN dan DALAM_TINDAKAN; SELESAI dan DITOLAK tidak dikira aktif. Statistik menggunakan `allComplaints`, bukan senarai yang ditapis carian/status/bulan/tahun.

Pengiraan tarikh Malaysia menggunakan `Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', ... }).formatToParts()` untuk mendapatkan tahun/bulan/hari tanpa mengandaikan susunan teks locale. Umur dikira sebagai perbezaan hari kalendar Malaysia menggunakan Date.UTC, bukan tempoh 24 jam tepat. Kod memeriksa bentuk tarikh, kesahihan hari/bulan/tahun dan tarikh pada hari masa depan.

**Ujian paparan DEV dilaporkan pemilik:** pada 14 Oktober 2026, 2 aduan belum selesai dan aduan tertua 1 hari. Enam ujian regresi — penapis Oktober 2026, carian bersama status, gambar, borang tindakan, sejarah tindakan dan Muat Semula — dilaporkan lulus.

**Semakan sesi checkpoint:** sintaks GS/JavaScript dan deklarasi gabungan, struktur HTML/tag/ID serta manifest lulus. Sembilan semakan terasing dengan kod dashboard sebenar, DOM simulasi, data rekaan dan jam tetap lulus untuk sempadan Malaysia, pengelasan status, tarikh tidak sah/masa depan, data kosong, perubahan status dan statistik keseluruhan ketika senarai ditapis. Tiada fungsi GAS, ujian Google atau operasi data dijalankan.

Kes tarikh tidak sah, tarikh masa depan dan perubahan status **masih memerlukan ujian khusus pada DEV**. Ujian simulasi tidak menutup keperluan tersebut. Penggunaan production belum diuji. Statistik dashboard ialah statistik keseluruhan rekod dimuatkan, bukan statistik khusus bulan laporan.

Diff dengan remote Fasa 5.0B menunjukkan hanya `gas-admin/AdminDashboard.html` berubah; lima fail Admin lain sama selepas redaksi dua nilai konfigurasi. Emel admin dan ID database sebenar tidak diterbitkan. GAS asal, deployment, Sheets dan Drive tidak diubah; tiada fungsi tambahan dicipta dalam tugas checkpoint.

## Batas pemantauan belum selesai Fasa 5.0C

- Aduan aktif bertarikh tidak sah atau masa depan masih termasuk dalam pendingCount, supaya rekod itu tidak hilang daripada jumlah aktif.
- Jika satu atau lebih aduan aktif bermasalah tarikh, oldestPending memaparkan **Semak tarikh**, bukan umur yang mungkin mengelirukan. Tooltip menunjukkan bilangan rekod yang perlu disemak.
- Jika tiada aduan aktif, paparan umur ialah **0 hari**. Jika semua tarikh aktif sah, umur maksimum dipaparkan; masa/jam dalam tarikh aduan tidak digunakan untuk umur hari.
- Tarikh masa depan yang dikesan ialah hari kalendar selepas hari ini di Malaysia. Jam masa depan dalam hari yang sama tidak dikesan oleh pengiraan umur berasaskan hari ini.
- Kad dikemas kini apabila data dimuatkan/Muat Semula; ia tidak dikira semula hanya kerana penapis senarai berubah. Carian dan penapis tidak mengubah jumlah keseluruhan.
- Validasi kalendar ini ditambah pada updatePendingStats sahaja. Regex penapis bulan/tahun terdahulu masih menyemak bentuk tarikh, dan validator laporan rasmi masih belum dibina.
- Paparan 2 aduan/1 hari ialah hasil DEV yang dilaporkan pada 14 Oktober 2026, bukan angka yang kekal setiap hari atau bukti data semasa dalam sesi ini.
- Ujian khusus DEV untuk data tidak sah, masa depan dan peralihan status masih diperlukan, termasuk pemulihan Semak tarikh selepas data diperbetulkan. Penggunaan production belum diuji.
- Prinsip Zero Cost First, Mobile First, User Friendly dan Sustainable, sasaran laporan bulanan lengkap/A4/Arial 12 pt, serta beza statistik keseluruhan berbanding statistik bulan kekal seperti seksyen projek terdahulu.

## Konfigurasi dan had tugas Fasa 5.0C

Salinan GitHub mengekalkan `ADMIN_CONFIG.databaseId = 'REPLACE_WITH_DEV_SPREADSHEET_ID'` dan `ADMIN_CONFIG.adminEmail = 'admin@example.invalid'`. Pulihkan dua nilai daripada ZIP asal atau konfigurasi pemilik dalam salinan kerja persendirian apabila diperlukan; jangan commit nilai sebenar. Lima fail selain Code.gs dikekalkan byte-for-byte daripada ZIP; tiada perubahan logik selain kod yang dibekalkan pemilik.

Tugas semasa hanya menyimpan snapshot dan dokumentasi. Ia tidak memulihkan konfigurasi, mengubah GAS/deployment/data, membina validator laporan atau membaiki batas di luar skop. Tunggu arahan pemilik sebelum langkah berikutnya.

## Checkpoint terdahulu — Admin Fasa 5.0B

Pada 14 Oktober 2026, enam fail diterima daripada ZIP pemilik `iADUAN_IPV_ADMIN_v0.5.0B.zip`. Checkpoint ini menyambung Fasa 5.0A (`930a153`) pada branch `main`; folder aplikasi staf `gas/` dikekalkan tanpa perubahan.

Dashboard menambah dropdown Bulan Aduan (12 bulan dan Semua Bulan) serta Tahun Aduan (Semua Tahun dan tahun yang dijana daripada rekod dimuatkan). `populateYearFilter()` membina tahun unik, terbaharu dahulu, dan memulihkan pilihan tahun selepas Muat Semula jika tahun itu masih tersedia; jika tiada, kembali kepada Semua Tahun. Pilihan bulan tidak dibina semula, jadi kekal selepas Muat Semula.

`renderComplaints()` menggabungkan carian ID/lokasi/keterangan/kategori, status, bulan dan tahun melalui syarat AND. Mesej berasingan disediakan untuk tiada padanan carian/penapis, tiada status/tempoh, tiada bulan/tahun dan tiada rekod keseluruhan. Statistik atas dashboard kekal statistik keseluruhan rekod yang dimuatkan; ia tidak bertukar kepada statistik bulan semata-mata kerana penapis digunakan.

**Ujian dilaporkan pemilik:** lima ujian fungsi — Semua Bulan/Semua Tahun, Oktober 2026, September 2026, gabungan status/kata kunci dan Muat Semula — lulus. Enam ujian regresi — penapis Oktober 2026, carian bersama status, gambar, borang tindakan, sejarah tindakan dan Muat Semula — turut dilaporkan lulus. Ujian production belum dilakukan.

**Semakan sesi checkpoint:** sintaks GS/JavaScript dan deklarasi gabungan, struktur HTML/tag/ID/dropdown serta manifest lulus. Enam belas semakan terasing menggunakan kod dashboard sebenar, DOM simulasi dan data rekaan lulus untuk gabungan penapis, carian, pilihan tahun, fallback, pengekalan pilihan serta statistik keseluruhan. Ini bukan ujian runtime GAS atau ulang uji deployment sebenar.

Diff dengan remote Fasa 5.0A menunjukkan hanya `gas-admin/AdminDashboard.html` berubah; lima fail Admin lain sama selepas redaksi konfigurasi. Emel admin dan ID database sebenar kekal disamarkan. Tiada GAS asal, deployment, Sheets atau Drive diubah, dan tiada fungsi tambahan dicipta.

Penapisan menggunakan teks tarikh `dd/MM/yyyy HH:mm`. Regex semasa mengesan bentuk sahaja, bukan kesahihan kalendar. Rekod tanpa bentuk tarikh yang sepadan dikecualikan apabila penapis tarikh aktif, tetapi tarikh mustahil yang berbentuk betul boleh terlepas. Semua tarikh tidak sah perlu dikesan dan disemak sebelum penjanaan laporan rasmi. Status terkini juga tidak semestinya status pada akhir bulan lalu.

Prinsip **Zero Cost First, Mobile First, User Friendly dan Sustainable** dikekalkan. Sasaran seterusnya ialah laporan bulanan untuk Pengarah IPV: ringkasan statistik khusus bulan, senarai lengkap kerosakan diterima dalam bulan tersebut, tarikh aduan dan status penyelesaian. Format sasaran 1–2 halaman A4 dengan Arial minimum 12 pt bagi kandungan utama; tambah halaman jika perlu supaya tiada rekod tercicir. Fungsi laporan belum dibina dalam checkpoint ini.

## Sasaran laporan bulanan Pengarah IPV — belum dibina

| Bahagian | Keperluan |
| --- | --- |
| Tempoh | Satu bulan dan tahun yang dinyatakan dengan jelas, berdasarkan tarikh aduan diterima |
| Ringkasan | Jumlah aduan bulan tersebut serta pecahan status penyelesaian yang sepadan dengan senarai |
| Senarai lengkap | Semua kerosakan diterima dalam bulan itu: nombor rujukan, tarikh aduan, lokasi, keterangan kerosakan dan status penyelesaian di sebelah setiap rekod |
| Susun atur | Sasaran 1–2 halaman A4; Arial minimum 12 pt untuk kandungan utama |
| Rekod panjang/banyak | Tambah halaman mengikut keperluan; jangan mengecilkan font atau membuang/memotong rekod demi had dua halaman |
| Semakan | Sahkan tarikh, jumlah dan kelengkapan senarai sebelum laporan rasmi dihasilkan |

**Statistik keseluruhan dashboard** dikira daripada semua rekod yang dimuatkan dan kekal walaupun senarai ditapis. **Statistik khusus bulan laporan** perlu dikira daripada semua aduan diterima dalam bulan/tahun laporan sahaja. Ia tidak boleh mengambil angka keseluruhan dashboard. Senarai laporan bulanan mesti lengkap tanpa pengecualian akibat kata kunci atau penapis status dashboard; jika pecahan status diperlukan, semua rekod bulan itu masih mesti disenaraikan.

Bezakan kohort aduan diterima pada bulan laporan daripada kerja yang diselesaikan pada bulan itu untuk aduan bulan sebelumnya. Jika ringkasan penyelesaian digunakan, labelkan asas kiraan dan waktu status dengan jelas. Status semasa penjanaan boleh berubah daripada kedudukan hujung bulan lalu. Laporan yang mendakwa status pada akhir bulan memerlukan rekonstruksi sejarah TINDAKAN/timestamp atau snapshot yang boleh disahkan; checkpoint ini belum membinanya.

## Batas dan semakan data Fasa 5.0B

- Penapis memperoleh bulan/tahun daripada `item.date` dalam format backend `dd/MM/yyyy HH:mm`, bukan Date/ISO mentah.
- Regex semasa bukan validator kalendar atau masa yang lengkap. Contohnya bentuk `31/02/2026` boleh diterima. Rekod tidak sah tidak boleh diabaikan secara senyap sehingga hilang daripada laporan rasmi; kesan, laporkan dan selesaikan isu data terlebih dahulu.
- Tahun dijana daripada rekod dimuatkan, bukan daripada senarai tahun statik. Tahun yang tidak lagi ada selepas refresh kembali kepada ALL; bulan yang dipilih kekal.
- Carian/status/bulan/tahun ialah penapisan browser pada senarai dimuatkan. Ia tidak mengubah angka ringkasan keseluruhan atau data Google.
- Ujian setempat mengesahkan logik dengan data rekaan dan DOM simulasi. Lima ujian fungsi serta enam regresi sebenar direkodkan sebagai laporan pemilik. Ujian production belum dilakukan.
- Lima fail Admin selain HTML kekal pada hash Fasa 5.0A selepas redaksi. Folder gas/, AGENTS.md dan dokumen checkpoint lain tidak diubah.
- Konfigurasi salinan GitHub kekal `ADMIN_CONFIG.databaseId = 'REPLACE_WITH_DEV_SPREADSHEET_ID'` dan `ADMIN_CONFIG.adminEmail = 'admin@example.invalid'`. Pulihkan daripada ZIP asal/config pemilik ke salinan kerja persendirian apabila diperlukan; jangan commit nilai sebenar. Tiada pemulihan atau perubahan GAS dilakukan sekarang.
- Semua batas pengesahan admin, rollback/idempotensi dan susunan sejarah daripada checkpoint terdahulu masih terpakai. Jangan menganggap laporan bulanan atau production readiness sudah tersedia.

## Checkpoint terdahulu — Admin Fasa 5.0A

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
