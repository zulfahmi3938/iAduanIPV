# iADUAN IPV — Fasa 7B: Integration Candidate PR #1 + #2 + #3

**Branch:** `integration/staff-pr1-pr2-pr3-dev`  
**Base asal:** `1cd41b09a95654ce5cc0a61fcacb2920494bb64b`  
**Status:** calon gabungan kod, **belum diuji runtime GAS**, belum dipasang dalam GAS, belum mengubah Sheets, Script Properties, Drive atau deployment, belum merge ke `main`.

## Skop gabungan

- **PR #1 Staff PIN:** medan PIN 6 digit pada borang dan fungsi `StaffPinService.gs`; `verifyStaffPin_(staffId, staffPin)` wajib dijalankan di bawah ScriptLock selepas staf disahkan dan sebelum semakan UUID pendua. PIN dikosongkan di UI pada callback berjaya/gagal.
- **PR #2 Duplicate Submission:** `ComplaintIdempotency.gs`, `requestId` UUID dalam `sessionStorage`, `REQUEST_HASH` kandungan aduan, semakan receipt sebelum upload, endpoint read-only `checkComplaintSubmissionStatus`, dan header dua kolum tambahan untuk skema baharu.
- **PR #3 RPC Hardening:** fungsi setup/diagnostik/helper menjadi private dengan `_` di hujung, sambil mengekalkan `submitComplaint`, `getFormOptions`, `doGet` dan `getAppInfo`. Endpoint semakan status PR #2 juga kekal public.
- Fungsi `saveComplaintImages_` asal dikekalkan; hanya nama fungsi setup/check gambar berubah.

## Keputusan semakan statik gabungan

- Semakan kehadiran medan PIN dan requestId dalam payload frontend: ada.
- Semakan `verifyStaffPin_` sebelum `findComplaintRequest_`: ada.
- Semakan `REQUEST_ID` dan `REQUEST_HASH` dalam skema: ada.
- Semakan fungsi setup private dan upload: ada.
- **Belum selesai:** ujian execution `google.script.run`, browser mobile, PIN lockout, concurrent submits, trigger penggunaan nama lama, serta keserasian database dan dashboard Admin sebenar.

## Prasyarat sebelum GAS DEV

1. Backup snapshot GAS Staf terkini; semak perbezaan dengan branch ini sebelum copy atau push.
2. Dengan kelulusan owner, backup tab ADUAN database DEV, kemudian set header **N1 = REQUEST_ID**, **O1 = REQUEST_HASH** pada tab yang betul. **Jangan** jalankan setupDatabase sebagai migrasi.
3. Provision PIN percubaan melalui Script Properties GAS Staf yang betul, tanpa commit PIN sebenar atau hantar dalam chat/PR.
4. Audit trigger dan arahan manual yang masih memanggil `setupDatabase`, `checkDatabase`, `setupImageFolder`, `checkImageFolder`, `testSetup`, `testStaffDropdown` dan nama lama yang lain.
5. Uji penghantaran PIN betul/salah, PIN staf lain, PIN tidak disediakan, lima kesilapan dan lockout, aduan dengan gambar, retry UUID sama/payload sama, UUID sama/payload berbeza, refresh ketika respons hilang, serta bacaan Dashboard Admin.
6. Pastikan perubahan frontend/backend dipasang bersama; **jangan deploy** kod yang mewajibkan PIN sebelum provisioning dan perubahan header selesai.

## Risiko/batasan penting

- PIN enam digit bukan Google Sign-In; PIN boleh dikongsi dan lockout boleh disengajakan.
- `sessionStorage` hanya per tab/peranti; UUID berlainan masih boleh menghasilkan aduan serupa.
- Header N/O baharu tidak automatik ditambah kepada database sedia ada.
- Ujian mock PR asal (PR #2 16 PASS, PR #3 22 PASS) bukan bukti gabungan atau ujian GAS sebenar.
- Semakan status berdasarkan UUID ialah endpoint read-only awam kepada pengguna Web App yang diberi akses; jangan sebar UUID dalam URL/log.

## Rollback

Rollback **keseluruhan** frontend + backend kepada snapshot/deployment sebelum integrasi. Jangan padam kolum N/O, rekod, fail gambar, PIN hash, database ID atau Script Properties secara rambang. Aduan berstatus tidak pasti perlu disemak dahulu sebelum submit semula.

Rujuk dokumen asal: `docs/STAFF_PIN_HANDOVER.md`, `docs/STAFF_DUPLICATE_SUBMISSION_V1.md` dan `docs/STAFF_RPC_HARDENING_V1.md`.
