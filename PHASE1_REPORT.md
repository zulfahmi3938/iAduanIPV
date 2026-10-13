# Laporan Fasa 1 — iADUAN IPV

Tarikh: 13 Oktober 2026. Skop: dokumentasi GitHub, percubaan audit GAS read-only dan cadangan seni bina. Tiada fungsi aplikasi baharu dibina.

## 1. Ringkasan keputusan

| Perkara | Status dan bukti |
| --- | --- |
| Tiga fail asal | README.md, PROJECT.md dan AGENTS.md ditemui dalam workspace, dibaca dan digunakan semula |
| Semakan GitHub | `git ls-remote` berjaya tetapi tidak mengembalikan rujukan commit; repository kosong ketika diperiksa |
| Dokumentasi di root | Ketiga-tiga fail tersedia di root salinan kerja cloud |
| Pembetulan | Sasaran PWA, keperluan gambar/semakan status, peranan urus setia, GitHub sebagai sumber utama dan had Fasa 1 diselaraskan |
| Commit dokumentasi | `1f57fb26357645e0ebd5e478f9f6256ca723e63a` dibuat dalam workspace |
| Mesej commit | `docs: initialize iADUAN IPV project documentation` |
| Push | Gagal: `fatal: could not read Username for 'https://github.com': terminal prompts disabled` |
| Pengesahan GitHub | Semakan susulan `refs/heads/main` tidak mengembalikan commit; penerbitan belum berjaya |
| Audit kod GAS | Tertangguh kerana kandungan projek tidak dapat diakses |
| GAS dan production | Tiada kod, deployment, konfigurasi keselamatan atau data diubah; tiada fungsi GAS dijalankan dan tiada spreadsheet dicipta |

Commit ini ialah commit tempatan, bukan commit yang sudah diterbitkan. Tiada pautan commit GitHub diberikan kerana kewujudannya di GitHub belum disahkan. Sambungan GitHub dengan akses tulis repository diperlukan untuk menyambung push; jangan hantar token atau kata laluan dalam chat.

## 2. Struktur repository

Repository jauh masih kosong pada semakan terakhir. Salinan kerja cloud mempunyai:

| Fail | Peranan |
| --- | --- |
| README.md | Pengenalan, status, rujukan projek dan langkah awal |
| PROJECT.md | Skop, model data cadangan, pelan dan keputusan tertunggak |
| AGENTS.md | Panduan pembantu pembangunan serta batas audit |
| PHASE1_REPORT.md | Laporan ini dan cadangan susulan |

Tiga fail awal termasuk dalam commit dokumentasi yang dinyatakan. Laporan ini dan kemas kini pautan laporan direkodkan dalam commit susulan berasingan. Tiada kod frontend, backend atau manifest GAS dalam salinan kerja ini.

## 3. Keputusan audit GAS

### Akses yang diperiksa

Script ID yang diberikan: `1f4XhGnl6DAIMLJBzt5i7ZOk5zVCFPf7IgUtZxVKCTCXziQAahqq-TEmG`.

- Percubaan membuka editor projek dalam browser cloud menghala ke `https://developers.google.com/apps-script/`, bukan editor atau senarai fail.
- Percubaan metadata Drive menggunakan ID yang diberikan mengembalikan 404. Semakan ini tidak membuktikan projek GAS tiada: Script ID bukan semestinya file ID Drive yang boleh digunakan, dan akses akaun juga boleh berbeza.
- Tiada alat Apps Script API berautentikasi tersedia dalam sesi ini. `clasp` tidak tersedia sebagai arahan dan tiada sesi login clasp yang diwujudkan untuk audit ini.

Sebab teknikal tepat penghalaan browser tidak dapat dipastikan. Yang disahkan ialah sesi ini tidak memperoleh kandungan projek. Jangan menafsirkan halangan ini sebagai bukti kod kosong atau projek rosak.

### Matriks audit

| Aspek | Dapatan |
| --- | --- |
| Struktur fail dan fungsi | Tidak dapat disahkan |
| Fungsi tersedia | Tidak dapat disenaraikan tanpa kod |
| Fungsi belum lengkap | Tidak dapat ditentukan tanpa kod |
| Sambungan Sheets / Drive | Tidak dapat disahkan; spreadsheet belum ada menurut maklumat pemilik terdahulu |
| Penerimaan, pemprosesan dan simpanan aduan | Tidak dapat dijejaki |
| Pengesahan identiti dan peranan | Tidak dapat disahkan |
| OAuth scopes, triggers dan deployment | Tidak diperoleh |
| Keselamatan, prestasi dan penyelenggaraan kod | Tiada kelemahan khusus yang boleh disahkan tanpa kod |

### Cara mendapatkan bahan audit

Pilihan paling mudah tanpa menukar keselamatan: pemilik menyediakan salinan semua fail `.gs`/`.js`, `.html` dan `appsscript.json` daripada editor, dalam ZIP atau sebagai fail berasingan. Jika kod mengandungi secrets, gantikan nilainya dengan placeholder sebelum dihantar atau dimasukkan ke GitHub. Jangan sertakan rekod aduan atau kelayakan akses.

Sertakan juga maklumat read-only: nama triggers dan fungsi sasarannya, libraries/advanced services, jenis deployment, siapa yang boleh mengakses dan identiti yang menjalankan aplikasi. Nyatakan nama konfigurasi sahaja; nilai secret tidak diperlukan. Salinan kod semasa tidak semestinya sama dengan versi yang sedang deployed, jadi version/deployment ID perlu direkodkan jika tersedia.

Jika akses OAuth dan Apps Script API sudah tersedia, `projects.getContent` boleh membaca source. Alternatif ialah clasp dalam folder snapshot cloud yang kosong. Arahan di bawah ialah cadangan, belum dijalankan:

```bash
clasp clone-script 1f4XhGnl6DAIMLJBzt5i7ZOk5zVCFPf7IgUtZxVKCTCXziQAahqq-TEmG --rootDir ./gas-snapshot
```

Semak versi clasp dan `--help` dahulu; nama arahan boleh berbeza pada versi lama. Login dan pengaktifan API tidak dilakukan dalam Fasa 1 kerana audit tidak membenarkan perubahan konfigurasi keselamatan. Jika akses belum tersedia, gunakan salinan fail daripada pemilik.

## 4. Penilaian teknologi dan seni bina

Bahagian ini ialah cadangan berdasarkan keperluan dan dokumentasi rasmi, bukan hasil audit source GAS.

### GAS dan PWA

GAS menyokong web app melalui `doGet`/`doPost`, dan boleh menjalankan operasi Sheets/Drive. Ia munasabah sebagai backend awal untuk penggunaan dalaman berskala kecil, tertakluk kepada quota akaun, bilangan pengguna serentak dan saiz gambar. Tiada pengukuran beban projek dilakukan.

HTML Service GAS menggunakan iframe sandbox. PWA pula memerlukan manifest dan hosting HTTPS, dengan pemasangan berbeza mengikut browser. Service worker berguna untuk cache/offline tetapi bukan syarat universal pemasangan. Inferens seni bina: jangan menganggap halaman HTML GAS atau ikon shortcut sudah memenuhi sasaran PWA; gunakan origin frontend sendiri jika pemasangan PWA ialah keperluan tetap.

| Pilihan | Kelebihan | Batas / keputusan |
| --- | --- | --- |
| Web app responsif di GAS | Komponen paling sedikit; hubungan UI-GAS boleh menggunakan google.script.run | Sesuai jika produk web responsif mencukupi; bukan jaminan PWA boleh dipasang |
| Frontend PWA pada hosting HTTPS, GAS sebagai backend | Kawalan manifest, aset, kemas kini dan service worker pada origin frontend | Integrasi identiti, CORS, redirect dan respons ralat mesti dibuktikan dahulu |
| PWA dan backend pada origin sama, dengan Sheets/Drive sebagai stor awal | Kawalan sesi, API dan muat naik lebih jelas | Menambah hosting backend serta pengurusan credentials; nilai semula GAS selepas audit |

**Cadangan bersyarat:** kekalkan HTML/CSS/JavaScript untuk PWA pada hosting HTTPS dan nilai penggunaan semula GAS. Jangan terus menganggap `fetch` dari frontend berasingan ke GAS akan berfungsi. Content Service menghala respons ke URL Google lain; pengesahan identiti dan akses merentas origin perlu diuji pada persekitaran ujian kemudian. Jangan menggunakan `mode: no-cors` atau JSONP untuk menyelesaikan akses data persendirian.

Jika integrasi terus tidak memenuhi keselamatan/keandalan, nilai lapisan API pada origin frontend yang mengesahkan sesi pengguna dan berhubung dengan GAS pada pelayan. Jika lapisan itu membuat GAS berlebihan atau menambah risiko, backend kecil dengan akses Sheets/Drive terus mungkin lebih mudah diselenggara. Penyedia hosting dan pelan kos belum dipilih; jangan menjanjikan kos sifar atau free tier tertentu.

### Identiti dan privasi

- Tentukan sama ada staf menggunakan satu domain Google Workspace atau akaun bercampur. Ini menentukan pilihan login dan deployment.
- Jangan menganggap `Session.getActiveUser().getEmail()` sentiasa memberikan emel: dokumentasi Google menyatakan ia boleh kosong bergantung pada konteks, termasuk deployment execute-as-owner.
- Jangan percaya nama/emel/peranan yang dihantar borang sebagai bukti identiti. Backend mesti mengesahkan pengguna dan membenarkan staf membaca aduan yang dibenarkan sahaja; urus setia menggunakan senarai peranan yang dikawal.
- Nombor rujukan membantu mencari rekod, bukan pengganti autentikasi.
- Hadkan scopes, akses spreadsheet dan akses gambar. Gambar tidak perlu dibuka kepada umum untuk dipaparkan dalam aplikasi; reka kaedah akses berautentikasi.

### Aliran, data dan pengalaman pengguna

Cadangan skrin utama: Buat Aduan dan Aduan Saya. Paparan Urus Setia hanya untuk pengguna yang dibenarkan. Borang awal menggunakan lokasi, kategori, keterangan dan gambar; identiti diperoleh daripada sesi yang sah. Gunakan label BM jelas, butang besar, pilihan dropdown, pratonton gambar dan mesej ralat khusus.

Gunakan model `Aduan`, `Lokasi` dan `Log_Tindakan` dalam PROJECT.md. Tambah `Lampiran` jika beberapa gambar setiap aduan diperlukan, serta `Pengguna` jika peranan perlu disimpan dalam Sheets. Semua perubahan ini masih cadangan.

Cadangan operasi:

- Pengenal dalaman unik dan nombor rujukan mesra pengguna; proses penjanaan mesti selamat untuk penghantaran serentak.
- Kunci idempotensi untuk mengelakkan aduan berganda akibat klik atau retry.
- Validasi input di pelayan, paparan keterangan sebagai teks selamat dan pencegahan teks input ditafsir sebagai formula Sheets.
- Had jenis/bilangan/saiz gambar, pemampatan di telefon dan pengendalian kegagalan muat naik. Rekod serta gambar boleh gagal secara berasingan; sediakan pengesanan fail yatim dan status lampiran.
- Sejarah tindakan tambahan dengan pelaku, masa dan status sebelum/selepas. Sheets bukan log yang tidak boleh diubah; kawal akses edit terus dan nyatakan batas ini.
- Baca/tulis Sheets secara kelompok, paparkan dashboard secara berhalaman dan elakkan membaca keseluruhan data untuk setiap permintaan.
- Mulakan notifikasi dengan emel selepas simpanan berjaya; guna antrean/outbox untuk retry. Web push atau WhatsApp dinilai kemudian mengikut kos dan keperluan.
- Cache aset aplikasi sahaja pada permulaan. Jangan cache senarai aduan/gambar sensitif secara automatik. Ketika offline, jelaskan aduan belum dihantar; penghantaran offline ditangguhkan sehingga strategi retry dan data pada peranti dipersetujui.

### Backup, pemulihan dan kos

- GitHub menyimpan kod; ia bukan backup data Sheets/Drive.
- Cadangkan snapshot data berjadual dan salinan lampiran ke stor berakses terhad dengan polisi retensi. Snapshot dalam folder/akaun yang sama sahaja tidak melindungi kehilangan akses akaun sepenuhnya.
- Simpan pemetaan ID aduan–lampiran untuk pemulihan; uji restore pada persekitaran ujian dan elakkan notifikasi dihantar semula ketika restore.
- Tetapkan sasaran kehilangan data dan masa pemulihan; cadangan awal snapshot harian perlu disahkan pemilik, bukan dianggap telah dilaksanakan.
- Kos meliputi akaun/storan Google, hosting, domain jika dipilih, notifikasi dan masa penyelenggaraan. Semak quota serta pelan sebenar selepas jumlah staf dan beban diketahui.

### Struktur kod yang dicadangkan selepas audit

| Laluan | Kandungan |
| --- | --- |
| Root | Dokumentasi projek dan laporan |
| `frontend/` | HTML, CSS, JS, manifest, ikon dan service worker jika diperlukan |
| `backend/gas/` | Source GAS dan appsscript.json yang telah diaudit |
| `docs/` | Keputusan seni bina, kontrak API, panduan deployment dan pemulihan |
| `tests/` | Ujian aliran/akses yang bermakna, apabila kod tersedia |

Folder ini belum dicipta kerana tiada fungsi baharu dibenarkan. Jika lapisan API diperlukan, laluan backend tambahan diputuskan kemudian.

### Penyelarasan clasp dan GitHub

1. Ambil snapshot read-only GAS dalam folder berasingan; rekod tarikh dan versi sebelum menggabungkan source.
2. Semak secrets dan bandingkan snapshot dengan kod sedia ada. GitHub menjadi sumber kod utama selepas source disahkan.
3. Gunakan rootDir khusus untuk fail GAS dan allowlist fail melalui konfigurasi clasp yang disemak. Credentials clasp tidak masuk GitHub; `.clasp.json` mengandungi pemetaan projek, bukan token, tetapi jangan tersalah pilih projek production.
4. Pisahkan projek pembangunan/ujian dan production selepas keputusan pemilik. Jangan automatik push ke production setiap commit.
5. `clasp pull` mengubah fail workspace: gunakan snapshot baharu atau workspace bersih supaya perubahan tempatan tidak hilang.
6. Di fasa deployment kemudian, semak diff dan projek sasaran sebelum push. Dokumentasi clasp menyatakan push menggantikan keseluruhan kandungan projek; ini bukan operasi satu fail. `clasp push` dilarang dalam Fasa 1.
7. Rekod commit GitHub, version GAS dan deployment ID bersama supaya keadaan production boleh dijejaki dan dipulihkan.

## 5. Keutamaan pembangunan

| Fasa | Keutamaan | Bukti siap |
| --- | --- | --- |
| 1 — semasa | Terbitkan dokumentasi dan peroleh bahan audit | Commit disahkan di GitHub; source GAS boleh dibaca |
| 2 — asas | Lengkapkan audit, identiti/peranan dan keputusan hosting/integrasi PWA | Dapatan kod, model akses dan keputusan seni bina didokumenkan; ujian integrasi pada persekitaran ujian |
| 3 — aliran staf | Borang mudah, gambar, simpanan, nombor rujukan dan Aduan Saya | Aduan ujian dapat dijejaki; retry tidak menggandakan rekod; akses per pengguna lulus |
| 4 — urus setia | Dashboard, penetapan pihak bertanggungjawab, status dan sejarah penyelesaian | Ujian aliran serta akses peranan lulus |
| 5 — operasi | Notifikasi, backup/restore, pemasangan PWA dan pilot staf | Ujian telefon, kegagalan rangkaian, quota serta restore; maklum balas staf |

Keperluan manifest/hosting PWA dirancang pada Fasa 2; pengesahan pemasangan sebenar dijalankan sebelum pilot. Jangan menangguhkan keputusan origin sehingga aplikasi lengkap.

## 6. Tugasan pertama selepas Fasa 1

**Peroleh dan audit snapshot GAS lengkap, termasuk manifest dan maklumat deployment read-only.** Hasilnya ialah inventori fail/fungsi, peta aliran aduan, senarai isu berserta lokasi kod dan keputusan sama ada kod boleh digunakan semula.

Secara selari selepas akses GitHub tersedia, push commit dokumentasi yang sudah siap dan sahkan hash remote. Tiada local repository diperlukan pada komputer pengguna. Jangan bina spreadsheet production atau fungsi baharu sebelum dapatan source dan keputusan akses jelas.

## 7. Rujukan rasmi yang diperiksa

- [Google — Web apps](https://developers.google.com/apps-script/guides/web)
- [Google — HTML Service restrictions](https://developers.google.com/apps-script/guides/html/restrictions)
- [Google — Content Service redirects](https://developers.google.com/apps-script/guides/content)
- [Google — Session / identiti pengguna](https://developers.google.com/apps-script/reference/base/session)
- [Google — Quotas](https://developers.google.com/apps-script/guides/services/quotas)
- [Google — clasp](https://developers.google.com/apps-script/guides/clasp)
- [Google clasp — arahan dan amaran push](https://github.com/google/clasp)
- [Google — projects.getContent](https://developers.google.com/apps-script/api/reference/rest/v1/projects/getContent)
- [MDN — PWA installability](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN — service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

Rujukan ini menerangkan kemampuan platform. Ia tidak membuktikan konfigurasi atau keadaan projek iADUAN IPV.
