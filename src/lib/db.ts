import { PrismaClient } from '@prisma/client';

const SUPABASE_DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.nbcwjzzubioagwwivnar:*ak84H)78%2BZQKqt@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10&connect_timeout=30&pool_timeout=30';

const SUPABASE_DIRECT_URL =
  process.env.DIRECT_URL ||
  'postgresql://postgres.nbcwjzzubioagwwivnar:*ak84H)78%2BZQKqt@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?connect_timeout=30';

// Ensure environment variables are populated at runtime in Netlify serverless functions
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = SUPABASE_DATABASE_URL;
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = SUPABASE_DIRECT_URL;
}
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = 'steambazari-secure-jwt-session-secret-key-2026-production';
}
if (!process.env.ENCRYPTION_SECRET_KEY) {
  process.env.ENCRYPTION_SECRET_KEY = 'c3ab5249f76a08c8e14674068351052601249876543210abcedf0123456789ab';
}
if (!process.env.GTA5_GMAIL_USER) {
  process.env.GTA5_GMAIL_USER = 'isayevelcan5@gmail.com';
  process.env.GTA5_GMAIL_PASS = 'ghno vozk fxnt xrbo';
}
if (!process.env.RDR2_GMAIL_USER) {
  process.env.RDR2_GMAIL_USER = 'steambazari.rdr2@gmail.com';
  process.env.RDR2_GMAIL_PASS = 'rfvy ifmx pjnn sfxf';
}
if (!process.env.ADMIN_DEFAULT_EMAIL) {
  process.env.ADMIN_DEFAULT_EMAIL = 'admin@steambazari.az';
  process.env.ADMIN_DEFAULT_PASSWORD = 'AdminSecurePassword2026!';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: SUPABASE_DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
