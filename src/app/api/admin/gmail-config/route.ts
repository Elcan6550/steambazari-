import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { encryptText } from '@/lib/crypto';
import { GAME_ACCOUNTS, getLatestGuardCode } from '@/lib/gmail-imap';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const configs = await prisma.gmailConfig.findMany();

    // Map each game account
    const accounts = Object.values(GAME_ACCOUNTS).map((acc) => {
      const dbConfig = configs.find((c) => c.game === acc.game);
      return {
        game: acc.game,
        gameName: acc.gameName,
        email: acc.email,
        status: dbConfig?.status || (acc.defaultPassword ? 'CONFIGURED' : 'NEEDS_PASSWORD'),
        hasPassword: Boolean(dbConfig?.encryptedPassword || acc.defaultPassword),
        lastCheckedAt: dbConfig?.lastCheckedAt || null,
        lastCodeFound: dbConfig?.lastCodeFound || null,
        lastSubjectFound: dbConfig?.lastSubjectFound || null,
        lastError: dbConfig?.lastError || null,
      };
    });

    const totalRequests = await prisma.guardRequest.count();
    const successfulRequests = await prisma.guardRequest.count({ where: { status: 'SUCCESS' } });

    return NextResponse.json({
      accounts,
      stats: {
        totalRequests,
        successfulRequests,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Konfiqurasiya alına bilmədi' },
      { status: 403 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    const { game, email, appPassword } = body;

    if (!game || !email) {
      return NextResponse.json(
        { error: 'Oyun və Email mütləqdir' },
        { status: 400 }
      );
    }

    const gameKey = game.toUpperCase() as 'GTA5' | 'RDR2';
    const acc = GAME_ACCOUNTS[gameKey];

    if (!acc) {
      return NextResponse.json({ error: 'Yanlış oyun' }, { status: 400 });
    }

    const encryptedPassword = appPassword ? encryptText(appPassword.trim()) : undefined;

    const updated = await prisma.gmailConfig.upsert({
      where: { game: gameKey },
      create: {
        game: gameKey,
        gameName: acc.gameName,
        email: email.trim(),
        encryptedPassword,
        status: appPassword ? 'CONNECTED' : 'NEEDS_CONFIG',
        lastCheckedAt: new Date(),
      },
      update: {
        email: email.trim(),
        ...(encryptedPassword ? { encryptedPassword } : {}),
        status: appPassword ? 'CONNECTED' : 'NEEDS_CONFIG',
        lastCheckedAt: new Date(),
        lastError: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${acc.gameName} üçün Gmail məlumatları uğurla yadda saxlanıldı.`,
      config: updated,
    });
  } catch (error: any) {
    console.error('ADMIN POST GMAIL-CONFIG ERROR:', error);
    const isAuth = error?.message?.includes('İcazə') || error?.message?.includes('qadağandır') || error?.message?.includes('Unauthorized');
    return NextResponse.json(
      { error: error.message || 'Xəta baş verdi' },
      { status: isAuth ? 401 : 500 }
    );
  }
}
