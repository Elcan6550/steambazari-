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

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Müştəri ID-si tələb olunur' }, { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'Müştəri tapılmadı' }, { status: 404 });
    }

    if (userToDelete.role === 'ADMIN') {
      return NextResponse.json({ error: 'İnzibatçı hesabı silinə bilməz' }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Müştəri uğurla silindi' });
  } catch (error: any) {
    const isAuth = error?.message?.includes('İcazə') || error?.message?.includes('qadağandır');
    return NextResponse.json(
      { error: error.message || 'Müştərini silmək mümkün olmadı' },
      { status: isAuth ? 401 : 500 }
    );
  }
}
