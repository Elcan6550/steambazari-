const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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

async function main() {
  console.log('🌱 SteamBazari Guard Portal məlumat bazasının yenilənməsi başladı...');

  // 1. Admin User
  const adminPasswordHash = await bcrypt.hash('AdminSecurePassword2026!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@steambazari.az' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@steambazari.az',
      name: 'SteamBazari Baş İnzibatçı',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+994 50 777 00 00',
    },
  });
  console.log('✅ Admin istifadəçisi hazır: admin@steambazari.az');

  // 2. Customer User
  const customerPasswordHash = await bcrypt.hash('CustomerPassword2026!', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'elvin.aliyev@gmail.com' },
    update: {
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
    create: {
      email: 'elvin.aliyev@gmail.com',
      name: 'Elvin Əliyev',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      phone: '+994 50 123 45 67',
    },
  });
  console.log('✅ Demo müştəri hazır: elvin.aliyev@gmail.com');

  // 3. Gmail Configurations for GTA 5 and RDR 2
  await prisma.gmailConfig.upsert({
    where: { game: 'GTA5' },
    update: {
      email: 'isayevelcan5@gmail.com',
      encryptedPassword: encryptText('Steambazarigta5@'),
      status: 'NEEDS_APP_PASSWORD',
    },
    create: {
      game: 'GTA5',
      gameName: 'Grand Theft Auto V',
      email: 'isayevelcan5@gmail.com',
      encryptedPassword: encryptText('Steambazarigta5@'),
      status: 'NEEDS_APP_PASSWORD',
      lastCheckedAt: new Date(),
      lastCodeFound: '849201',
      lastSubjectFound: 'Rockstar Games Social Club - Giriş Təsdiq Kodu',
    },
  });
  console.log('✅ GTA 5 Gmail konfiqurasiyası yazıldı: isayevelcan5@gmail.com');

  await prisma.gmailConfig.upsert({
    where: { game: 'RDR2' },
    update: {
      email: 'steambazari.rdr2@gmail.com',
    },
    create: {
      game: 'RDR2',
      gameName: 'Red Dead Redemption 2',
      email: 'steambazari.rdr2@gmail.com',
      encryptedPassword: null,
      status: 'NEEDS_CONFIG',
      lastCheckedAt: new Date(),
      lastCodeFound: 'HX79K',
      lastSubjectFound: 'Steam Guard Access Code for Red Dead Redemption 2',
    },
  });
  console.log('✅ RDR 2 Gmail konfiqurasiyası yazıldı: steambazari.rdr2@gmail.com');

  // 4. Sample Guard Request for Customer Demo
  await prisma.guardRequest.create({
    data: {
      userId: customer.id,
      game: 'GTA5',
      targetEmail: 'isayevelcan5@gmail.com',
      code: '849201',
      subject: 'Rockstar Games Social Club - Giriş Təsdiq Kodu',
      sender: 'Rockstar Games Support',
      status: 'SUCCESS',
      ipAddress: '127.0.0.1',
    },
  });
  console.log('✅ Demo Guard sorğusu və kodu qeydə alındı.');

  console.log('🎉 Bütün ilkin məlumatlar uğurla tamamlandı!');
}

main()
  .catch((e) => {
    console.error('Xəta:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
