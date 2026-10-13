
/**
 * iADUAN IPV - Admin Image Service
 * Fasa 4.2
 *
 * Membaca gambar secara READ-ONLY.
 * Tidak mengubah Google Drive atau Sheets.
 */

/**
 * Dapatkan gambar berdasarkan nombor aduan.
 *
 * Jangan terima Google Drive file ID
 * secara terus daripada browser.
 */
function getAdminComplaintImages(complaintId) {
  requireAdmin_();

  const id = String(complaintId || '').trim();

  if (!/^IPV-\d{4}-\d{4,}$/.test(id)) {
    throw new Error('Nombor aduan tidak sah.');
  }

  const ss = SpreadsheetApp.openById(
    ADMIN_CONFIG.databaseId
  );

  const sheet = ss.getSheetByName('ADUAN');

  if (!sheet) {
    throw new Error('Tab ADUAN tidak ditemui.');
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const rows = sheet.getRange(
    2, 1, lastRow - 1, 11
  ).getValues();

  const row = rows.find(function(item) {
    return String(item[0]).trim() === id;
  });

  if (!row) {
    throw new Error('Aduan tidak ditemui.');
  }

  const imageIds = String(row[10] || '')
    .split(',')
    .map(function(value) {
      return value.trim();
    })
    .filter(Boolean);

  if (imageIds.length > 3) {
    throw new Error(
      'Bilangan gambar melebihi had.'
    );
  }

  const images = imageIds.map(function(fileId, index) {
    const file = DriveApp.getFileById(fileId);

    // Had semakan keselamatan tambahan.
    if (![
      'image/jpeg',
      'image/png',
      'image/webp'
    ].includes(file.getMimeType())) {
      throw new Error(
        'Format gambar tidak dibenarkan.'
      );
    }

    if (file.getSize() > 5 * 1024 * 1024) {
      throw new Error(
        'Saiz gambar melebihi had.'
      );
    }

    const blob = file.getBlob();

    return {
      name: file.getName(),
      index: index + 1,
      mimeType: file.getMimeType(),
      dataUrl:
        'data:' + file.getMimeType() +
        ';base64,' +
        Utilities.base64Encode(blob.getBytes())
    };
  });

  return images;
}

/**
 * Ujian satu gambar daripada aduan DEV.
 *
 * Jangan log kandungan base64 gambar.
 */
function testAdminImageAccess() {
  const images = getAdminComplaintImages(
    'IPV-2026-0002'
  );

  const result = {
    success: true,
    complaintId: 'IPV-2026-0002',
    imageCount: images.length,
    imageNames: images.map(function(item) {
      return item.name;
    })
  };

  Logger.log(JSON.stringify(result, null, 2));

  return result;
}
