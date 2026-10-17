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

    // Check if user with this name already exists (case-insensitive)
    const existing = await prisma.user.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      // Protect administrator account from being overwritten
      if (existing.role === 'ADMIN') {
        return NextResponse.json(
          { error: 'Bu ad inzibatçı hesabına aiddir. Zəhmət olmasa başqa ad daxil edin.' },
          { status: 403 }
        );
      }

      // Customer account exists: seamlessly update password and log in immediately
      const passwordHash = await hashPassword(password);
      const updatedUser = await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          plainPassword: password, // Updated for Admin panel viewing
        },
      });

      const token = signToken({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email || null,
        role: 'CUSTOMER',
      });

      await logAuditEvent({
        action: 'USER_REGISTER_OR_LOGIN',
        userId: updatedUser.id,
        userEmail: updatedUser.name,
        details: { name: updatedUser.name, note: 'Seamless auto-login / credential update' },
        req,
      });

      const response = NextResponse.json({
        success: true,
        message: 'Hesabınıza uğurla daxil olundu',
        token,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          role: updatedUser.role,
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
    }

    // Completely new customer: create account and log in
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        passwordHash,
        plainPassword: password, // Saved for Admin panel viewing
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
      message: 'Hesabınız uğurla yaradıldı',
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
    console.error('Register error details:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Serverdə qeydiyyat zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
      },
      { status: 500 }
    );
  }
}
