// app/api/authors/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Obtener todos los autores
export async function GET() {
  try {
    const query = 'SELECT id, name, email, bio, avatar FROM authors ORDER BY name';
    const authors = await executeQuery(query);
    
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    
    // Devolver datos por defecto si hay error de conexión
    const defaultAuthors = [
      { id: 1, name: 'Dra. Susana Gomez' },
      { id: 2, name: 'Cesar Angel' },
      { id: 3, name: 'Andrew Guerra' }
    ];
    
    return NextResponse.json(defaultAuthors);
  }
}

// POST - Crear nuevo autor
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const query = `
      INSERT INTO authors (name, email, bio, avatar)
      VALUES (?, ?, ?, ?)
    `;

    const params = [
      data.name,
      data.email || null,
      data.bio || null,
      data.avatar || null
    ];

    const result = await executeQuery(query, params);
    
    return NextResponse.json({ 
      message: 'Autor creado exitosamente', 
      id: (result as any).insertId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json({ error: 'Error creando autor' }, { status: 500 });
  }
}