// app/api/blog-posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { calculateReadTime } from '@/lib/utils';

// GET - Obtener post específico
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    const query = `
      SELECT bp.*, a.name as author_name, c.name as category_name 
      FROM blog_posts bp
      LEFT JOIN authors a ON bp.author_id = a.id
      LEFT JOIN categories c ON bp.category_id = c.id
      WHERE bp.id = ? OR bp.slug = ?
    `;

    const posts = await executeQuery(query, [id, id]) as any[];
    const post = posts[0];

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Error obteniendo post' }, { status: 500 });
  }
}

// PUT - Actualizar post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    const data = await request.json();

    // Generar nuevo slug si el título cambió
    const slug = data.title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    const query = `
      UPDATE blog_posts SET
      title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?,
      author_id = ?, category_id = ?, status = ?, featured = ?, read_time = ?,
      published_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const queryParams = [
      data.title,
      slug,
      data.excerpt || '',
      data.content,
      data.featured_image || null,
      data.author_id,
      data.category_id,
      data.status || 'draft',
      data.featured ? 1 : 0,
      data.read_time || calculateReadTime(data.content),
      data.status === 'published' && !data.published_at ? new Date() : data.published_at,
      id
    ];

    await executeQuery(query, queryParams);

    return NextResponse.json({ message: 'Post actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Error actualizando post' }, { status: 500 });
  }
}

// DELETE - Eliminar post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    const query = 'DELETE FROM blog_posts WHERE id = ?';
    await executeQuery(query, [id]);

    return NextResponse.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Error eliminando post' }, { status: 500 });
  }
}