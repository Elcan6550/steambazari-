import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

const loginSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(1, 'Şifrəni daxil edin'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, username, password } = parsed.data;
    const identifier = (name || email || username || '').trim();

    if (!identifier) {
      return NextResponse.json(
        { error: 'Ad və Soyadınızı daxil edin' },
        { status: 400 }
      );
    }

    // Find user by name OR email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { name: { equals: identifier } },
          { email: { equals: identifier.toLowerCase() } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Ad və ya şifrə yanlışdır' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash) || (user.plainPassword === password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Ad və ya şifrə yanlışdır' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email || null,
      role: user.role as 'CUSTOMER' | 'ADMIN',
    });

    await logAuditEvent({
      action: user.role === 'ADMIN' ? 'ADMIN_LOGIN' : 'USER_LOGIN',
      userId: user.id,
      userEmail: user.name,
      details: { role: user.role },
      req,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş zamanı server xətası baş verdi: ' + (error?.message || String(error)) },
      { status: 500 }
    );
  }
}
