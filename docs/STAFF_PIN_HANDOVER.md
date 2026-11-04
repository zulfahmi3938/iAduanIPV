# iADUAN IPV — Handover Staff PIN Authentication V1

**Branch:** `feature/burndvs-staff-pin-v1`  
**Skop:** GAS Staf (`gas/`) sahaja; GAS Admin, `main`, Sheets dan deployment tidak diubah oleh PR ini.

## Apa yang berubah

- `gas/Index.html`: medan PIN peribadi 6 digit, dihantar bersama payload dan dikosongkan selepas berjaya.
- `gas/ComplaintService.gs`: PIN mesti lulus pengesahan backend selepas staf dipadankan dengan `PENGGUNA`, **sebelum** menjana ID aduan, upload gambar atau menulis row.
- `gas/StaffPinService.gs`: hash HMAC-SHA256 menggunakan secret pepper dalam Script Properties dan salt berasingan per staf; fail tidak memerlukan tab atau spreadsheet tambahan. Selepas 5 PIN salah, sekat PIN tersebut selama 15 minit.

**PIN bukan Google login.** Ini menghalang penyamaran mudah tetapi tidak menghalang perkongsian PIN. Sistem tidak memaparkan PIN atau hash kepada browser. Hash HMAC berpepper dipilih kerana PIN 6 digit mudah diteka secara offline jika hanya SHA-256 tanpa secret. Lindungi Script Properties dan akses editor.

## Prasyarat Fahmi (owner GAS Staf)

1. **Semak source terkini dalam GAS Staf dahulu**, khususnya `Index.html`. Snapshot GitHub mungkin lebih lama daripada kod `/dev` yang sudah ada upload gambar. Jangan replace perubahan GAS yang belum di-commit.
2. Review perubahan dalam GitHub PR dan merge ke `main` selepas bersetuju.
3. Bandingkan tiga fail `gas/` dengan GAS Staf sebenar. Integrasi manual dengan teliti atau `clasp` yang telah disahkan hanya ke **Script ID GAS Staf** — bukan GAS Admin.
4. Pastikan `IADUAN_DEV_SPREADSHEET_ID` dalam Script Properties menunjuk kepada database DEV sedia ada (tab `PENGGUNA`), bukan spreadsheet baharu.
5. **Sebelum deploy kod yang mewajibkan PIN**, provision semua staf aktif seperti di bawah; jika belum, submission gagal tertutup.
6. Semak kawalan akses / fungsi setup top-level lain sebelum meluaskan akses kepada pengguna; perubahan ini tidak mengaudit atau membaiki keseluruhan permission sedia ada.

## Provision 13 PIN sekali tanpa tambah tab

Di **Script Properties projek GAS Staf yang betul**, tambah sementara:

- **Key:** `IADUAN_STAFF_PIN_BOOTSTRAP_JSON`
- **Value:** objek JSON yang memadankan **PENGGUNA_ID** sebenar di kolum A dengan PIN unik enam digit dalam **string** (leading zero mesti dikekalkan). Contoh rekaan:
  `{"STAFF001":"083264","STAFF002":"719405"}`

Jangan gunakan PIN contoh ini. Jana PIN rawak berbeza bagi setiap staf dan sampaikan secara peribadi. Jangan simpan PIN plaintext dalam spreadsheet, GitHub, screenshot atau log.

Bagi menjalankan fungsi private sekali, buat fungsi sementara ini **dalam editor GAS sahaja** (jangan commit ke GitHub):

```javascript
function runStaffPinProvisionOnce() {
  return bootstrapStaffPins_();
}
```

Jalankan `runStaffPinProvisionOnce` dari editor GAS yang diautorisasikan, pastikan hasil `success: true` dan `provisioned` sepadan dengan bilangan staf. Helper memadam property JSON sementara setelah berjaya. **Padam fungsi wrapper sementara daripada editor serta simpan perubahan sebelum deployment**. Semak juga property bootstrap sudah tiada. Jika ada error, semak dan buang property plaintext sementara dengan selamat. Jangan pernah deploy wrapper ini ke Web App.

PIN hash dan salt akan tersimpan di Script Properties dengan nama bermula `IADUAN_PIN_V1_`; secret pepper `IADUAN_STAFF_PIN_PEPPER_V1` di Script Properties yang sama. **Jangan reset pepper** selepas provisioning atau semua PIN sedia ada tidak boleh disahkan. Proses reset PIN: provision semula **ID staf tertentu** melalui JSON sementara dan wrapper yang sama, tanpa menjejaskan staf lain. PIN salah terkunci 15 minit; reset PIN akan menetapkan semula kaunter salah bagi staf tersebut.

**Batasan bootstrap:** penulisan beberapa key Script Properties bukan transaksi atomik. Jika provisioning gagal di tengah jalan, owner perlu menyemak bilangan staf dan ulang provisioning terkawal. Jangan buang konfigurasi PIN lama secara rawak.

## Ujian ringkas di DEV sedia ada

Tidak memerlukan spreadsheet atau GAS QA baharu. **Hanya selepas Fahmi memasang dalam DEV dan memberikan kebenaran:**

1. PIN betul → aduan berjaya, nombor rujukan muncul dan lampiran berfungsi.
2. PIN salah → tiada aduan atau fail gambar dibuat.
3. PIN belum disediakan → submission ditolak, mesej hubungi urus setia.
4. Lima percubaan PIN salah → lockout 15 minit; cuba PIN betul semasa lockout → tetap ditolak.
5. Percubaan selepas lockout → PIN betul berjaya dan kaunter kegagalan reset.
6. Cuba staf A + PIN B → mesti ditolak.
7. Semak UI telefon dan kekalkan upload kamera/galeri dalam GAS terkini.

Jika hasil aduan diragui kerana sambungan terganggu, semak data dahulu sebelum cuba semula; **feature ini tidak menyelesaikan idempotency penghantaran aduan staf**.

## Rollback

- **Jangan padam semua Script Properties.** Kekalkan database/folder ID sedia ada.
- Untuk rollback kod, pulihkan tiga fail kepada checkpoint sebelum PR atau update deployment kepada versi terdahulu yang diketahui baik.
- Rekod aduan yang sudah masuk tidak diubah.
- Selepas rollback, tentukan bersama Fahmi sama ada mahu kekalkan hash PIN yang tidak digunakan (untuk rollout semula) atau buang hanya property PIN berkenaan dengan prosedur terancang.

## Batasan dan pengesahan

- Hash per staf dalam Script Properties sesuai untuk senarai kecil (13 staf), bukan skala besar tanpa reka bentuk semula.
- Per-staf lockout boleh dieksploit untuk menyekat staf tertentu; mitigasi tambahan seperti rate limiting IP atau challenge tidak tersedia dengan mudah pada GAS.
- PIN 6 digit bukan faktor identiti kukuh jika dikongsi; perubahan tidak menambah Google Sign-In.
- `main`, GAS LIVE, tab/rekod Sheets, folder Drive dan deployment tidak disentuh oleh penulisan GitHub ini.
- Semakan sintaks/integrasi statik bukan bukti ujian runtime GAS atau kawalan akses sebenar.
