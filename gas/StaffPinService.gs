/**
 * iADUAN IPV — Staff PIN Authentication V1 (GAS Staf sahaja).
 *
 * Satu Script Properties store (tiada spreadsheet/tab tambahan).
 * PIN tidak ditulis ke log, GitHub atau Google Sheets.
 * Staff PIN = 6 digit; hash HMAC-SHA256 dengan secret pepper
 * (Script Properties) + salt rawak per staf.
 *
 * Semua fungsi berakhiran "_" agar tidak boleh dipanggil terus
 * daripada google.script.run.
 */
const STAFF_PIN_CONFIG_ = Object.freeze({
  pepperKey: 'IADUAN_STAFF_PIN_PEPPER_V1',
  bootstrapKey: 'IADUAN_STAFF_PIN_BOOTSTRAP_JSON',
  maxFailures: 5,
  lockMinutes: 15
});

function staffPinHex_(bytes) {
  return bytes.map(function(byte) {
    return ('0' + (byte & 255).toString(16)).slice(-2);
  }).join('');
}

function staffPinPropertyKey_(staffId) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(staffId),
    Utilities.Charset.UTF_8
  );
  return 'IADUAN_PIN_V1_' + staffPinHex_(digest).slice(0, 32);
}

function staffPinMac_(pepper, staffId, salt, pin) {
  const message = JSON.stringify([String(staffId), salt, pin]);
  return staffPinHex_(
    Utilities.computeHmacSha256Signature(message, pepper)
  );
}

function staffPinEqual_(a, b) {
  // Perbandingan tanpa berhenti awal (panjang hash tetap).
  const left = String(a || '');
  const right = String(b || '');
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) {
    diff |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/**
 * Digunakan di dalam submitComplaint() yang sudah memegang ScriptLock.
 * Gagal tertutup jika PIN belum diprovision atau pepper hilang.
 */
function verifyStaffPin_(staffId, pin) {
  const props = PropertiesService.getScriptProperties();
  const key = staffPinPropertyKey_(staffId);
  const raw = props.getProperty(key);
  const pepper = props.getProperty(STAFF_PIN_CONFIG_.pepperKey);
  if (!pepper || !raw) {
    throw new Error('PIN staf belum disediakan. Hubungi urus setia.');
  }

  let record;
  try {
    record = JSON.parse(raw);
  } catch (error) {
    throw new Error('Konfigurasi PIN tidak sah. Hubungi urus setia.');
  }

  if (!record || record.version !== 1 ||
      typeof record.salt !== 'string' ||
      typeof record.hash !== 'string' ||
      !/^[0-9a-f]{64}$/.test(record.hash) ||
      !/^[0-9a-f]{32}$/.test(record.salt)) {
    throw new Error('Konfigurasi PIN tidak sah. Hubungi urus setia.');
  }

  const now = Date.now();
  if (Number(record.lockUntil || 0) > now) {
    throw new Error('PIN dikunci sementara. Cuba lagi selepas 15 minit.');
  }

  const formatted = typeof pin === 'string' && /^[0-9]{6}$/.test(pin);
  const matches = formatted && staffPinEqual_(
    staffPinMac_(pepper, staffId, record.salt, pin),
    record.hash
  );

  if (!matches) {
    const failures = (Number(record.lockUntil || 0) > 0 &&
      Number(record.lockUntil) <= now) ? 1 :
      Number(record.failures || 0) + 1;
    record.failures = failures;
    record.lockUntil = failures >= STAFF_PIN_CONFIG_.maxFailures
      ? now + STAFF_PIN_CONFIG_.lockMinutes * 60 * 1000 : 0;
    props.setProperty(key, JSON.stringify(record));
    throw new Error(
      failures >= STAFF_PIN_CONFIG_.maxFailures
        ? 'Terlalu banyak percubaan. PIN dikunci selama 15 minit.'
        : 'PIN tidak sah. Sila semak dan cuba lagi.'
    );
  }

  if (Number(record.failures || 0) !== 0 || record.lockUntil) {
    record.failures = 0;
    record.lockUntil = 0;
    props.setProperty(key, JSON.stringify(record));
  }
  return true;
}

/**
 * Provision PIN secara batch SEKALI melalui Apps Script Editor oleh owner.
 *
 * Input: Script Property IADUAN_STAFF_PIN_BOOTSTRAP_JSON
 * Contoh (ID staf sebenar daripada tab PENGGUNA):
 * {"STAFF001":"123456","STAFF002":"654321"}
 *
 * Jangan commit/console.log PIN. Fungsi private ini perlu dipanggil
 * oleh wrapper sementara dalam editor (rujuk docs/STAFF_PIN_HANDOVER.md).
 * Selepas berjaya, bootstrapKey dipadam; hanya salt + HMAC tinggal.
 */
function bootstrapStaffPins_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    throw new Error('Sistem sedang sibuk. Cuba lagi.');
  }
  try {
    const props = PropertiesService.getScriptProperties();
    const raw = props.getProperty(STAFF_PIN_CONFIG_.bootstrapKey);
    if (!raw) {
      throw new Error('Konfigurasi sementara PIN belum dimasukkan.');
    }

    let input;
    try {
      input = JSON.parse(raw);
    } catch (error) {
      throw new Error('JSON provisioning PIN tidak sah.');
    }

    if (!input || typeof input !== 'object' ||
        Array.isArray(input) || Object.keys(input).length === 0) {
      throw new Error('Senarai PIN kosong atau tidak sah.');
    }

    const ss = getDevDatabase_();
    const sheet = ss.getSheetByName('PENGGUNA');
    if (!sheet || sheet.getLastRow() < 2) {
      throw new Error('Tab PENGGUNA tidak tersedia.');
    }

    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5)
      .getValues();
    const ids = rows.filter(function(row) {
      return String(row[0]).trim() && String(row[2]).trim();
    }).map(function(row) { return String(row[0]).trim(); });
    const inputIds = Object.keys(input);
    inputIds.forEach(function(staffId) {
      if (ids.indexOf(staffId) === -1 ||
          typeof input[staffId] !== 'string' ||
          !/^[0-9]{6}$/.test(input[staffId])) {
        throw new Error('ID staf atau format PIN provisioning tidak sah.');
      }
    });

    // Tiada plaintext PIN disimpan dalam baris spreadsheet.
    let pepper = props.getProperty(STAFF_PIN_CONFIG_.pepperKey);
    if (!pepper) {
      pepper = Utilities.getUuid() + Utilities.getUuid();
      props.setProperty(STAFF_PIN_CONFIG_.pepperKey, pepper);
    }

    // Siapkan rekod dahulu; jika input salah tiada PIN diubah.
    const changes = {};
    inputIds.forEach(function(staffId) {
      const salt = staffPinHex_(Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        Utilities.getUuid() + Utilities.getUuid(),
        Utilities.Charset.UTF_8
      )).slice(0, 32);
      changes[staffPinPropertyKey_(staffId)] = JSON.stringify({
        version: 1,
        salt: salt,
        hash: staffPinMac_(pepper, staffId, salt, input[staffId]),
        failures: 0,
        lockUntil: 0
      });
    });

    props.setProperties(changes, false);
    props.deleteProperty(STAFF_PIN_CONFIG_.bootstrapKey);
    return { success: true, provisioned: inputIds.length };
  } finally {
    lock.releaseLock();
  }
}
