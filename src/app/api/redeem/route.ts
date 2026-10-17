import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ unlockedGames: [] });
    }

    if (session.role === 'ADMIN') {
      return NextResponse.json({ unlockedGames: ['GTA5', 'RDR2'], isAdmin: true });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { unlockedGames: true },
    });

    return NextResponse.json({
      unlockedGames: user?.unlockedGames || [],
    });
  } catch (error: any) {
    console.error('Error fetching unlocked games:', error);
    return NextResponse.json({ unlockedGames: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { error: 'Redeem kodunu daxil etmək üçün əvvəlcə hesabınıza daxil olmalısınız' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawCode = (body.code || '').trim().toUpperCase();

    if (!rawCode || rawCode.length < 5) {
      return NextResponse.json(
        { error: 'Zəhmət olmasa düzgün Redeem kodu daxil edin (Məs: EI-GTA5-XXXX)' },
        { status: 400 }
      );
    }

    // Find the redeem code in database
    const redeemRecord = await prisma.redeemCode.findUnique({
      where: { code: rawCode },
    });

    if (!redeemRecord) {
      return NextResponse.json(
        { error: 'Daxil edilən Redeem kod tapılmadı. Zəhmət olmasa kodu düzgün yazdığınızdan əmin olun.' },
        { status: 404 }
      );
    }

    if (redeemRecord.isUsed) {
      return NextResponse.json(
        {
          error: `Bu Redeem kod artıq istifadə olunub (${redeemRecord.usedByName || 'başqa istifadəçi'} tərəfindən).`,
        },
        { status: 400 }
      );
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, unlockedGames: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 });
    }

    const gameName = redeemRecord.game === 'GTA5' ? 'Grand Theft Auto V' : 'Red Dead Redemption 2';

    if (user.unlockedGames.includes(redeemRecord.game)) {
      return NextResponse.json(
        { error: `Sizin hesabınızda ${gameName} artıq aktivdir! Kodu başqa oyun üçün yoxlayın.` },
        { status: 400 }
      );
    }

    // Atomically mark code as used and update user unlockedGames
    const updatedUnlockedGames = [...user.unlockedGames, redeemRecord.game];

    await prisma.$transaction([
      prisma.redeemCode.update({
        where: { id: redeemRecord.id },
        data: {
          isUsed: true,
          usedByUserId: user.id,
          usedByName: user.name,
          usedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          unlockedGames: updatedUnlockedGames,
        },
      }),
    ]);

    await logAuditEvent({
      action: 'REDEEM_CODE_SUCCESS',
      userId: user.id,
      userEmail: user.name,
      game: redeemRecord.game,
      details: {
        code: redeemRecord.code,
        game: redeemRecord.game,
      },
      req,
    });

    return NextResponse.json({
      success: true,
      game: redeemRecord.game,
      unlockedGames: updatedUnlockedGames,
      message: `Təbriklər! ${gameName} oyunu uğurla aktivləşdirildi! İndi təsdiq kodunuzu ala bilərsiniz.`,
    });
  } catch (error: any) {
    console.error('Redeem error:', error);
    return NextResponse.json(
      { error: error?.message || 'Kodun yoxlanılması zamanı xəta baş verdi' },
      { status: 500 }
    );
  }
}
