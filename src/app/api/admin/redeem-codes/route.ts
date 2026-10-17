import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function cleanInitials(name: string): string {
  if (!name || !name.trim()) return 'SB';

  // Normalize Azerbaijani / Turkish characters
  const normalized = name
    .trim()
    .replace(/ə/gi, 'e')
    .replace(/ı/gi, 'i')
    .replace(/ö/gi, 'o')
    .replace(/ü/gi, 'u')
    .replace(/ğ/gi, 'g')
    .replace(/ç/gi, 'c')
    .replace(/ş/gi, 's')
    .replace(/[^a-zA-Z\s]/g, '')
    .toUpperCase();

  const parts = normalized.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  } else if (parts.length === 1) {
    return (parts[0][0] + 'X').toUpperCase();
  }

  return 'SB';
}

function generateRandomSegment(length: number = 4): string {
  // Characters excluding visually ambiguous 0/O, 1/I
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yalnız admin daxil ola bilər' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const game = searchParams.get('game'); // "GTA5" | "RDR2" | null

    const where: any = {};
    if (game && (game === 'GTA5' || game === 'RDR2')) {
      where.game = game;
    }

    const codes = await prisma.redeemCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const total = await prisma.redeemCode.count();
    const used = await prisma.redeemCode.count({ where: { isUsed: true } });
    const unused = total - used;
    const gta5Count = await prisma.redeemCode.count({ where: { game: 'GTA5' } });
    const rdr2Count = await prisma.redeemCode.count({ where: { game: 'RDR2' } });

    return NextResponse.json({
      codes,
      stats: {
        total,
        used,
        unused,
        gta5Count,
        rdr2Count,
      },
    });
  } catch (error: any) {
    console.error('Error fetching redeem codes:', error);
    return NextResponse.json({ error: error?.message || 'Kodları yükləmək mümkün olmadı' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yalnız admin kod yarada bilər' }, { status: 403 });
    }

    const body = await req.json();
    const game = (body.game || 'GTA5').toUpperCase() as 'GTA5' | 'RDR2';
    const customerName = (body.customerName || '').trim();
    let initials = (body.initials || '').trim().toUpperCase();

    if (!['GTA5', 'RDR2'].includes(game)) {
      return NextResponse.json({ error: 'Oyun GTA5 və ya RDR2 olmalıdır' }, { status: 400 });
    }

    if (!initials) {
      initials = cleanInitials(customerName);
    } else {
      initials = initials.replace(/[^A-Z]/g, '').slice(0, 3) || 'SB';
    }

    // Generate unique code format: EI-GTA5-7K9P or NQ-RDR2-4W8M
    let uniqueCode = '';
    let exists = true;
    let attempts = 0;

    while (exists && attempts < 10) {
      const randomSeg = generateRandomSegment(4);
      uniqueCode = `${initials}-${game}-${randomSeg}`;
      const found = await prisma.redeemCode.findUnique({
        where: { code: uniqueCode },
      });
      if (!found) {
        exists = false;
      }
      attempts++;
    }

    const created = await prisma.redeemCode.create({
      data: {
        code: uniqueCode,
        game,
        customerName: customerName || null,
        initials,
        isUsed: false,
        createdBy: session.name || 'ADMIN',
      },
    });

    return NextResponse.json({
      success: true,
      code: created,
    });
  } catch (error: any) {
    console.error('Error creating redeem code:', error);
    return NextResponse.json({ error: error?.message || 'Kod yaratmaq mümkün olmadı' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yalnız admin silə bilər' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID tələb olunur' }, { status: 400 });
    }

    await prisma.redeemCode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Kod uğurla silindi' });
  } catch (error: any) {
    console.error('Error deleting redeem code:', error);
    return NextResponse.json({ error: error?.message || 'Kodu silmək mümkün olmadı' }, { status: 500 });
  }
}
