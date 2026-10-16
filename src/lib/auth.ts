import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './db';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'steambazari-secure-jwt-secret-2026';
const COOKIE_NAME = 'sb_auth_token';

export interface UserSession {
  id: string;
  name: string;
  email?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: UserSession): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email || null,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): UserSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getSessionFromRequest(req: NextRequest): Promise<UserSession | null> {
  // Check cookie first
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie) {
    const session = verifyToken(cookie);
    if (session) return session;
  }

  // Check authorization header (Bearer token)
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
  }

  return null;
}

export async function requireAuth(req: NextRequest): Promise<UserSession> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    throw new Error('İcazə verilmədi: Giriş tələb olunur (Unauthorized)');
  }
  return session;
}

export async function requireAdmin(req: NextRequest): Promise<UserSession> {
  const session = await requireAuth(req);
  if (session.role !== 'ADMIN') {
    throw new Error('Giriş qadağandır: Yalnız inzibatçı hüququ tələb olunur (Forbidden)');
  }
  return session;
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
