// app/api/auth/verify/route.ts - ACTUALIZADA
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Buscar el usuario en la base de datos con TODOS los datos incluyendo el rol
    const users = await executeQuery(
      'SELECT id, name, email, role, active FROM users WHERE id = ? AND active = 1',
      [decoded.userId]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado o inactivo' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Actualizar último login
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role // ¡IMPORTANTE! Incluir el rol
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Token inválido' },
      { status: 401 }
    );
  }
}

// También mantener la funcionalidad de logout
export async function DELETE() {
  return NextResponse.json({ success: true, message: 'Logout successful' });
}