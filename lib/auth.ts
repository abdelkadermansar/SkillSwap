// lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from './mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'monSecretSuperLong';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getCurrentUserFromToken(token: string) {
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  await connectToDatabase();
  const user = await User.findById(decoded.userId).select('-password');
  
  return user;
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
}

export function removeAuthCookie(response: NextResponse) {
  response.cookies.set('token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/'
  });
}