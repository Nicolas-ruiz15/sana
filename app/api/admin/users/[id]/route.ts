// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET - Obtener usuario específico
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.id;

    const query = `
      SELECT id, name, email, role, active, created_at, updated_at, last_login
      FROM users 
      WHERE id = ?
    `;

    const users = await executeQuery(query, [userId]) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Usuario no encontrado'
        },
        { status: 404 }
      );
    }

    const user = users[0];
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      active: user.active !== undefined ? Boolean(user.active) : true,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_login || null
    };

    return NextResponse.json({
      success: true,
      user: formattedUser
    });

  } catch (error) {
    console.error('Error fetching user:', error);
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

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.id;
    const { name, email, password, role, active } = await request.json();

    // Validación
    if (!name || !email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Nombre y email son requeridos'
        },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    ) as any[];

    if (existingUser.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Usuario no encontrado'
        },
        { status: 404 }
      );
    }

    // Verificar si el email ya está en uso por otro usuario
    const emailCheck = await executeQuery(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    ) as any[];

    if (emailCheck.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'El email ya está registrado por otro usuario'
        },
        { status: 400 }
      );
    }

    // Preparar la consulta de actualización
    let updateQuery = `
      UPDATE users 
      SET name = ?, email = ?, role = ?, active = ?, updated_at = NOW()
    `;
    let queryParams = [name, email, role, active];

    // Si se proporciona nueva contraseña, incluirla
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += `, password = ?`;
      queryParams.push(hashedPassword);
    }

    updateQuery += ` WHERE id = ?`;
    queryParams.push(userId);

    await executeQuery(updateQuery, queryParams);

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al actualizar usuario',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.id;

    // Verificar si el usuario existe
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    ) as any[];

    if (existingUser.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Usuario no encontrado'
        },
        { status: 404 }
      );
    }

    // Verificar que no sea el último usuario admin
    const adminCount = await executeQuery(
      'SELECT COUNT(*) as count FROM users WHERE role = "admin" AND active = 1'
    ) as any[];

    const currentUser = await executeQuery(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    ) as any[];

    if (currentUser[0]?.role === 'admin' && adminCount[0]?.count <= 1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No se puede eliminar el último usuario administrador'
        },
        { status: 400 }
      );
    }

    // Eliminar usuario
    await executeQuery('DELETE FROM users WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al eliminar usuario',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}