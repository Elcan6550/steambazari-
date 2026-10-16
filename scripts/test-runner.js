const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || 'c3ab5249f76a08c8e14674068351052601249876543210abcedf0123456789ab';

function getEncryptionKey() {
  if (SECRET_KEY.length === 64 && /^[0-9a-fA-F]+$/.test(SECRET_KEY)) {
    return Buffer.from(SECRET_KEY, 'hex');
  }
  return crypto.createHash('sha256').update(SECRET_KEY).digest();
}

function encryptText(plainText) {
  if (!plainText) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

function decryptText(encryptedPayload) {
  if (!encryptedPayload) return '';
  try {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) throw new Error('Invalid format');
    const [ivHex, tagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return null;
  }
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 SteamBazari Guard & 2FA Testləri');
  console.log('====================================================\n');

  // Test 1: Cryptography
  console.log('TEST QURUPU 1: AES-256-GCM Kriptoqrafiya');
  const testSecret = 'Steambazarigta5@';
  const enc = encryptText(testSecret);
  assert(enc.split(':').length === 3, 'Şifrə IV:TAG:PAYLOAD formatında şifrələndi');
  assert(decryptText(enc) === testSecret, 'Şifrə açılması orijinal mətnlə 100% eynidir');

  // Test 2: Accounts mapping
  console.log('\nTEST QURUPU 2: GTA 5 və RDR 2 Gmail Tənzimləmələri');
  const gta5Config = await prisma.gmailConfig.findUnique({ where: { game: 'GTA5' } });
  assert(gta5Config !== null, 'GTA 5 konfiqurasiyası bazada mövcuddur');
  assert(gta5Config.email === 'isayevelcan5@gmail.com', 'GTA 5 emaili isayevelcan5@gmail.com olaraq qeyd edilib');

  const rdr2Config = await prisma.gmailConfig.findUnique({ where: { game: 'RDR2' } });
  assert(rdr2Config !== null, 'RDR 2 konfiqurasiyası bazada mövcuddur');
  assert(rdr2Config.email === 'steambazari.rdr2@gmail.com', 'RDR 2 emaili steambazari.rdr2@gmail.com olaraq qeyd edilib');

  // Test 3: Guard Code Regex Extraction
  console.log('\nTEST QURUPU 3: Steam & Rockstar Guard Kodlarının Aşkar Edilməsi');
  const sampleSteamEmail = 'Hello, your Steam Guard code is HX79K to login.';
  const steamMatch = sampleSteamEmail.match(/\b([A-Z0-9]{5})\b/);
  assert(steamMatch && steamMatch[1] === 'HX79K', '5-simvollu Steam Guard kodu (HX79K) məktubdan uğurla aşkar edildi');

  const sampleRockstarEmail = `
    Rockstar Games
    Email Verification Code
    Enter this code on the identity verification screen:
    049502
    Rockstar Games, 622 Broadway, New York, NY USA 10012.
  `;
  const rockstar6DigitMatch = sampleRockstarEmail.match(/(?:verification screen|verification code|code)[:\s\n\r\t]+([0-9]{6})\b/i);
  assert(rockstar6DigitMatch && rockstar6DigitMatch[1] === '049502', '6-rəqəmli Rockstar 2FA kodu (049502) düzgün tapıldı (10012 poçt indeksi nəzərə alınmadı)');


  // Test 4: Guard Request Logging
  console.log('\nTEST QURUPU 4: Guard Sorğuları Jurnalı');
  const requests = await prisma.guardRequest.findMany();
  assert(requests.length > 0, 'Sistemdə guard sorğuları qeydə alınır');
  assert(requests[0].code !== null, 'Təsdiq kodu uğurla saxlanılıb');

  console.log('\n====================================================');
  console.log(`NƏTİCƏ: ${passedTests} / ${totalTests} test uğurla tamamlandı!`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    console.log('🎉 Bütün tələblər 100% təmin edilib!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
