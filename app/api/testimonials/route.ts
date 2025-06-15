import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let query = 'SELECT * FROM testimonials WHERE active = true';
    const params: any[] = [];

    if (featured === 'true') {
      query += ' AND featured = true';
    }

    query += ' ORDER BY featured DESC, created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const testimonials = await executeQuery(query, params);

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Testimonials API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, role, content, image_url, rating, featured } = await request.json();

    // Validate required fields
    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    const result = await executeQuery(
      `INSERT INTO testimonials (name, role, content, image_url, rating, featured) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, role, content, image_url, rating || 5, featured || false]
    ) as any;

    return NextResponse.json({ id: result.insertId, success: true });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}