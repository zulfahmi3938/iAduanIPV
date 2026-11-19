# iADUAN IPV — Fasa 3: GAS Staf RPC Hardening V1

**Status:** Kod calon dalam branch, belum merge, belum pasang pada GAS, belum diuji secara live.  
**Branch:** `security/burndvs-staff-rpc-hardening-v1`  
**Base:** `main` pada `1cd41b09a95654ce5cc0a61fcacb2920494bb64b`

## Tujuan

Google Apps Script HTML Service boleh mendedahkan fungsi pelayan top-level tanpa akhiran underscore melalui `google.script.run`. Sebelum patch, fungsi setup (mencipta Sheets/Drive jika belum wujud), diagnostik (berpotensi mengembalikan metadata database/folder), dan helper semakan e-mel bukan sebahagian daripada API borang Staf tetapi wujud sebagai fungsi global.

Patch menamakan semula fungsi tersebut dengan **akhiran underscore** yang bermaksud private kepada `google.script.run`. Ia bukan mekanisme auth untuk semua bentuk akses Apps Script: Editor projek masih boleh menjalankan kod mengikut haknya, dan sesiapa yang mempunyai akses source/deployment perlu terus dikawal melalui Google Workspace serta setting deployment.

## API awam yang sengaja dikekalkan

- `doGet(e)` — halaman Staf.
- `getFormOptions()` — pilihan nama Staf.
- `submitComplaint(payload)` — simpan aduan.
- `getAppInfo()` — maklumat aplikasi bukan rahsia; kekal bagi keserasian panggilan sedia ada.

Hanya fungsi setup, diagnostik dan helper bukan RPC ditukar. **Tidak menambah Google Sign-In, PIN, kebenaran Sheets, mahupun pengesahan Admin.**

## Fungsi dinamakan semula

| Lama | Baharu (private RPC) | Fail |
|---|---|---|
| `setupDatabase()` | `setupDatabase_()` | `gas/DatabaseSetup.gs` |
| `checkDatabase()` | `checkDatabase_()` | `gas/DatabaseSetup.gs` |
| `setupImageFolder()` | `setupImageFolder_()` | `gas/ImageService.gs` |
| `checkImageFolder()` | `checkImageFolder_()` | `gas/ImageService.gs` |
| `testStaffDropdown()` | `testStaffDropdown_()` | `gas/ComplaintService.gs` |
| `testSetup()` | `testSetup_()` | `gas/Code.gs` |
| `testAdminConfiguration()` | `testAdminConfiguration_()` | `gas/Code.gs` |
| `testComplaintConfiguration()` | `testComplaintConfiguration_()` | `gas/Code.gs` |
| `normalizeEmail()` | `normalizeEmail_()` | `gas/Code.gs` |
| `isAdminEmail()` | `isAdminEmail_()` | `gas/Code.gs` |
| `getRoleForVerifiedEmail()` | `getRoleForVerifiedEmail_()` | `gas/Code.gs` |

Rujukan dalaman kepada helper yang dinamakan semula turut dikemas kini. Tiada schema database, imej, script manifest atau frontend diubah oleh PR ini.

## Arahan kepada Fahmi (owner)

1. **Semak kod GAS Staf terkini berbanding snapshot GitHub** sebelum memasang. Jangan hilangkan kemas kini upload gambar yang mungkin hanya ada dalam `/dev`.
2. Audit penggunaan nama lama dalam editor GAS, trigger manual, skrip pemasangan peribadi atau arahan urus setia. Jika masih ada, kemas kini kepada nama baharu atau gunakan entry point operator yang benar-benar berautoriti. Jangan kekalkan wrapper awam `setupDatabase()` dalam deployment hanya untuk keselesaan.
3. Untuk setup/diagnostik manual, **jangan deploy wrapper**. Jika editor tidak menyediakan butang Run bagi fungsi private, buat wrapper sementara dalam editor *dengan kebenaran owner*, jalankan di editor, kemudian padam sebelum menyimpan/deploy versi untuk pengguna Web App. Jangan masukkan wrapper ke GitHub atau halaman Staf.
4. **Jangan jalankan setup secara rutin untuk pengujian.** `setupDatabase_` boleh mencipta spreadsheet jika ID tiada; `setupImageFolder_` boleh mencipta folder. Gunakan hanya jika owner sahkan tindakan itu benar-benar diperlukan. Pada DEV yang sudah wujud, cukup semak ID private dan struktur database yang betul.
5. Semak setting `Execute as`, `Who has access`, Editor sharing dan log/ownership dalam GAS sebenar. Patch private naming **tidak menggantikan deployment access controls**.
6. Untuk penggunaan selepas PR PIN dan Duplicate Submission, gabungkan patch secara berhati-hati. Fasa 3 menyentuh `gas/ComplaintService.gs` hanya bagi nama `testStaffDropdown`; jangan timpa `submitComplaint` hasil PR #1/#2.

## Semakan setempat

**22 PASS / 0 FAIL** (statik/mock): parsing JS GS (4), JavaScript HTML, manifest JSON, public GAS functions hanya empat entry point dijangka, setiap 11 nama private wujud, tiada rujukan nama lama, RPC borang masih tersedia, dan deklarasi struktur database asal masih wujud.

**NOT VERIFIED:** sekatan runtime `google.script.run` sebenar dalam deployment, setting Workspace, trigger/editor peribadi Fahmi, integrasi dengan PR #1/#2, serta browser/GAS DEV. Tidak menjalankan ujian API sebenar atau menyentuh spreadsheet.

## Rollback

Jika berlaku kerosakan integrasi, pulihkan empat fail GAS yang berubah kepada versi sebelum PR (atau pulihkan deployment Staf terdahulu yang diketahui baik), selepas Fahmi menyemak perbezaan dengan source GAS semasa. **Jangan reset Script Properties, buang gambar, padam aduan, cipta Sheets/Drive baharu atau ubah GAS Admin.**

## Risiko tertinggal

- `getFormOptions` dan `submitComplaint` masih callable oleh pengguna Web App yang dibenarkan. PIN PR #1 diperlukan untuk mengesahkan identiti staf; jangan dakwa pengesahan itu tersedia sebelum integrasi.
- Fungsi `getAppInfo` masih callable kerana data bukan rahsia dan kemungkinan digunakan pihak luar. Jika tidak diperlukan, boleh dinilai semula dalam PR berasingan.
- Akses Editor GAS/Google Drive, deployment Execute as, quota, rate limit dan perlindungan data masih bergantung konfigurasi sebenar yang belum diaudit.
