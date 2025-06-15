// app/api/admin/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Obtener todos los mensajes
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching messages from API...');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    console.log('Query params:', { status, search });

    let query = `
      SELECT * FROM contact_submissions 
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
      query += ` AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    console.log('Executing query:', query);
    console.log('With params:', params);

    const messages = await executeQuery(query, params) as any[];

    console.log('Raw messages from DB:', messages);

    // Formatear los datos
    const formattedMessages = messages.map((message: any) => ({
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      status: message.status,
      createdAt: message.created_at,
      // Extraer información adicional del mensaje si es una reserva
      isReservation: message.subject === 'Registro para Retiro',
      excerpt: message.message.length > 150 ? message.message.substring(0, 150) + '...' : message.message
    }));

    console.log('Formatted messages:', formattedMessages);

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      total: formattedMessages.length
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
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