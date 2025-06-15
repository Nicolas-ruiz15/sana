// app/api/admin/messages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Obtener mensaje individual
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const messageId = parseInt(params.id);

    if (isNaN(messageId)) {
      return NextResponse.json(
        { success: false, message: 'ID de mensaje inválido' },
        { status: 400 }
      );
    }

    const query = `SELECT * FROM contact_submissions WHERE id = ?`;
    const messages = await executeQuery(query, [messageId]) as any[];

    if (messages.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Mensaje no encontrado' },
        { status: 404 }
      );
    }

    const message = messages[0];

    // Formatear la respuesta
    const formattedMessage = {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      status: message.status,
      createdAt: message.created_at,
      isReservation: message.subject === 'Registro para Retiro'
    };

    return NextResponse.json({
      success: true,
      message: formattedMessage
    });

  } catch (error) {
    console.error('Error fetching message:', error);
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

// PATCH - Actualizar estado del mensaje
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { status } = await request.json();
    const messageId = parseInt(params.id);

    if (isNaN(messageId)) {
      return NextResponse.json(
        { success: false, message: 'ID de mensaje inválido' },
        { status: 400 }
      );
    }

    // Validar estado
    const validStatuses = ['new', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Estado inválido' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE contact_submissions 
      SET status = ? 
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, [status, messageId]);

    // Obtener el mensaje actualizado
    const selectQuery = `SELECT * FROM contact_submissions WHERE id = ?`;
    const updatedMessages = await executeQuery(selectQuery, [messageId]) as any[];
    
    if (updatedMessages.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Mensaje no encontrado' },
        { status: 404 }
      );
    }

    const message = updatedMessages[0];

    const formattedMessage = {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      status: message.status,
      createdAt: message.created_at,
      isReservation: message.subject === 'Registro para Retiro'
    };

    return NextResponse.json({
      success: true,
      message: formattedMessage
    });

  } catch (error) {
    console.error('Error updating message:', error);
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

// DELETE - Eliminar mensaje
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const messageId = parseInt(params.id);

    if (isNaN(messageId)) {
      return NextResponse.json(
        { success: false, message: 'ID de mensaje inválido' },
        { status: 400 }
      );
    }

    const deleteQuery = `DELETE FROM contact_submissions WHERE id = ?`;
    await executeQuery(deleteQuery, [messageId]);

    return NextResponse.json({
      success: true,
      message: 'Mensaje eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
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