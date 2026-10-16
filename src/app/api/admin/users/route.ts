import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        plainPassword: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            requests: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    const isAuth = error?.message?.includes('İcazə') || error?.message?.includes('qadağandır');
    return NextResponse.json(
      { error: error.message || 'Müştəriləri yükləmək mümkün olmadı' },
      { status: isAuth ? 401 : 500 }
    );
  }
}
