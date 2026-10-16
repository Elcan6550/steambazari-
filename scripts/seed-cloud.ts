import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET_KEY || 'c3ab5249f76a08c8e14674068351052601249876543210abcedf0123456789ab';

function encryptText(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_SECRET, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

async function main() {
  console.log('--- Supabase Seeding Started ---');

  // 1. Create or update Admin
  const adminHash = await bcrypt.hash('AdminSecurePassword2026!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@steambazari.az' },
    update: {
      passwordHash: adminHash,
      role: 'ADMIN',
    },
    create: {
      name: 'SteamBazari Baş İnzibatçı',
      email: 'admin@steambazari.az',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user verified:', admin.email);

  // 2. Customer: Nicat Qasimov
  const nicatHash = await bcrypt.hash('NicatPassword123', 12);
  let nicat = await prisma.user.findFirst({ where: { name: 'Nicat Qasimov' } });
  if (!nicat) {
    nicat = await prisma.user.create({
      data: {
        name: 'Nicat Qasimov',
        passwordHash: nicatHash,
        plainPassword: 'NicatPassword123',
        role: 'CUSTOMER',
      },
    });
  }
  console.log('✓ Customer verified:', nicat.name);

  // 3. Gmail Configs
  await prisma.gmailConfig.upsert({
    where: { game: 'GTA5' },
    update: {
      email: 'isayevelcan5@gmail.com',
      encryptedPassword: encryptText('ghno vozk fxnt xrbo'),
      status: 'CONNECTED',
    },
    create: {
      game: 'GTA5',
      gameName: 'Grand Theft Auto V',
      email: 'isayevelcan5@gmail.com',
      encryptedPassword: encryptText('ghno vozk fxnt xrbo'),
      status: 'CONNECTED',
    },
  });
  console.log('✓ GTA 5 Gmail Config configured');

  await prisma.gmailConfig.upsert({
    where: { game: 'RDR2' },
    update: {
      email: 'steambazari.rdr2@gmail.com',
      encryptedPassword: encryptText('rfvy ifmx pjnn sfxf'),
      status: 'CONNECTED',
    },
    create: {
      game: 'RDR2',
      gameName: 'Red Dead Redemption 2',
      email: 'steambazari.rdr2@gmail.com',
      encryptedPassword: encryptText('rfvy ifmx pjnn sfxf'),
      status: 'CONNECTED',
    },
  });
  console.log('✓ RDR 2 Gmail Config configured');

  console.log('--- Supabase Seeding Completed Successfully ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
