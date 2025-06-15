// app/api/admin/users/route.ts - VERSIÓN PROTEGIDA
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAdminRole, adminOnlyResponse } from '@/lib/adminPermissions';
import bcrypt from 'bcryptjs';

// GET - Obtener todos los usuarios (Solo admins)
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de admin
    const { isAdmin } = await verifyAdminRole(request);
    if (!isAdmin) {
      return adminOnlyResponse();
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let query = `
      SELECT id, name, email, role, active, created_at, updated_at, last_login
      FROM users 
      WHERE 1=1
    `;
    const params: any[] = [];

    // Filtrar por rol
    if (role && role !== 'all') {
      query += ` AND role = ?`;
      params.push(role);
    }

    // Filtrar por búsqueda
    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    const users = await executeQuery(query, params) as any[];

    // Formatear los datos
    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      active: user.active !== undefined ? Boolean(user.active) : true,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_login || null
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      total: formattedUsers.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario (Solo admins)
export async function POST(request: NextRequest) {
  try {
    // Verificar permisos de admin
    const { isAdmin } = await verifyAdminRole(request);
    if (!isAdmin) {
      return adminOnlyResponse();
    }

    const { name, email, password, role, active } = await request.json();

    // Validación
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Nombre, email y contraseña son requeridos'
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any[];

    if (existingUser.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'El email ya está registrado'
        },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const insertQuery = `
      INSERT INTO users (name, email, password, role, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await executeQuery(insertQuery, [
      name,
      email,
      hashedPassword,
      role || 'user',
      active !== undefined ? active : true
    ]);

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: (result as any).insertId,
        name,
        email,
        role: role || 'user',
        active: active !== undefined ? active : true
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al crear usuario',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}