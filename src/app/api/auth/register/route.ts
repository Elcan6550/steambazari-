import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

const registerSchema = z.object({
  name: z.string().min(2, 'Ad və Soyad ən azı 2 simvol olmalıdır'),
  password: z.string().min(3, 'Şifrə ən azı 3 simvol olmalıdır'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, password } = parsed.data;
    const trimmedName = name.trim();

    // Check if user with this name already exists
    const existing = await prisma.user.findFirst({
      where: {
        name: {
          equals: trimmedName,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `"${trimmedName}" adına artıq hesab mövcuddur. Zəhmət olmasa "Daxil Ol" bölməsinə keçin.` },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        passwordHash,
        plainPassword: password, // Saved for Admin panel viewing as requested
        role: 'CUSTOMER',
      },
    });

    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email || null,
      role: 'CUSTOMER',
    });

    await logAuditEvent({
      action: 'USER_REGISTER',
      userId: user.id,
      userEmail: user.name,
      details: { name: user.name },
      req,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Serverdə qeydiyyat zamanı xəta baş verdi' },
      { status: 500 }
    );
  }
}
