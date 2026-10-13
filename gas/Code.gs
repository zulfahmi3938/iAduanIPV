
/**
 * =====================================================
 * iADUAN IPV
 * Sistem Pengurusan Aduan Kerosakan
 * Institut Pengurusan Veterinar
 *
 * Version: 0.1.0
 * Environment: DEVELOPMENT
 *
 * PENTING:
 * - Belum mempunyai Google Sign-In.
 * - Belum mempunyai penyimpanan aduan.
 * - Belum mempunyai akses admin yang aktif.
 * - Jangan deploy secara public dahulu.
 * =====================================================
 */

// 1. KONFIGURASI APLIKASI

const APP_CONFIG = Object.freeze({
  name: 'iADUAN IPV',
  version: '0.1.0',
  environment: 'development',
  institution: 'Institut Pengurusan Veterinar',
  timezone: 'Asia/Kuala_Lumpur'
});

// 2. SENARAI ADMIN YANG DIBENARKAN

const ADMIN_EMAILS = Object.freeze([
  'admin@example.invalid'
]);

// 3. PERANAN PENGGUNA

const USER_ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  STAFF: 'STAFF'
});

// 4. STATUS ADUAN

const COMPLAINT_STATUS = Object.freeze({
  NEW: 'BAHARU',
  REVIEW: 'DALAM_SEMAKAN',
  PROGRESS: 'DALAM_TINDAKAN',
  COMPLETED: 'SELESAI',
  REJECTED: 'DITOLAK'
});

// 5. KONFIGURASI BORANG ADUAN

const COMPLAINT_CONFIG = Object.freeze({
  maxDescriptionLength: 2000,
  maxImages: 3,
  maxImageSizeMB: 5,
  allowedImageTypes: [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
});

// 6. UTILITI

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

/**
 * Menyemak e-mel terhadap senarai admin.
 *
 * PERHATIAN:
 * Fungsi ini hanya menyemak senarai e-mel.
 * Ia BUKAN pengesahan identiti pengguna.
 */
function isAdminEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  return ADMIN_EMAILS.includes(normalizedEmail);
}

/**
 * Mengembalikan peranan berdasarkan e-mel.
 *
 * JANGAN gunakan fungsi ini terus pada
 * e-mel yang dihantar oleh browser.
 *
 * E-mel mesti disahkan melalui mekanisme
 * authentication yang sah terlebih dahulu.
 */
function getRoleForVerifiedEmail(email) {
  return isAdminEmail(email)
    ? USER_ROLES.ADMIN
    : USER_ROLES.STAFF;
}

// 7. STATUS SISTEM

function getAppInfo() {
  return {
    application: APP_CONFIG.name,
    version: APP_CONFIG.version,
    environment: APP_CONFIG.environment,
    institution: APP_CONFIG.institution,
    status: 'DEVELOPMENT',
    timestamp: new Date().toISOString()
  };
}

// 8. ENDPOINT AWAM ASAS

/**
 * Paparan utama iADUAN IPV.
 * DEVELOPMENT ONLY.
 */
function doGet(e) {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('iADUAN IPV')
    .addMetaTag(
      'viewport',
      'width=device-width, initial-scale=1'
    );
}

// 9. FUNGSI UJIAN

/**
 * Ujian konfigurasi utama.
 */
function testSetup() {
  const result = {
    success: true,
    ...getAppInfo(),
    adminCount: ADMIN_EMAILS.length,
    availableStatuses:
      Object.values(COMPLAINT_STATUS)
  };

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  return result;
}

/**
 * Ujian semakan senarai admin.
 *
 * Menggunakan e-mel contoh untuk testing.
 * Ini bukan ujian login sebenar.
 */
function testAdminConfiguration() {
  const tests = [
    {
      email: 'admin@example.invalid',
      expected: USER_ROLES.ADMIN
    },
    {
      email: 'contoh@gmail.com',
      expected: USER_ROLES.STAFF
    }
  ];

  const results = tests.map(function(test) {
    const actual =
      getRoleForVerifiedEmail(test.email);

    return {
      expected: test.expected,
      actual: actual,
      passed: actual === test.expected
    };
  });

  const passed = results.every(
    function(test) {
      return test.passed;
    }
  );

  Logger.log(
    JSON.stringify({
      success: passed,
      results: results
    }, null, 2)
  );

  return passed;
}

/**
 * Ujian konfigurasi borang.
 */
function testComplaintConfiguration() {
  const result = {
    maxDescriptionLength:
      COMPLAINT_CONFIG.maxDescriptionLength,
    maxImages: COMPLAINT_CONFIG.maxImages,
    maxImageSizeMB:
      COMPLAINT_CONFIG.maxImageSizeMB,
    allowedImageTypes:
      COMPLAINT_CONFIG.allowedImageTypes
  };

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  return result;
}

// 10. PLACEHOLDER FUNGSI MASA HADAPAN

/**
 * Fungsi berikut belum diaktifkan.
 * Kita akan bangunkan selepas:
 *
 * 1. Struktur Google Sheets dipersetujui.
 * 2. Mekanisme Google Sign-In disahkan.
 * 3. Backend authorization dilaksanakan.
 * 4. Kaedah penyimpanan gambar diputuskan.
 *
 * Modul yang dirancang:
 *
 * - submitComplaint()
 * - getMyComplaints()
 * - getComplaintDetails()
 * - getAdminComplaints()
 * - updateComplaintStatus()
 * - assignComplaint()
 * - uploadComplaintImage()
 * - getComplaintHistory()
 *
 * Jangan tambah endpoint tulis data
 * sebelum authentication siap.
 */

