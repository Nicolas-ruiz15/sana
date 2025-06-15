// lib/adminPermissions.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/lib/db';

export async function verifyAdminRole(request: NextRequest): Promise<{ isAdmin: boolean; user: any | null }> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                 request.cookies.get('admin-token')?.value;

    if (!token) {
      return { isAdmin: false, user: null };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Verificar que el usuario sigue siendo admin y está activo
    const users = await executeQuery(
      'SELECT id, name, email, role, active FROM users WHERE id = ? AND role = "admin" AND active = 1',
      [decoded.userId]
    ) as any[];

    if (users.length === 0) {
      return { isAdmin: false, user: null };
    }

    return { isAdmin: true, user: users[0] };
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return { isAdmin: false, user: null };
  }
}

export function adminOnlyResponse() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Acceso denegado. Solo los administradores pueden realizar esta acción.',
      error: 'ADMIN_ONLY'
    },
    { status: 403 }
  );
}