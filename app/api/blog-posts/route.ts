// app/api/blog-posts/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { calculateReadTime } from '@/lib/utils';

// GET - Obtener todos los posts
export async function GET(request: Request) {
  try {
    console.log('GET /api/blog-posts - Starting...');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    console.log('Query params:', { category, search, featured });

    let query = `
      SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.content,
        bp.featured_image,
        bp.author_id,
        bp.category_id,
        bp.status,
        bp.featured,
        bp.read_time,
        bp.published_at,
        bp.created_at,
        bp.updated_at,
        COALESCE(a.name, 'Autor Desconocido') as author_name,
        COALESCE(c.name, 'Sin Categoría') as category_name
      FROM blog_posts bp
      LEFT JOIN authors a ON bp.author_id = a.id
      LEFT JOIN categories c ON bp.category_id = c.id
      WHERE bp.status = 'published'
    `;
    
    const params: any[] = [];
    
    if (category && category !== 'Todas') {
      query += ` AND c.name = ?`;
      params.push(category);
    }
    
    if (search) {
      query += ` AND (bp.title LIKE ? OR bp.excerpt LIKE ? OR bp.content LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (featured === 'true') {
      query += ` AND bp.featured = 1`;
    }
    
    query += ` ORDER BY bp.published_at DESC`;
    
    console.log('Executing query:', query);
    console.log('With params:', params);
    
    const posts = await executeQuery(query, params);
    console.log('Query result count:', (posts as any[]).length);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/blog-posts:', error);
    
    // Devolver datos de ejemplo en caso de error
    const samplePosts = [
      {
        id: 999,
        title: "Error de Base de Datos - Post de Ejemplo",
        slug: "error-database-ejemplo",
        excerpt: "Hay un problema con la conexión a la base de datos. Por favor revisa los logs.",
        content: "<p>La base de datos no está funcionando correctamente. Revisa la configuración.</p>",
        featured_image: "/images/retiro-de-transformacion.jpg",
        author_name: "Sistema",
        author_id: 1,
        published_at: new Date().toISOString(),
        category_name: "Sistema",
        category_id: 1,
        read_time: "1 min",
        featured: false,
        status: "published"
      }
    ];
    
    return NextResponse.json(samplePosts);
  }
}

// POST - Crear nuevo post
export async function POST(request: Request) {
  try {
    console.log('POST /api/blog-posts - Starting...');
    
    const data = await request.json();
    console.log('Received data:', data);
    
    // Validación básica
    if (!data.title || !data.content || !data.author_id || !data.category_id) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json({ 
        error: 'Campos requeridos faltantes',
        required: ['title', 'content', 'author_id', 'category_id'],
        received: Object.keys(data)
      }, { status: 400 });
    }

    // Verificar que existen el autor y la categoría
    try {
      const authorCheck = await executeQuery('SELECT id, name FROM authors WHERE id = ?', [data.author_id]);
      const categoryCheck = await executeQuery('SELECT id, name FROM categories WHERE id = ?', [data.category_id]);
      
      console.log('Author check:', authorCheck);
      console.log('Category check:', categoryCheck);
      
      if ((authorCheck as any[]).length === 0) {
        return NextResponse.json({ 
          error: `El autor con ID ${data.author_id} no existe`
        }, { status: 400 });
      }
      
      if ((categoryCheck as any[]).length === 0) {
        return NextResponse.json({ 
          error: `La categoría con ID ${data.category_id} no existe`
        }, { status: 400 });
      }
    } catch (checkError) {
      console.error('Error checking author/category:', checkError);
      return NextResponse.json({ 
        error: 'Error verificando autor y categoría',
        details: checkError
      }, { status: 500 });
    }

    // Generar slug único
    const baseSlug = data.title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;
    
    // Verificar que el slug sea único
    while (true) {
      const existing = await executeQuery('SELECT id FROM blog_posts WHERE slug = ?', [slug]);
      if ((existing as any[]).length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    console.log('Generated slug:', slug);

    const query = `
      INSERT INTO blog_posts (
        title, slug, excerpt, content, featured_image, 
        author_id, category_id, status, featured, read_time, published_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.title,
      slug,
      data.excerpt || '',
      data.content,
      data.featured_image || '/images/retiro-de-transformacion.jpg',
      parseInt(data.author_id),
      parseInt(data.category_id),
      data.status || 'draft',
      data.featured ? 1 : 0,
      data.read_time || calculateReadTime(data.content),
      data.status === 'published' ? new Date() : null
    ];

    console.log('Executing INSERT query:', query);
    console.log('With params:', params);

    const result = await executeQuery(query, params);
    console.log('INSERT result:', result);
    
    return NextResponse.json({ 
      message: 'Post creado exitosamente', 
      id: (result as any).insertId,
      slug: slug
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/blog-posts:', error);
    
    // Respuesta más detallada del error
    return NextResponse.json({ 
      error: 'Error creando post',
      details: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any).code || 'UNKNOWN'
    }, { status: 500 });
  }
}