import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const level = searchParams.get('level');
    const limit = searchParams.get('limit');

    let query = 'SELECT * FROM programs WHERE active = true';
    const params: any[] = [];

    if (featured === 'true') {
      query += ' AND featured = true';
    }

    if (level) {
      query += ' AND level = ?';
      params.push(level);
    }

    query += ' ORDER BY featured DESC, created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const programs = await executeQuery(query, params);

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Programs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      content,
      image_url,
      price,
      duration,
      level,
      featured
    } = await request.json();

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const result = await executeQuery(
      `INSERT INTO programs (title, description, content, image_url, price, duration, level, featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, content, image_url, price, duration, level, featured || false]
    ) as any;

    return NextResponse.json({ id: result.insertId, success: true });
  } catch (error) {
    console.error('Create program error:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}