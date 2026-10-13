
/**
 * =====================================================
 * iADUAN IPV - DATABASE SETUP
 * Version: 0.2.0
 * Environment: DEVELOPMENT ONLY
 *
 * Fungsi:
 * 1. Mencipta spreadsheet pembangunan baharu.
 * 2. Menyediakan 4 tab utama.
 * 3. Menyimpan Spreadsheet ID.
 * 4. Mengelakkan ciptaan berganda.
 *
 * Tidak mengubah spreadsheet production.
 * =====================================================
 */

const DB_SETUP = Object.freeze({
  name: 'iADUAN_IPV_DATABASE_DEV',
  propertyKey: 'IADUAN_DEV_SPREADSHEET_ID',

  headers: {
    ADUAN: [
      'ADUAN_ID',
      'TARIKH_ADUAN',
      'PELAPOR_EMAIL',
      'PELAPOR_NAMA',
      'PELAPOR_UNIT',
      'LOKASI',
      'KATEGORI',
      'KETERANGAN',
      'STATUS',
      'KEUTAMAAN',
      'GAMBAR_FILE_IDS',
      'TARIKH_KEMASKINI',
      'TARIKH_SELESAI'
    ],

    TINDAKAN: [
      'TINDAKAN_ID',
      'ADUAN_ID',
      'TARIKH_TINDAKAN',
      'TINDAKAN_OLEH',
      'STATUS_ASAL',
      'STATUS_BAHARU',
      'CATATAN',
      'PEGAWAI_BERTANGGUNGJAWAB',
      'TARIKH_SASARAN'
    ],

    PENGGUNA: [
      'PENGGUNA_ID',
      'EMAIL',
      'NAMA',
      'UNIT',
      'PERANAN',
      'TARIKH_DAFTAR',
      'TARIKH_AKTIF_TERAKHIR'
    ],

    KONFIGURASI: [
      'KUNCI',
      'NILAI',
      'KETERANGAN'
    ]
  }
});

/**
 * Jalankan fungsi ini sekali untuk setup.
 *
 * Jika spreadsheet sudah wujud:
 * - Gunakan semula ID tersimpan.
 * - Tidak padam atau reset data.
 *
 * Jika ID tersimpan tidak boleh diakses:
 * - Hentikan operasi.
 * - Jangan cipta spreadsheet pengganti.
 */
function setupDatabase() {
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(30000)) {
    throw new Error(
      'Setup lain sedang berjalan. Cuba semula.'
    );
  }

  try {
    const props =
      PropertiesService.getScriptProperties();

    let spreadsheetId = props.getProperty(
      DB_SETUP.propertyKey
    );

    let ss;

    if (spreadsheetId) {
      // Jangan cipta database baharu jika ID
      // sudah direkodkan.
      ss = SpreadsheetApp.openById(spreadsheetId);

      Logger.log(
        'Menggunakan database sedia ada: ' +
        ss.getUrl()
      );
    } else {
      // Cipta spreadsheet development sahaja.
      ss = SpreadsheetApp.create(DB_SETUP.name);

      // Simpan ID seawal mungkin supaya
      // rerun tidak mencipta spreadsheet lagi.
      spreadsheetId = ss.getId();

      props.setProperty(
        DB_SETUP.propertyKey,
        spreadsheetId
      );

      Logger.log(
        'Spreadsheet baharu dicipta: ' +
        ss.getUrl()
      );
    }

    createDatabaseTabs_(ss);

    Logger.log(
      JSON.stringify({
        success: true,
        spreadsheetId: spreadsheetId,
        spreadsheetUrl: ss.getUrl(),
        tabs: Object.keys(DB_SETUP.headers),
        environment: 'DEVELOPMENT'
      }, null, 2)
    );

    return ss.getUrl();

  } finally {
    lock.releaseLock();
  }
}

/**
 * Sediakan tab database.
 *
 * Jika tab sudah wujud:
 * - Tidak dipadam.
 * - Tidak direset.
 * - Tidak ditulis semula.
 */
function createDatabaseTabs_(ss) {
  const tabNames = Object.keys(DB_SETUP.headers);

  tabNames.forEach(function(name) {
    const existing = ss.getSheetByName(name);

    if (existing) {
      Logger.log('Tab sudah wujud: ' + name);
      return;
    }

    let sheet;

    // Gunakan tab kosong asal apabila selamat.
    const sheets = ss.getSheets();

    if (
      sheets.length === 1 &&
      sheets[0].getLastRow() === 0 &&
      !tabNames.includes(sheets[0].getName())
    ) {
      sheet = sheets[0];
      sheet.setName(name);
    } else {
      sheet = ss.insertSheet(name);
    }

    const headers = DB_SETUP.headers[name];

    sheet.getRange(
      1, 1, 1, headers.length
    ).setValues([headers]);

    // Format tajuk.
    sheet.getRange(
      1, 1, 1, headers.length
    )
      .setBackground('#033662')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');

    sheet.setFrozenRows(1);

    sheet.getRange(
      1, 1, sheet.getMaxRows(), headers.length
    ).setVerticalAlignment('middle');

    sheet.autoResizeColumns(1, headers.length);

    // Tetapkan teks bagi ID dan email.
    if (name === 'ADUAN' || name === 'TINDAKAN') {
      sheet.getRange(
        2, 1, sheet.getMaxRows() - 1, 1
      ).setNumberFormat('@');
    }

    if (name === 'PENGGUNA') {
      sheet.getRange(
        2, 2, sheet.getMaxRows() - 1, 1
      ).setNumberFormat('@');
    }

    if (name === 'KONFIGURASI') {
      initializeSettings_(sheet);
    }

    Logger.log('Tab berjaya dicipta: ' + name);
  });
}

/**
 * Masukkan konfigurasi bukan rahsia.
 *
 * Peranan ADMIN tidak ditentukan oleh
 * nilai dalam spreadsheet ini.
 */
function initializeSettings_(sheet) {
  const settings = [
    [
      'APP_NAME',
      'iADUAN IPV',
      'Nama aplikasi'
    ],
    [
      'APP_VERSION',
      '0.2.0',
      'Versi database development'
    ],
    [
      'ENVIRONMENT',
      'DEVELOPMENT',
      'Persekitaran ujian'
    ],
    [
      'MAX_IMAGES',
      '3',
      'Maksimum gambar bagi satu aduan'
    ],
    [
      'MAX_IMAGE_SIZE_MB',
      '5',
      'Had saiz setiap gambar'
    ],
    [
      'TIMEZONE',
      'Asia/Kuala_Lumpur',
      'Zon waktu Malaysia'
    ]
  ];

  sheet.getRange(
    2, 1, settings.length, 3
  ).setValues(settings);
}

/**
 * Semak database tanpa mengubah data.
 */
function checkDatabase() {
  const props =
    PropertiesService.getScriptProperties();

  const spreadsheetId = props.getProperty(
    DB_SETUP.propertyKey
  );

  if (!spreadsheetId) {
    Logger.log(
      'Database belum disediakan. Jalankan setupDatabase.'
    );
    return false;
  }

  const ss = SpreadsheetApp.openById(spreadsheetId);

  const results = Object.keys(
    DB_SETUP.headers
  ).map(function(name) {
    const sheet = ss.getSheetByName(name);

    return {
      tab: name,
      exists: !!sheet,
      rows: sheet
        ? sheet.getLastRow()
        : 0
    };
  });

  Logger.log(
    JSON.stringify({
      success: results.every(
        function(item) {
          return item.exists;
        }
      ),
      databaseName: ss.getName(),
      databaseUrl: ss.getUrl(),
      tabs: results
    }, null, 2)
  );

  return results;
}
