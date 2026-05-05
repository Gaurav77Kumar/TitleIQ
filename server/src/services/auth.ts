import jwt from 'jsonwebtoken';
import { sql } from '../db/index.js';
import type { User } from '@titleiq/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function generateOtpCode(): string {
  // Generate a random 6-digit string
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveOtp(email: string, code: string) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
  await sql`
    INSERT INTO otps (email, code, expires_at)
    VALUES (${email}, ${code}, ${expiresAt})
  `;
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  // Find the latest valid OTP for this email
  const [otp] = await sql`
    SELECT * FROM otps
    WHERE email = ${email} AND code = ${code} AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (otp) {
    // Clean up OTPs for this user immediately upon successful verification
    await sql`DELETE FROM otps WHERE email = ${email}`;
    return true;
  }
  
  return false;
}

export async function getOrCreateUser(email: string): Promise<{ user: User, isNewUser: boolean }> {
  const [existing] = await sql`SELECT * FROM users WHERE email = ${email}`;
  
  if (existing) {
    return {
      user: {
        id: existing.id as string,
        email: existing.email as string,
        tier: existing.tier as any,
        createdAt: (existing.created_at as Date).toISOString(),
      },
      isNewUser: false
    };
  }

  const [newUser] = await sql`
    INSERT INTO users (email)
    VALUES (${email})
    RETURNING *
  `;
  
  return {
    user: {
      id: newUser.id as string,
      email: newUser.email as string,
      tier: newUser.tier as any,
      createdAt: (newUser.created_at as Date).toISOString(),
    },
    isNewUser: true
  };
}

export function signToken(user: User): string {
  // Sign a JWT with user ID as sub and 7 day expiration
  return jwt.sign(
    { sub: user.id, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { sub: string, email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string, email: string };
  } catch {
    return null;
  }
}
