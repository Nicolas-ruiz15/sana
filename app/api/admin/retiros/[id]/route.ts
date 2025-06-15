// app/api/admin/retiros/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Obtener retiro específico
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const retiroId = params.id;

    const query = `SELECT * FROM retiros WHERE id = ?`;
    const retiros = await executeQuery(query, [retiroId]) as any[];

    if (retiros.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Retiro no encontrado'
        },
        { status: 404 }
      );
    }

    const retiro = retiros[0];
    const formattedRetiro = {
      id: retiro.id,
      title: retiro.title,
      description: retiro.description,
      fullDescription: retiro.full_description,
      location: retiro.location,
      date: retiro.date,
      price: parseFloat(retiro.price),
      duration: retiro.duration,
      category: retiro.category,
      featured: Boolean(retiro.featured),
      imageUrl: retiro.image_url,
      maxParticipants: retiro.max_participants,
      currentParticipants: retiro.current_participants || 0,
      status: retiro.status,
      benefits: retiro.benefits ? JSON.parse(retiro.benefits) : null,
      schedule: retiro.schedule ? JSON.parse(retiro.schedule) : null,
      includes: retiro.includes ? JSON.parse(retiro.includes) : null,
      notIncludes: retiro.not_includes ? JSON.parse(retiro.not_includes) : null,
      createdAt: retiro.created_at,
      updatedAt: retiro.updated_at
    };

    return NextResponse.json({
      success: true,
      retiro: formattedRetiro
    });

  } catch (error) {
    console.error('Error fetching retiro:', error);
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

// PUT - Actualizar retiro
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const retiroId = params.id;
    const data = await request.json();

    const {
      title,
      description,
      fullDescription,
      location,
      date,
      price,
      duration,
      category,
      featured,
      imageUrl,
      maxParticipants,
      status,
      benefits,
      schedule,
      includes,
      notIncludes
    } = data;

    // Validación básica
    if (!title || !description || !location || !date || !price) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Faltan campos requeridos'
        },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE retiros SET
        title = ?, description = ?, full_description = ?, location = ?, 
        date = ?, price = ?, duration = ?, category = ?, featured = ?, 
        image_url = ?, max_participants = ?, status = ?, benefits = ?, 
        schedule = ?, includes = ?, not_includes = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [
      title,
      description,
      fullDescription || '',
      location,
      date,
      price,
      duration || '',
      category || 'transformacion',
      featured || false,
      imageUrl || '',
      maxParticipants || 20,
      status || 'draft',
      benefits ? JSON.stringify(benefits) : null,
      schedule ? JSON.stringify(schedule) : null,
      includes ? JSON.stringify(includes) : null,
      notIncludes ? JSON.stringify(notIncludes) : null,
      retiroId
    ]);

    return NextResponse.json({
      success: true,
      message: 'Retiro actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error updating retiro:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al actualizar retiro',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar retiro
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const retiroId = params.id;

    // Verificar si el retiro existe
    const existingRetiro = await executeQuery(
      'SELECT id FROM retiros WHERE id = ?',
      [retiroId]
    ) as any[];

    if (existingRetiro.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Retiro no encontrado'
        },
        { status: 404 }
      );
    }

    // Eliminar retiro
    await executeQuery('DELETE FROM retiros WHERE id = ?', [retiroId]);

    return NextResponse.json({
      success: true,
      message: 'Retiro eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting retiro:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al eliminar retiro',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}