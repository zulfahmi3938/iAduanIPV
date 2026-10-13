
/**
 * iADUAN IPV - Complaint Service
 * Version: 0.3.0
 * DEVELOPMENT ONLY
 *
 * Bergantung kepada DatabaseSetup.gs
 * dan spreadsheet DEV yang telah dicipta.
 */

/**
 * Buka spreadsheet DEV sahaja.
 */
function getDevDatabase_() {
  const id = PropertiesService
    .getScriptProperties()
    .getProperty(
      'IADUAN_DEV_SPREADSHEET_ID'
    );

  if (!id) {
    throw new Error(
      'Database DEV belum disediakan.'
    );
  }

  const ss = SpreadsheetApp.openById(id);

  if (ss.getName() !==
      'iADUAN_IPV_DATABASE_DEV') {
    throw new Error(
      'Nama database tidak sepadan.'
    );
  }

  return ss;
}

/**
 * Ambil senarai staf dari tab PENGGUNA.
 * Jangan hantar e-mel atau peranan
 * kepada frontend awam.
 */
function getFormOptions() {
  const ss = getDevDatabase_();
  const sheet = ss.getSheetByName('PENGGUNA');

  if (!sheet) {
    throw new Error(
      'Tab PENGGUNA tidak ditemui.'
    );
  }

  const lastRow = sheet.getLastRow();
  let staff = [];

  if (lastRow > 1) {
    const rows = sheet.getRange(
      2, 1, lastRow - 1, 5
    ).getValues();

    staff = rows
      .filter(function(row) {
        return String(row[0]).trim() &&
               String(row[2]).trim();
      })
      .map(function(row) {
        return {
          id: String(row[0]).trim(),
          name: String(row[2]).trim()
        };
      });
  }

  staff.sort(function(a, b) {
    return a.name.localeCompare(b.name, 'ms');
  });

  return {
  staff: staff
};
}

/**
 * Elak input ditafsir sebagai formula
 * apabila disimpan dalam Google Sheets.
 */
function safeSheetText_(value) {
  let text = String(value || '')
    .replace(/\u0000/g, '')
    .trim();

  if (/^[\s]*[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  return text;
}

/**
 * Jana ID berurutan mengikut tahun.
 * Dipanggil semasa ScriptLock dipegang.
 */
function nextComplaintId_(sheet) {
  const year = Utilities.formatDate(
    new Date(),
    'Asia/Kuala_Lumpur',
    'yyyy'
  );

  const prefix = 'IPV-' + year + '-';
  const lastRow = sheet.getLastRow();

  let maxNumber = 0;

  if (lastRow > 1) {
    const ids = sheet.getRange(
      2, 1, lastRow - 1, 1
    ).getValues();

    ids.forEach(function(row) {
      const id = String(row[0] || '');

      if (id.indexOf(prefix) === 0) {
        const suffix = id.slice(prefix.length);

        if (/^\d+$/.test(suffix)) {
          maxNumber = Math.max(
            maxNumber,
            Number(suffix)
          );
        }
      }
    });
  }

  return prefix +
    String(maxNumber + 1).padStart(4, '0');
}

/**
 * Hantar aduan baharu.
 *
 * Tiada login pada versi ini.
 * Nama dropdown bukan pengesahan identiti.
 *
 * Jangan tambah fungsi admin di sini.
 */
function submitComplaint(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Maklumat aduan tidak sah.');
  }

  const staffId = String(
    payload.staffId || ''
  ).trim();

  const location = String(
    payload.location || ''
  ).trim();

  const description = String(
    payload.description || ''
  ).trim();

  if (!staffId) {
    throw new Error('Sila pilih nama.');
  }

  if (location.length === 0) {
  throw new Error(
    'Sila nyatakan lokasi kerosakan.'
  );
}

if (location.length > 150) {
  throw new Error(
    'Lokasi tidak boleh melebihi 150 aksara.'
  );
}

  if (description.length < 5 ||
      description.length > 2000) {
    throw new Error(
      'Keterangan mestilah 5 hingga 2000 aksara.'
    );
  }

  // Sekatan kasar jumlah aduan sehari.
  // Bukan perlindungan spam yang lengkap.
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(30000)) {
    throw new Error(
      'Sistem sedang sibuk. Cuba sebentar lagi.'
    );
  }

  try {
    const ss = getDevDatabase_();

    const userSheet =
      ss.getSheetByName('PENGGUNA');

    const complaintSheet =
      ss.getSheetByName('ADUAN');

    if (!userSheet || !complaintSheet) {
      throw new Error(
        'Struktur database tidak lengkap.'
      );
    }

    // Sahkan ID staf berdasarkan spreadsheet.
    const userLastRow = userSheet.getLastRow();

    if (userLastRow < 2) {
      throw new Error(
        'Senarai staf masih kosong.'
      );
    }

    const users = userSheet.getRange(
      2, 1, userLastRow - 1, 5
    ).getValues();

    const user = users.find(function(row) {
      return String(row[0]).trim() === staffId &&
             String(row[2]).trim() !== '';
    });

    if (!user) {
      throw new Error(
        'Nama pelapor tidak ditemui.'
      );
    }

    const now = new Date();

    // Had global asas: maksimum 100
    // aduan dalam satu hari.
    const today = Utilities.formatDate(
      now,
      'Asia/Kuala_Lumpur',
      'yyyy-MM-dd'
    );

    const props = PropertiesService
      .getScriptProperties();

    const countKey = 'DEV_ADUAN_COUNT_' + today;

    const currentCount = Number(
      props.getProperty(countKey) || 0
    );

    if (currentCount >= 100) {
      throw new Error(
        'Had aduan harian dicapai. ' +
        'Hubungi urus setia.'
      );
    }

    const id = nextComplaintId_(
      complaintSheet
    );

    const row = [
      id,                           // ADUAN_ID
      now,                          // TARIKH_ADUAN
      '',                           // PELAPOR_EMAIL
      safeSheetText_(user[2]),      // PELAPOR_NAMA
      safeSheetText_(user[3]),      // PELAPOR_UNIT
      safeSheetText_(location),     // LOKASI
      '',                           // KATEGORI
      safeSheetText_(description),  // KETERANGAN
      'BAHARU',                     // STATUS
      'NORMAL',                     // KEUTAMAAN
      '',                           // GAMBAR_FILE_IDS
      now,                          // TARIKH_KEMASKINI
      ''                            // TARIKH_SELESAI
    ];

    
    // Simpan gambar sebelum merekodkan aduan.
    let savedImageIds = [];

    try {
      savedImageIds = saveComplaintImages_(
        id,
        payload.images || []
      );

      // Kolum K: GAMBAR_FILE_IDS
      row[10] = savedImageIds.join(',');

      // Simpan aduan bersama ID gambar.
      complaintSheet.appendRow(row);

    } catch (error) {
      // Bersihkan gambar jika rekod gagal.
      savedImageIds.forEach(function(fileId) {
        try {
          DriveApp.getFileById(fileId)
            .setTrashed(true);
        } catch (cleanupError) {
          console.error(cleanupError);
        }
      });

      throw error;
    }

    try {
      props.setProperty(
        countKey,
        String(currentCount + 1)
      );
    } catch (counterError) {
      console.error(counterError);
    }


    return {
      success: true,
      complaintId: id,
      message: 'Aduan berjaya direkodkan.'
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * Ujian membaca dropdown nama.
 */
function testStaffDropdown() {
  const data = getFormOptions();

  Logger.log(JSON.stringify({
  success: true,
  staffCount: data.staff.length,
  staff: data.staff
}, null, 2));

  return data.staff.length;
}
