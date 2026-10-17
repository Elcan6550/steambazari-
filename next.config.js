/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    DATABASE_URL:
      process.env.DATABASE_URL ||
      'postgresql://postgres.nbcwjzzubioagwwivnar:*ak84H)78%2BZQKqt@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10&connect_timeout=30&pool_timeout=30',
    DIRECT_URL:
      process.env.DIRECT_URL ||
      'postgresql://postgres.nbcwjzzubioagwwivnar:*ak84H)78%2BZQKqt@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?connect_timeout=30',
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET ||
      'steambazari-secure-jwt-session-secret-key-2026-production',
    ENCRYPTION_SECRET_KEY:
      process.env.ENCRYPTION_SECRET_KEY ||
      'c3ab5249f76a08c8e14674068351052601249876543210abcedf0123456789ab',
    GTA5_GMAIL_USER: process.env.GTA5_GMAIL_USER || 'isayevelcan5@gmail.com',
    GTA5_GMAIL_PASS: process.env.GTA5_GMAIL_PASS || 'ghno vozk fxnt xrbo',
    RDR2_GMAIL_USER: process.env.RDR2_GMAIL_USER || 'steambazari.rdr2@gmail.com',
    RDR2_GMAIL_PASS: process.env.RDR2_GMAIL_PASS || 'rfvy ifmx pjnn sfxf',
    ADMIN_DEFAULT_EMAIL: process.env.ADMIN_DEFAULT_EMAIL || 'admin@steambazari.az',
    ADMIN_DEFAULT_PASSWORD: process.env.ADMIN_DEFAULT_PASSWORD || 'AdminSecurePassword2026!',
  },
};

module.exports = nextConfig;
