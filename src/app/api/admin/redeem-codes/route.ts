import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const CYRILLIC_MAP: Record<string, string> = {
  'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E','Ж':'ZH','З':'Z',
  'И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R',
  'С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'TS','Ч':'CH','Ш':'SH','Щ':'SH',
  'Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'YU','Я':'YA',
  'а':'A','б':'B','в':'V','г':'G','д':'D','е':'E','ё':'E','ж':'ZH','з':'Z',
  'и':'I','й':'Y','к':'K','л':'L','м':'M','н':'N','о':'O','п':'P','р':'R',
  'с':'S','т':'T','у':'U','ф':'F','х':'H','ц':'TS','ч':'CH','ш':'SH','щ':'SH',
  'ъ':'','ы':'Y','ь':'','э':'E','ю':'YU','я':'YA'
};

function transliterateCyrillic(text: string): string {
  let res = text;
  for (const [cyr, lat] of Object.entries(CYRILLIC_MAP)) {
    if (res.includes(cyr)) {
      res = res.split(cyr).join(lat);
    }
  }
  return res;
}

function cleanInitials(name: string): string {
  if (!name || !name.trim()) return 'SB';

  let str = transliterateCyrillic(name.trim());

  // Normalize casing for Latin and Azerbaijani characters
  str = str
    .replace(/[əƏ]/g, 'Ə')
    .replace(/[ıI]/g, 'I')
    .replace(/[iİ]/g, 'İ')
    .replace(/[öÖ]/g, 'Ö')
    .replace(/[üÜ]/g, 'Ü')
    .replace(/[çÇ]/g, 'Ç')
    .replace(/[şŞ]/g, 'Ş')
    .replace(/[ğĞ]/g, 'Ğ');

  // Keep Latin letters (standard + Azerbaijani Latin) and spaces
  const cleaned = str.replace(/[^A-Za-zƏİIÖÜÇŞĞ\s]/g, '').toUpperCase();
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  } else if (parts.length === 1) {
    return (parts[0][0] + 'X').toUpperCase();
  }

  return 'SB';
}

function cleanExplicitInitials(input: string): string {
  if (!input || !input.trim()) return '';

  let str = transliterateCyrillic(input.trim());

  // Support all Latin characters (standard A-Z and Azerbaijani Latin: Ə, İ, I, Ö, Ü, Ç, Ş, Ğ, 0-9)
  return str
    .replace(/[əƏ]/g, 'Ə')
    .replace(/[ıI]/g, 'I')
    .replace(/[iİ]/g, 'İ')
    .replace(/[öÖ]/g, 'Ö')
    .replace(/[üÜ]/g, 'Ü')
    .replace(/[çÇ]/g, 'Ç')
    .replace(/[şŞ]/g, 'Ş')
    .replace(/[ğĞ]/g, 'Ğ')
    .replace(/[^A-Za-z0-9ƏİIÖÜÇŞĞ]/g, '')
    .toUpperCase()
    .slice(0, 6);
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
      initials = cleanExplicitInitials(initials) || cleanInitials(customerName);
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
