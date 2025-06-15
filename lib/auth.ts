import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function createUser(email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const result = await executeQuery(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, name, role]
  ) as any;

  return {
    id: result.insertId,
    email,
    name,
    role,
    created_at: new Date()
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await executeQuery(
    'SELECT * FROM users WHERE email = ?',
    [email]
  ) as any[];

  if (users.length === 0) return null;

  const user = users[0];
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at
  };
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const users = await executeQuery(
    'SELECT * FROM users WHERE email = ?',
    [email]
  ) as any[];

  if (users.length === 0) return null;

  const user = users[0];
  const isValid = await verifyPassword(password, user.password);

  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at
  };
}