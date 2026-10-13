
/**
 * iADUAN IPV - ADMIN
 * Fasa 4: Ujian sambungan database
 *
 * READ ONLY - Tidak mengubah data.
 * Belum boleh digunakan sebagai dashboard awam.
 */

const ADMIN_CONFIG = {
  databaseId: 'REPLACE_WITH_DEV_SPREADSHEET_ID',
  adminEmail: 'admin@example.invalid'
};

/**
 * Uji sambungan kepada Google Sheets DEV.
 * Jalankan dalam editor GAS sahaja.
 */
function testAdminDatabaseConnection() {

  const ss = SpreadsheetApp.openById(
    ADMIN_CONFIG.databaseId
  );

  const requiredTabs = [
    'ADUAN',
    'TINDAKAN',
    'PENGGUNA',
    'KONFIGURASI'
  ];

  const tabs = requiredTabs.map(function(name) {
    const sheet = ss.getSheetByName(name);

    return {
      name: name,
      exists: !!sheet,
      recordCount: sheet
        ? Math.max(0, sheet.getLastRow() - 1)
        : 0
    };
  });

  const result = {
    success: tabs.every(function(tab) {
      return tab.exists;
    }),
    database: ss.getName(),
    tabs: tabs
  };

  Logger.log(JSON.stringify(result, null, 2));

  return result;
}

/**
 * Fasa 4 - Ujian identiti akaun admin.
 *
 * Jalankan dalam editor GAS sahaja.
 * Belum mengaktifkan akses dashboard.
 */
function testAdminIdentity() {
  const activeEmail = String(
    Session.getActiveUser().getEmail() || ''
  ).trim().toLowerCase();

  const expectedEmail = String(
    ADMIN_CONFIG.adminEmail
  ).trim().toLowerCase();

  const result = {
    identityAvailable: activeEmail !== '',
    isAuthorizedAdmin:
      activeEmail !== '' &&
      activeEmail === expectedEmail,
    expectedAdminConfigured: expectedEmail !== ''
  };

  Logger.log(JSON.stringify(result, null, 2));

  return result;
}

/**
 * Fasa 4 - Ujian identiti Web App.
 * Tidak memaparkan data aduan.
 */

function doGet() {
  try {
    requireAdmin_();

    return HtmlService
      .createHtmlOutputFromFile('AdminDashboard')
      .setTitle('iADUAN IPV - Dashboard Admin')
      .addMetaTag(
        'viewport',
        'width=device-width, initial-scale=1'
      );

  } catch (error) {
    return HtmlService
      .createHtmlOutput(
        '<h2>AKSES TIDAK DIBENARKAN</h2>' +
        '<p>Sila gunakan akaun admin yang dibenarkan.</p>'
      )
      .setTitle('Akses Ditolak');
  }
}


/**
 * iADUAN IPV - Admin Dashboard
 * Fasa 4.1: Baca senarai aduan sahaja.
 *
 * Semua operasi adalah READ-ONLY.
 */

/**
 * Pastikan akaun yang sedang mengakses
 * benar-benar admin yang dibenarkan.
 */
function requireAdmin_() {
  const email = String(
    Session.getActiveUser().getEmail() || ''
  ).trim().toLowerCase();

  const allowed = String(
    ADMIN_CONFIG.adminEmail || ''
  ).trim().toLowerCase();

  if (!email || email !== allowed) {
    throw new Error('AKSES TIDAK DIBENARKAN');
  }

  return email;
}

/**
 * Baca senarai aduan daripada database DEV.
 *
 * Fungsi ini boleh dipanggil oleh dashboard,
 * tetapi hanya selepas pengesahan admin.
 */
function getAdminComplaints() {
  requireAdmin_();

  const ss = SpreadsheetApp.openById(
    ADMIN_CONFIG.databaseId
  );

  const sheet = ss.getSheetByName('ADUAN');

  if (!sheet) {
    throw new Error('Tab ADUAN tidak ditemui.');
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return {
      total: 0,
      counts: {},
      complaints: []
    };
  }

  // Baca 13 kolum daripada tab ADUAN.
  const rows = sheet.getRange(
    2, 1, lastRow - 1, 13
  ).getValues();

  const complaints = rows
    .filter(function(row) {
      return String(row[0]).trim() !== '';
    })
    .map(function(row) {
      return {
        id: String(row[0] || ''),
        date: row[1] instanceof Date
          ? Utilities.formatDate(
              row[1],
              'Asia/Kuala_Lumpur',
              'dd/MM/yyyy HH:mm'
            )
          : String(row[1] || ''),
        reporter: String(row[3] || ''),
        unit: String(row[4] || ''),
        location: String(row[5] || ''),
        category: String(row[6] || ''),
        description: String(row[7] || ''),
        status: String(row[8] || ''),
        priority: String(row[9] || ''),
        imageCount: String(row[10] || '')
          .split(',')
          .filter(Boolean)
          .length
      };
    });

  // Aduan terbaharu dipaparkan dahulu.
  complaints.reverse();

  const counts = {
    BAHARU: 0,
    DALAM_SEMAKAN: 0,
    DALAM_TINDAKAN: 0,
    SELESAI: 0,
    DITOLAK: 0
  };

  complaints.forEach(function(item) {
    if (Object.prototype.hasOwnProperty.call(
      counts, item.status
    )) {
      counts[item.status]++;
    }
  });

  return {
    total: complaints.length,
    counts: counts,
    complaints: complaints
  };
}

/**
 * Ujian bacaan data melalui editor GAS.
 * Tidak mengubah spreadsheet.
 */
function testAdminComplaints() {
  const data = getAdminComplaints();

  Logger.log(JSON.stringify({
    success: true,
    total: data.total,
    counts: data.counts,
    complaints: data.complaints
  }, null, 2));

  return data.total;
}
