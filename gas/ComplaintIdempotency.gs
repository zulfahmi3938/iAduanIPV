/**
 * iADUAN IPV — Idempotensi penghantaran aduan Staf (DEV).
 *
 * ADUAN!N = REQUEST_ID dan ADUAN!O = REQUEST_HASH.
 * Kedua-dua kolum mesti ditambah oleh owner sebelum deploy.
 * Rekod disimpan bersama row ADUAN, bukan cache sementara.
 */
const COMPLAINT_IDEMPOTENCY_ = Object.freeze({
  idColumn: 14,
  hashColumn: 15,
  headers: ['REQUEST_ID', 'REQUEST_HASH']
});

function normaliseComplaintRequestId_(value) {
  if (typeof value !== 'string') {
    throw new Error('ID penghantaran tidak sah. Muat semula borang.');
  }
  const id = value.toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id)) {
    throw new Error('ID penghantaran tidak sah. Muat semula borang.');
  }
  return id;
}

function complaintDigestHex_(text) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    text,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(byte) {
    return ('0' + (byte & 255).toString(16)).slice(-2);
  }).join('');
}

/**
 * Cap jari tidak melibatkan PIN. Isi setiap gambar di-hash
 * agar token yang sama dengan payload berlainan ditolak.
 */
function complaintRequestHash_(staffId, location, description, images) {
  if (!Array.isArray(images) || images.length > 3) {
    throw new Error('Format lampiran tidak sah.');
  }
  const fingerprints = images.map(function(image) {
    if (!image || typeof image !== 'object' || Array.isArray(image)) {
      throw new Error('Maklumat gambar tidak sah.');
    }
    const data = String(image.data || '');
    if (!data || data.length > 7200000) {
      throw new Error('Data gambar tidak sah atau terlalu besar.');
    }
    return [
      String(image.name || ''),
      String(image.type || ''),
      complaintDigestHex_(data)
    ];
  });
  return complaintDigestHex_(JSON.stringify([
    staffId, location, description, fingerprints
  ]));
}

function requireComplaintIdempotencyColumns_(sheet) {
  if (sheet.getMaxColumns() < COMPLAINT_IDEMPOTENCY_.hashColumn) {
    throw new Error(
      'Struktur ADUAN belum dikemas kini. Hubungi urus setia.'
    );
  }
  const headers = sheet.getRange(
    1, COMPLAINT_IDEMPOTENCY_.idColumn, 1, 2
  ).getValues()[0];
  if (String(headers[0]).trim() !== 'REQUEST_ID' ||
      String(headers[1]).trim() !== 'REQUEST_HASH') {
    throw new Error(
      'Struktur ADUAN belum dikemas kini. Hubungi urus setia.'
    );
  }
}

/**
 * Semak durable receipt dalam ADUAN di bawah ScriptLock
 * bila digunakan untuk operasi tulis.
 */
function findComplaintRequest_(sheet, requestId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const rows = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
  let found = null;
  rows.forEach(function(row) {
    if (String(row[13]).trim().toLowerCase() !== requestId) return;
    if (found) {
      throw new Error('Rekod penghantaran berganda dikesan. Hubungi urus setia.');
    }
    found = {
      complaintId: String(row[0]).trim(),
      requestHash: String(row[14]).trim()
    };
  });
  if (found && (!/^IPV-\d{4}-\d{4,}$/.test(found.complaintId) ||
      !/^[0-9a-f]{64}$/.test(found.requestHash))) {
    throw new Error('Rekod penghantaran tidak konsisten. Hubungi urus setia.');
  }
  return found;
}

function complaintReceipt_(id, requestId, duplicate) {
  return {
    success: true,
    complaintId: id,
    requestId: requestId,
    duplicate: Boolean(duplicate),
    message: duplicate
      ? 'Aduan yang sama sudah direkodkan.'
      : 'Aduan berjaya direkodkan.'
  };
}

/**
 * Lookup read-only untuk pulihkan rujukan selepas timeout/refresh.
 * UUID rawak diperlukan; hanya pulangkan nombor rujukan, bukan isi aduan.
 * found:false tidak membuktikan request asal sudah tamat.
 */
function checkComplaintSubmissionStatus(requestId) {
  const id = normaliseComplaintRequestId_(requestId);
  const ss = getDevDatabase_();
  const sheet = ss.getSheetByName('ADUAN');
  if (!sheet) throw new Error('Tab ADUAN tidak ditemui.');
  requireComplaintIdempotencyColumns_(sheet);
  const found = findComplaintRequest_(sheet, id);
  return found
    ? { found: true, requestId: id, complaintId: found.complaintId }
    : { found: false, requestId: id };
}
