
/**
 * iADUAN IPV - Admin Action Service
 * Fasa 4.3A
 * DEVELOPMENT ONLY
 *
 * Langkah ini: Validasi dan semakan sahaja.
 * BELUM MENULIS DATA.
 */

const ACTION_CONFIG = Object.freeze({
  statuses: [
    'BAHARU',
    'DALAM_SEMAKAN',
    'DALAM_TINDAKAN',
    'SELESAI',
    'DITOLAK'
  ],
  maxAssigneeLength: 150,
  maxNoteLength: 2000
});

/**
 * Semak dan bersihkan teks.
 */
function actionText_(value) {
  return String(value == null ? '' : value).trim();
}

/**
 * Validasi tarikh YYYY-MM-DD.
 */
function validActionDate_(value) {
  if (!value) return true;

  const text = actionText_(value);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return false;
  }

  const parts = text.split('-').map(Number);

  const date = new Date(Date.UTC(
    parts[0],
    parts[1] - 1,
    parts[2]
  ));

  return date.getUTCFullYear() === parts[0] &&
    date.getUTCMonth() === parts[1] - 1 &&
    date.getUTCDate() === parts[2];
}

/**
 * Validasi borang tindakan.
 * Belum menyimpan apa-apa.
 */
function validateAdminAction_(payload) {
  if (!payload || typeof payload !== 'object' ||
      Array.isArray(payload)) {
    throw new Error('Maklumat tindakan tidak sah.');
  }

  const complaintId = actionText_(payload.complaintId);
  const status = actionText_(payload.status);
  const assignee = actionText_(payload.assignee);
  const note = actionText_(payload.note);
  const targetDate = actionText_(payload.targetDate);

  if (!/^IPV-\d{4}-\d{4,}$/.test(complaintId)) {
    throw new Error('Nombor aduan tidak sah.');
  }

  if (!ACTION_CONFIG.statuses.includes(status)) {
    throw new Error('Status aduan tidak sah.');
  }

  if (assignee.length < 3 ||
      assignee.length > ACTION_CONFIG.maxAssigneeLength) {
    throw new Error(
      'Pihak bertanggungjawab mesti 3 hingga 150 aksara.'
    );
  }

  if (note.length < 10 ||
      note.length > ACTION_CONFIG.maxNoteLength) {
    throw new Error(
      'Catatan mesti 10 hingga 2000 aksara.'
    );
  }

  if (!validActionDate_(targetDate)) {
    throw new Error('Format tarikh sasaran tidak sah.');
  }

  return {
    complaintId: complaintId,
    status: status,
    assignee: assignee,
    note: note,
    targetDate: targetDate
  };
}

/**
 * Ujian konfigurasi dan validasi.
 *
 * Tiada operasi tulis ke Google Sheets.
 */
function testAdminActionValidation() {
  requireAdmin_();

  const sample = {
    complaintId: 'IPV-2026-0002',
    status: 'DALAM_TINDAKAN',
    assignee: 'Kontraktor Penyelenggaraan',
    note: 'Pemeriksaan awal telah dilakukan.',
    targetDate: '2026-10-21'
  };

  const validated = validateAdminAction_(sample);

  let shortNoteRejected = false;

  try {
    validateAdminAction_({
      complaintId: 'IPV-2026-0002',
      status: 'DALAM_TINDAKAN',
      assignee: 're',
      note: 'rs',
      targetDate: '2026-10-21'
    });
  } catch (error) {
    shortNoteRejected = true;
  }

  const result = {
    success:
      validated.status === 'DALAM_TINDAKAN' &&
      validated.targetDate === '2026-10-21' &&
      shortNoteRejected,
    validSample: validated,
    shortInputRejected: shortNoteRejected,
    databaseModified: false
  };

  Logger.log(JSON.stringify(result, null, 2));

  return result;
}

/**
 * Fasa 4.3B - Simpan tindakan aduan.
 * DATABASE DEVELOPMENT SAHAJA.
 *
 * Fungsi ini mengemas kini ADUAN dan
 * menambah sejarah dalam TINDAKAN.
 */

function safeActionText_(value) {
  const text = actionText_(value);

  // Elakkan formula injection dalam Sheets.
  if (/^[\s]*[=+\-@]/.test(text)) {
    return "'" + text;
  }

  return text;
}

function saveAdminAction(payload) {
  // Semak identiti pada backend.
  const adminEmail = requireAdmin_();

  // Validasi sebelum menyentuh database.
  const input = validateAdminAction_(payload);

  const lock = LockService.getScriptLock();

  if (!lock.tryLock(30000)) {
    throw new Error(
      'Sistem sedang sibuk. Cuba sebentar lagi.'
    );
  }

  try {
    const ss = SpreadsheetApp.openById(
      ADMIN_CONFIG.databaseId
    );

    // Pastikan database pembangunan.
    if (ss.getName() !==
        'iADUAN_IPV_DATABASE_DEV') {
      throw new Error(
        'Database pembangunan tidak sepadan.'
      );
    }

    const aduanSheet = ss.getSheetByName('ADUAN');
    const tindakanSheet =
      ss.getSheetByName('TINDAKAN');

    if (!aduanSheet || !tindakanSheet) {
      throw new Error(
        'Tab database tidak lengkap.'
      );
    }

    const lastRow = aduanSheet.getLastRow();

    if (lastRow < 2) {
      throw new Error('Tiada rekod aduan.');
    }

    const ids = aduanSheet.getRange(
      2, 1, lastRow - 1, 1
    ).getValues();

    const matchIndex = ids.findIndex(
      function(row) {
        return String(row[0]).trim() ===
          input.complaintId;
      }
    );

    if (matchIndex === -1) {
      throw new Error('Aduan tidak ditemui.');
    }

    const rowNumber = matchIndex + 2;

    const currentStatus = String(
      aduanSheet.getRange(
        rowNumber, 9
      ).getValue()
    ).trim();

    if (!ACTION_CONFIG.statuses.includes(
      currentStatus
    )) {
      throw new Error(
        'Status asal aduan tidak sah.'
      );
    }

    const now = new Date();

    const actionId = Utilities.getUuid();

    // Sediakan rekod sejarah tindakan.
    const actionRow = [
      actionId,
      input.complaintId,
      now,
      adminEmail,
      currentStatus,
      input.status,
      safeActionText_(input.note),
      safeActionText_(input.assignee),
      input.targetDate
    ];

    // Simpan nilai asal untuk pemulihan
    // jika berlaku kegagalan biasa.
    const oldUpdatedAt = aduanSheet
      .getRange(rowNumber, 12).getValue();

    const oldCompletedAt = aduanSheet
      .getRange(rowNumber, 13).getValue();

    const nextCompletedAt =
      input.status === 'SELESAI'
        ? (currentStatus === 'SELESAI' &&
           oldCompletedAt ? oldCompletedAt : now)
        : '';

    let historyRowNumber = null;

    try {
      // 1. Rekod sejarah tindakan dahulu.
      historyRowNumber =
        tindakanSheet.getLastRow() + 1;

      tindakanSheet
        .getRange(historyRowNumber, 1, 1, 9)
        .setValues([actionRow]);

      SpreadsheetApp.flush();

      // 2. Kemas kini status aduan.
      aduanSheet
        .getRange(rowNumber, 9)
        .setValue(input.status);

      aduanSheet
        .getRange(rowNumber, 12)
        .setValue(now);

      aduanSheet
        .getRange(rowNumber, 13)
        .setValue(nextCompletedAt);

      SpreadsheetApp.flush();

    } catch (error) {
      // Pemulihan terbaik bagi ralat biasa.
      // Jika gagal, rekod perlu disemak manual.
      let rollbackFailed = false;

      try {
        aduanSheet.getRange(
          rowNumber, 9
        ).setValue(currentStatus);

        aduanSheet.getRange(
          rowNumber, 12
        ).setValue(oldUpdatedAt);

        aduanSheet.getRange(
          rowNumber, 13
        ).setValue(oldCompletedAt);

        if (historyRowNumber !== null) {
          const savedId = String(
            tindakanSheet.getRange(
              historyRowNumber, 1
            ).getValue()
          );

          if (savedId === actionId) {
            tindakanSheet.deleteRow(
              historyRowNumber
            );
          }
        }

        SpreadsheetApp.flush();

      } catch (rollbackError) {
        rollbackFailed = true;
        console.error(rollbackError);
      }

      if (rollbackFailed) {
        throw new Error(
          'Ralat penyimpanan dan pemulihan. ' +
          'Semak ADUAN serta TINDAKAN ' +
          'sebelum mencuba semula.'
        );
      }

      throw new Error(
        'Gagal menyimpan tindakan. ' +
        'Semak rekod sebelum cuba lagi. ' +
        error.message
      );
    }

    return {
      success: true,
      actionId: actionId,
      complaintId: input.complaintId,
      previousStatus: currentStatus,
      newStatus: input.status,
      message: 'Tindakan berjaya disimpan.'
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * Fasa 4.3B - Ujian sebelum simpan tindakan.
 * READ ONLY - Tidak mengubah Google Sheets.
 */
function testAdminActionDryRun() {
  requireAdmin_();

  const input = validateAdminAction_({
    complaintId: 'IPV-2026-0002',
    status: 'DALAM_TINDAKAN',
    assignee: 'Kontraktor Penyelenggaraan',
    note: 'Pemeriksaan awal telah dilakukan.',
    targetDate: '2026-10-21'
  });

  const ss = SpreadsheetApp.openById(
    ADMIN_CONFIG.databaseId
  );

  if (ss.getName() !== 'iADUAN_IPV_DATABASE_DEV') {
    throw new Error('Database DEV tidak sepadan.');
  }

  const aduanSheet = ss.getSheetByName('ADUAN');
  const tindakanSheet = ss.getSheetByName('TINDAKAN');

  if (!aduanSheet || !tindakanSheet) {
    throw new Error('Tab database tidak lengkap.');
  }

  const lastRow = aduanSheet.getLastRow();

  if (lastRow < 2) {
    throw new Error('Tiada rekod aduan.');
  }

  const ids = aduanSheet.getRange(
    2, 1, lastRow - 1, 1
  ).getValues();

  const index = ids.findIndex(function(row) {
    return String(row[0]).trim() === input.complaintId;
  });

  if (index === -1) {
    throw new Error('Aduan ujian tidak ditemui.');
  }

  const currentStatus = String(
    aduanSheet.getRange(index + 2, 9).getValue()
  ).trim();

  const result = {
    success: true,
    complaintId: input.complaintId,
    currentStatus: currentStatus,
    proposedStatus: input.status,
    assignee: input.assignee,
    note: input.note,
    targetDate: input.targetDate,
    existingActionCount:
      Math.max(0, tindakanSheet.getLastRow() - 1),
    databaseModified: false
  };

  Logger.log(JSON.stringify(result, null, 2));

  return result;
}

/**
 * UJIAN SIMPAN TINDAKAN PERTAMA
 *
 * PERHATIAN:
 * Fungsi ini akan mengubah data DEV.
 * Jalankan SEKALI sahaja selepas disahkan.
 */
function testSaveAdminActionOnce() {
  const result = saveAdminAction({
    complaintId: 'IPV-2026-0002',
    status: 'DALAM_TINDAKAN',
    assignee: 'Kontraktor Penyelenggaraan',
    note: 'UJIAN SISTEM - Pemeriksaan awal telah dilakukan.',
    targetDate: '2026-10-21'
  });

  Logger.log(JSON.stringify(result, null, 2));

  return result;
}
