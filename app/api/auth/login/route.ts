// app/api/auth/login/route.ts - ACTUALIZADA
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email INCLUYENDO EL ROL
    const users = await executeQuery(
      'SELECT id, name, email, password, role, active FROM users WHERE email = ?',
      [email]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verificar si el usuario está activo
    if (!user.active) {
      return NextResponse.json(
        { success: false, message: 'Usuario desactivado' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Actualizar último login
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Crear token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role // Incluir rol en el token
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role // ¡IMPORTANTE! Incluir el rol en la respuesta
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}