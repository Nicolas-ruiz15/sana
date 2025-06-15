// app/api/admin/retiros/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Obtener todos los retiros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = `
      SELECT * FROM retiros 
      WHERE 1=1
    `;
    const params: any[] = [];

    // Filtrar por estado
    if (status && status !== 'all') {
      query += ` AND status = ?`;
      params.push(status);
    }

    // Filtrar por búsqueda
    if (search) {
      query += ` AND (title LIKE ? OR description LIKE ? OR location LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    const retiros = await executeQuery(query, params) as any[];

    // Formatear los datos
    const formattedRetiros = retiros.map((retiro: any) => ({
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
    }));

    return NextResponse.json({
      success: true,
      retiros: formattedRetiros,
      total: formattedRetiros.length
    });

  } catch (error) {
    console.error('Error fetching retiros:', error);
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

// POST - Crear nuevo retiro
export async function POST(request: NextRequest) {
  try {
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

    const insertQuery = `
      INSERT INTO retiros (
        title, description, full_description, location, date, price, 
        duration, category, featured, image_url, max_participants, 
        status, benefits, schedule, includes, not_includes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await executeQuery(insertQuery, [
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
      notIncludes ? JSON.stringify(notIncludes) : null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Retiro creado exitosamente',
      id: (result as any).insertId
    });

  } catch (error) {
    console.error('Error creating retiro:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al crear retiro',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}