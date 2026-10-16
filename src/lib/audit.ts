import { prisma } from './db';
import { NextRequest } from 'next/server';

interface LogAuditParams {
  action: string;
  userId?: string;
  userEmail?: string;
  game?: string;
  details?: Record<string, any>;
  req?: NextRequest;
}

export async function logAuditEvent({
  action,
  userId,
  userEmail,
  game,
  details = {},
  req,
}: LogAuditParams) {
  try {
    let ipAddress = '127.0.0.1';

    if (req) {
      ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    }

    const sanitizedDetails = { ...details };
    if (sanitizedDetails.password) sanitizedDetails.password = '[REDACTED]';
    if (sanitizedDetails.token) sanitizedDetails.token = '[REDACTED]';

    return await prisma.auditLog.create({
      data: {
        action,
        userId,
        userEmail,
        game,
        ipAddress,
        details: JSON.stringify(sanitizedDetails),
      },
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}
