import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const game = searchParams.get('game');

    const where: any = {};
    if (game && game !== 'ALL') where.game = game.toUpperCase();

    const requests = await prisma.guardRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Sorğular alına bilmədi' },
      { status: 403 }
    );
  }
}
