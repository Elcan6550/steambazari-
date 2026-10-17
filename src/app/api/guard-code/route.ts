import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { getLatestGuardCode, GAME_ACCOUNTS } from '@/lib/gmail-imap';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { error: 'Təsdiq kodu almaq üçün daxil olmalı və ya qeydiyyatdan keçməlisiniz' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const game = (body.game || 'GTA5').toUpperCase() as 'GTA5' | 'RDR2';

    if (!GAME_ACCOUNTS[game]) {
      return NextResponse.json(
        { error: 'Düzgün oyun seçilməyib (GTA5 və ya RDR2)' },
        { status: 400 }
      );
    }

    // Check if customer has unlocked this game (Admin has automatic access)
    if (session.role !== 'ADMIN') {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.id },
        select: { unlockedGames: true },
      });
      const unlocked = dbUser?.unlockedGames || [];
      if (!unlocked.includes(game)) {
        return NextResponse.json(
          {
            error: `${
              game === 'GTA5' ? 'Grand Theft Auto V' : 'Red Dead Redemption 2'
            } oyunu hesabınızda aktiv deyil. Zəhmət olmasa Redeem kodunu daxil edərək oyunu aktivləşdirin.`,
            requiresRedeem: true,
            game,
          },
          { status: 403 }
        );
      }
    }

    const account = GAME_ACCOUNTS[game];
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // Fetch the code from Gmail
    const result = await getLatestGuardCode(game);

    if (result.success && result.code) {
      // Save request record in database
      const savedRequest = await prisma.guardRequest.create({
        data: {
          userId: session.id,
          game,
          targetEmail: account.email,
          code: result.code,
          subject: result.subject || 'Rockstar / Steam Guard Kodu',
          sender: result.sender || 'Rockstar Support',
          status: 'SUCCESS',
          ipAddress,
        },
      });

      return NextResponse.json({
        success: true,
        code: result.code,
        game: account.gameName,
        targetEmail: account.email,
        subject: result.subject,
        sender: result.sender,
        receivedAt: result.receivedAt || new Date(),
        source: result.source,
        needsAppPassword: result.needsAppPassword,
        warning: result.error,
        requestId: savedRequest.id,
      });
    }

    // Record failed attempt
    await prisma.guardRequest.create({
      data: {
        userId: session.id,
        game,
        targetEmail: account.email,
        status: 'FAILED',
        errorMessage: result.error || 'Kod tapılmadı',
        ipAddress,
      },
    });

    return NextResponse.json(
      {
        success: false,
        error: result.error || 'Təsdiq kodu tapılmadı. Zəhmət olmasa 1 dəqiqə sonra yenidən yoxlayın.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Guard code fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Kod alınarkən server xətası baş verdi' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ requests: [] });
    }

    const { searchParams } = new URL(req.url);
    const game = searchParams.get('game');

    const where: any = { userId: session.id };
    if (game && game !== 'ALL') {
      where.game = game.toUpperCase();
    }

    const requests = await prisma.guardRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ requests: [] });
  }
}
