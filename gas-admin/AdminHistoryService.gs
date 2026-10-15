
/**
 * iADUAN IPV - Admin History Service
 * Fasa 4.4A
 * DEVELOPMENT ONLY
 *
 * Membaca sejarah tindakan sahaja.
 * Tidak mengubah data.
 */

function getAdminActionHistory(complaintId) {
  // Pengesahan admin pada backend.
  requireAdmin_();

  const id = String(complaintId || '').trim();

  if (!/^IPV-\d{4}-\d{4,}$/.test(id)) {
    throw new Error('Nombor aduan tidak sah.');
  }

  const ss = SpreadsheetApp.openById(
    ADMIN_CONFIG.databaseId
  );

  if (ss.getName() !== 'iADUAN_IPV_DATABASE_DEV') {
    throw new Error('Database DEV tidak sepadan.');
  }

  const aduanSheet = ss.getSheetByName('ADUAN');
  const sheet = ss.getSheetByName('TINDAKAN');

  if (!aduanSheet || !sheet) {
    throw new Error('Tab database tidak lengkap.');
  }

  // Pastikan aduan benar-benar wujud.
  const aduanLastRow = aduanSheet.getLastRow();

  const aduanIds = aduanLastRow > 1
    ? aduanSheet.getRange(
        2, 1, aduanLastRow - 1, 1
      ).getValues()
    : [];

  const exists = aduanIds.some(function(row) {
    return String(row[0]).trim() === id;
  });

  if (!exists) {
    throw new Error('Aduan tidak ditemui.');
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const rows = sheet.getRange(
    2, 1, lastRow - 1, 9
  ).getValues();

  return rows
    .filter(function(row) {
      return String(row[1]).trim() === id;
    })
    .map(function(row) {
      const rawDate = row[2];

      return {
        actionId: String(row[0] || ''),
        date: rawDate instanceof Date
          ? Utilities.formatDate(
              rawDate,
              'Asia/Kuala_Lumpur',
              'dd/MM/yyyy HH:mm'
            )
          : String(rawDate || ''),
        admin: String(row[3] || ''),
        previousStatus: String(row[4] || ''),
        newStatus: String(row[5] || ''),
        note: String(row[6] || ''),
        assignee: String(row[7] || ''),
        targetDate: row[8] instanceof Date
          ? Utilities.formatDate(
              row[8],
              'Asia/Kuala_Lumpur',
              'yyyy-MM-dd'
            )
          : String(row[8] || '')
      };
    })
    .reverse();
}

/**
 * Fasa 6.1A - Semak kewujudan rekod tindakan.
 * READ ONLY: Tidak mengubah Google Sheets.
 */
function checkAdminActionSaveStatus(actionId) {
  requireAdmin_();

  const id = String(actionId || '').trim();

  // Terima UUID standard sahaja.
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    throw new Error('ID tindakan tidak sah.');
  }

  const ss = SpreadsheetApp.openById(
    ADMIN_CONFIG.databaseId
  );

  if (ss.getName() !== 'iADUAN_IPV_DATABASE_DEV') {
    throw new Error('Database DEV tidak sepadan.');
  }

  const sheet = ss.getSheetByName('TINDAKAN');

  if (!sheet) {
    throw new Error('Tab TINDAKAN tidak ditemui.');
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return {
      found: false,
      actionId: id
    };
  }

  const ids = sheet.getRange(
    2, 1, lastRow - 1, 1
  ).getValues();

  const found = ids.some(function(row) {
    return String(row[0] || '')
      .trim()
      .toLowerCase() === id.toLowerCase();
  });

  return {
    found: found,
    actionId: id
  };
}

/**
 * Ujian bacaan sejarah.
 * Tiada operasi tulis.
 */
function testAdminActionHistory() {
  const history = getAdminActionHistory(
    'IPV-2026-0002'
  );

  const result = {
    success: true,
    complaintId: 'IPV-2026-0002',
    totalActions: history.length,
    history: history
  };

  Logger.log(JSON.stringify(result, null, 2));

  return result;
}

/**
 * Fasa 6.1A - Ujian ID tindakan yang wujud.
 * READ ONLY: Tidak mengubah Google Sheets.
 */
function testActionSaveStatusFound() {
  const history = getAdminActionHistory('IPV-2026-0002');

  if (!history.length) {
    throw new Error('Tiada rekod sejarah untuk ujian.');
  }

  const actionId = history[0].actionId;
  const result = checkAdminActionSaveStatus(actionId);

  if (!result.found) {
    throw new Error('ID tindakan wujud tetapi tidak ditemui.');
  }

  Logger.log(JSON.stringify({
    success: true,
    found: result.found,
    actionId: result.actionId
  }, null, 2));

  return result;
}

/**
 * Fasa 6.1A - Ujian UUID yang tidak wujud.
 * READ ONLY: Tidak mengubah Google Sheets.
 */
function testActionSaveStatusNotFound() {
  const actionId = Utilities.getUuid();

  const result = checkAdminActionSaveStatus(actionId);

  if (result.found !== false) {
    throw new Error(
      'Ujian gagal: UUID baharu didapati telah wujud.'
    );
  }

  Logger.log(JSON.stringify({
    success: true,
    found: result.found,
    actionId: result.actionId
  }, null, 2));

  return result;
}

/**
 * Fasa 6.1A - Ujian ID tindakan tidak sah.
 * READ ONLY: Tidak mengubah Google Sheets.
 */
function testActionSaveStatusInvalid() {
  let rejected = false;

  try {
    checkAdminActionSaveStatus('BUKAN-UUID');
  } catch (error) {
    if (error.message === 'ID tindakan tidak sah.') {
      rejected = true;
    } else {
      throw error;
    }
  }

  if (!rejected) {
    throw new Error(
      'Ujian gagal: ID tidak sah tidak ditolak.'
    );
  }

  Logger.log(
    'LULUS: ID tindakan tidak sah berjaya ditolak.'
  );

  return {
    success: true,
    invalidIdRejected: true
  };
}
