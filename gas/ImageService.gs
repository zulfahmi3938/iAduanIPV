
/**
 * iADUAN IPV - Image Storage
 * Version: 0.3.1
 * DEVELOPMENT ONLY
 *
 * Sediakan folder peribadi untuk gambar aduan.
 */

const IMAGE_STORAGE = Object.freeze({
  folderName: 'iADUAN_IPV_IMAGES_DEV',
  propertyKey: 'IADUAN_DEV_IMAGE_FOLDER_ID'
});

/**
 * Jalankan sekali untuk mencipta folder.
 *
 * Jika folder ID sudah disimpan,
 * gunakan folder sedia ada.
 */
function setupImageFolder() {
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(30000)) {
    throw new Error(
      'Setup sedang berjalan. Cuba semula.'
    );
  }

  try {
    const props =
      PropertiesService.getScriptProperties();

    const existingId = props.getProperty(
      IMAGE_STORAGE.propertyKey
    );

    if (existingId) {
      const existingFolder =
        DriveApp.getFolderById(existingId);

      Logger.log(
        'Folder sedia ada: ' +
        existingFolder.getUrl()
      );

      return existingFolder.getUrl();
    }

    const folder = DriveApp.createFolder(
      IMAGE_STORAGE.folderName
    );

    props.setProperty(
      IMAGE_STORAGE.propertyKey,
      folder.getId()
    );

    Logger.log(JSON.stringify({
      success: true,
      folderName: folder.getName(),
      folderId: folder.getId(),
      folderUrl: folder.getUrl(),
      environment: 'DEVELOPMENT'
    }, null, 2));

    return folder.getUrl();

  } finally {
    lock.releaseLock();
  }
}

/**
 * Semak folder tanpa mengubah fail.
 */
function checkImageFolder() {
  const id = PropertiesService
    .getScriptProperties()
    .getProperty(
      IMAGE_STORAGE.propertyKey
    );

  if (!id) {
    throw new Error(
      'Folder belum dicipta.'
    );
  }

  const folder = DriveApp.getFolderById(id);

  const result = {
    success: true,
    folderName: folder.getName(),
    folderUrl: folder.getUrl(),
    folderId: folder.getId()
  };

  Logger.log(
    JSON.stringify(result, null, 2)
  );

  return result;
}

/**
 * iADUAN IPV - Image Upload Helper
 *
 * Fungsi dalaman sahaja.
 * Akan dipanggil oleh fungsi penghantaran aduan.
 *
 * images = [
 *   {name, type, data}
 * ]
 *
 * data ialah kandungan fail dalam Base64.
 */

function saveComplaintImages_(complaintId, images) {
  if (!Array.isArray(images)) {
    throw new Error('Format lampiran tidak sah.');
  }

  if (images.length > 3) {
    throw new Error(
      'Maksimum 3 gambar bagi setiap aduan.'
    );
  }

  const folderId = PropertiesService
    .getScriptProperties()
    .getProperty(
      'IADUAN_DEV_IMAGE_FOLDER_ID'
    );

  if (!folderId) {
    throw new Error(
      'Folder gambar belum disediakan.'
    );
  }

  const folder = DriveApp.getFolderById(folderId);
  const savedIds = [];

  try {
    images.forEach(function(image, index) {
      if (!image || typeof image !== 'object') {
        throw new Error('Maklumat gambar tidak sah.');
      }

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
      ];

      const type = String(image.type || '');

      if (!allowedTypes.includes(type)) {
        throw new Error(
          'Hanya gambar JPG, PNG atau WebP dibenarkan.'
        );
      }

      const data = String(image.data || '');

      if (!data ||
          data.length > 7200000 ||
          !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) {
        throw new Error(
          'Data gambar tidak sah atau terlalu besar.'
        );
      }

      const bytes = Utilities.base64Decode(data);

      if (bytes.length === 0 ||
          bytes.length > 5 * 1024 * 1024) {
        throw new Error(
          'Setiap gambar mesti berukuran maksimum 5 MB.'
        );
      }

      // Semak signature fail, bukan MIME sahaja.
      const b = bytes.map(function(v) {
        return v & 255;
      });

      const jpg = b.length >= 3 &&
        b[0] === 255 && b[1] === 216 &&
        b[2] === 255;

      const png = b.length >= 8 &&
        [137,80,78,71,13,10,26,10].every(
          function(v, i) { return b[i] === v; }
        );

      const webp = b.length >= 12 &&
        String.fromCharCode.apply(
          null, b.slice(0,4)
        ) === 'RIFF' &&
        String.fromCharCode.apply(
          null, b.slice(8,12)
        ) === 'WEBP';

      const valid =
        (type === 'image/jpeg' && jpg) ||
        (type === 'image/png' && png) ||
        (type === 'image/webp' && webp);

      if (!valid) {
        throw new Error(
          'Kandungan fail tidak sepadan dengan jenis gambar.'
        );
      }

      const extension = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp'
      }[type];

      const fileName =
        complaintId + '_GAMBAR_' +
        String(index + 1) + '.' + extension;

      const blob = Utilities.newBlob(
        bytes, type, fileName
      );

      const file = folder.createFile(blob);
      savedIds.push(file.getId());
    });

    return savedIds;

  } catch (error) {
    // Bersihkan fail yang sempat dimuat naik
    // jika ada masalah semasa proses.
    savedIds.forEach(function(id) {
      try {
        DriveApp.getFileById(id).setTrashed(true);
      } catch (cleanupError) {
        console.error(cleanupError);
      }
    });

    throw error;
  }
}
