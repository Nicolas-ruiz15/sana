// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Obtener todas las categorías
export async function GET() {
  try {
    const query = 'SELECT id, name, description, color FROM categories ORDER BY name';
    const categories = await executeQuery(query);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Devolver datos por defecto si hay error de conexión
    const defaultCategories = [
      { id: 1, name: 'Neuroplasticidad' },
      { id: 2, name: 'Sanación Emocional' },
      { id: 3, name: 'Movimiento Consciente' },
      { id: 4, name: 'Espiritualidad' },
      { id: 5, name: 'Liberación Familiar' },
      { id: 6, name: 'Autoconocimiento' }
    ];
    
    return NextResponse.json(defaultCategories);
  }
}

// POST - Crear nueva categoría
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const query = `
      INSERT INTO categories (name, description, color)
      VALUES (?, ?, ?)
    `;

    const params = [
      data.name,
      data.description || null,
      data.color || '#3B82F6'
    ];

    const result = await executeQuery(query, params);
    
    return NextResponse.json({ 
      message: 'Categoría creada exitosamente', 
      id: (result as any).insertId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Error creando categoría' }, { status: 500 });
  }
}