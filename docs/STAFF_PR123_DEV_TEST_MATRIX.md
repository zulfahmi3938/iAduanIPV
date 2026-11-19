# iADUAN IPV — Fasa 7C: Matriks Ujian DEV Pra-Pemasangan

**Status:** Pelan ujian sahaja; tiada ujian Google Apps Script runtime dilakukan oleh dokumen ini.  
**Sasaran:** GAS Staf DEV asal + spreadsheet `iADUAN_IPV_DATABASE_DEV` yang disahkan.  
**Branch calon:** `integration/staff-pr1-pr2-pr3-dev`.  
**Kelulusan owner diperlukan sebelum sebarang perubahan GAS, Sheets, Script Properties atau deployment.**

## A. Prasyarat (jangan langkau)

- [ ] Pastikan **GAS Staf** yang betul (bukan GAS Admin); simpan backup versi `/dev` terkini bagi semua fail, manifest, setting deployment dan Script Properties penting **tanpa mendedahkan secret**.
- [ ] Bandingkan keseluruhan fail GAS Staf sebenar dengan branch calon, bukan hanya tiga fail yang pernah di-ZIP.
- [ ] Semak dan simpan salinan backup spreadsheet DEV sedia ada. Sahkah tab `ADUAN` masih mempunyai header A–M mengikut skema asal dan tab `PENGGUNA` masih lengkap.
- [ ] Selepas owner meluluskan migrasi, **tambahkan N1 `REQUEST_ID` dan O1 `REQUEST_HASH` pada tab `ADUAN` DEV**; jangan jalankan `setupDatabase_` sebagai migrasi.
- [ ] Semak penggunaan trigger/editor bagi 11 nama fungsi lama dari PR #3; rujuk `STAFF_RPC_HARDENING_V1.md`.
- [ ] Provision **PIN ujian** kepada identiti ujian yang sah pada **Script Properties GAS Staf**; jangan simpan PIN sebenar dalam repo/nota ujian; sediakan semua staf sebelum membuka borang kepada pengguna sasaran.
- [ ] Pastikan frontend dan backend calon digunakan bersama dalam **persekitaran DEV terkawal**, bukan deployment pengguna sebenar.
- [ ] Jangan dedahkan URL aplikasi Staf kepada staf lain sehingga ujian awal lulus.

## B. Urutan ujian (gunakan aduan ujian yang diberi label)

| ID | Senario | Hasil dijangka |
|---|---|---|
| T01 | Buka borang di browser desktop dan telefon | Dropdown staf dipaparkan; medan PIN enam digit wajib; imej pilih kamera/galeri tersedia |
| T02 | Submit tanpa PIN / PIN bukan enam digit | Client menolak; tiada rekod atau fail gambar |
| T03 | Staf A + PIN A betul + 1 gambar | Tepat satu row ADUAN (A–O); nombor rujukan dan 1 gambar disimpan |
| T04 | Staf A + PIN B (milik staf B) | Backend menolak; tiada aduan atau gambar |
| T05 | PIN salah lima kali (akaun ujian) | Rekod ujian terkunci 15 minit; PIN betul semasa terkunci tetap ditolak |
| T06 | Selepas lockout tamat, PIN betul | Penghantaran berjaya; kaunter gagal reset |
| T07 | Submit dengan sifar dan tiga gambar yang sah | Rekod berjaya; jumlah/jenis gambar tepat; tiada pendua |
| T08 | Gambar jenis/saiz tidak dibenarkan | Ditolak; tiada pending UUID baharu akibat kegagalan *sebelum* RPC |
| T09 | Ulang submit dengan UUID dan payload sama (simulasi terkawal) | Rujukan asal dipulangkan; hanya satu row dan satu set gambar |
| T10 | Guna UUID sama tetapi ubah teks/gambar/staf | Ditolak; tidak menulis rekod baharu |
| T11 | Hantar kemudian putuskan respons/refresh pada tab sama | Semakan status pulihkan rujukan jika sudah disimpan; jika belum pasti, amaran ditunjukkan |
| T12 | Cuba retry UUID sama dengan PIN salah | Ditolak **sebelum** duplicate receipt dipulangkan |
| T13 | Gunakan UUID rawak format rosak untuk lookup | Ditolak; tiada metadata aduan didedahkan |
| T14 | Semak Google Sheet dan Dashboard Admin selepas T03 | Kolum A–M kekal betul; status, gambar dan rekod Admin dapat dibaca |
| T15 | Cuba `google.script.run` panggil fungsi setup/diagnostik lama | Tidak tersedia melalui RPC; fungsi public yang diperlukan masih berfungsi |
| T16 | Uji kes `appendRow` melapor ralat sebelum/selepas tulis (mock/isolated) | Sebelum tulis: gambar dibersihkan; selepas tulis: receipt asal dipulangkan, tiada gambar kedua |
| T17 | Simulasi dua penghantaran serentak UUID sama | Tepat satu row dan satu set gambar; periksa lock dan receipt |
| T18 | Uji buka semula borang / aduan baharu selepas kejayaan | UUID baharu dibuat untuk aduan baharu, bukan menggunakan receipt lama |

## C. Kriteria keputusan

- **PASS:** pemeriksaan fizikal pada Sheet, Drive dan UI membuktikan hasil; catat ID aduan ujian serta kiraan row/fail (jangan letak PIN/secret).
- **FAIL:** satu ujian kritikal T03, T04, T09, T10, T12, T14, T15 atau T17 gagal; hentikan rollout dan baiki branch calon.
- **BLOCKED:** ujian tak dapat dilakukan kerana permission, provisioning atau environment; jangan tafsir sebagai lulus.
- Semua mock/static PR asal bersifat rujukan; **bukan** pengganti ujian GAS sebenar.

## D. Rollback

Jika pemasangan calon gagal, hentikan akses ujian dan pulihkan *satu set* frontend/backend/deployment kepada backup Staf yang diketahui baik. Jangan padam aduan, gambar, kolum tambahan atau Script Properties secara rawak. Sekiranya status penghantaran tidak pasti, semak secara manual dahulu.

## E. Rekod keputusan ringkas

| Ujian | PASS / FAIL / BLOCKED | Bukti ringkas / nota | 
|---|---|---|
| T01–T18 | Belum diuji | Isi semasa sesi UAT DEV sebenar |

**Perhatian:** penggunaan `/dev` GAS dan trigger perlu dibezakan daripada deployment `/exec`. Pastikan penilaian akses dibuat pada saluran yang tepat.
