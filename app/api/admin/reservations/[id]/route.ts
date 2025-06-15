// app/api/admin/reservations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// PATCH - Actualizar estado de reserva
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { status } = await request.json();
    const reservationId = parseInt(params.id);

    // Validar que el ID sea válido
    if (isNaN(reservationId)) {
      return NextResponse.json(
        { success: false, message: 'ID de reserva inválido' },
        { status: 400 }
      );
    }

    // Validar que el status sea válido
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Actualizar la reserva
    const updateQuery = `
      UPDATE reservations 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, [status, reservationId]);

    // Obtener la reserva actualizada
    const selectQuery = `SELECT * FROM reservations WHERE id = ?`;
    const updatedReservations = await executeQuery(selectQuery, [reservationId]) as any[];
    
    if (updatedReservations.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    const reservation = updatedReservations[0];

    // Formatear la respuesta
    const formattedReservation = {
      id: reservation.id,
      reservationNumber: reservation.reservation_number,
      eventId: reservation.event_id,
      eventTitle: reservation.event_title,
      firstName: reservation.first_name,
      lastName: reservation.last_name,
      email: reservation.email,
      phone: reservation.phone,
      birthDate: reservation.birth_date,
      nationality: reservation.nationality,
      emergencyContact: reservation.emergency_contact,
      emergencyPhone: reservation.emergency_phone,
      roomType: reservation.room_type,
      dietaryRestrictions: reservation.dietary_restrictions || '',
      medicalConditions: reservation.medical_conditions || '',
      experience: reservation.experience || '',
      motivation: reservation.motivation,
      additionalOptions: reservation.additional_options || '[]',
      paymentMethod: reservation.payment_method,
      totalPrice: parseFloat(reservation.total_price),
      status: reservation.status,
      newsletter: Boolean(reservation.newsletter),
      createdAt: reservation.created_at,
      updatedAt: reservation.updated_at
    };

    return NextResponse.json({
      success: true,
      reservation: formattedReservation
    });

  } catch (error) {
    console.error('Error updating reservation:', error);
    
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

// GET - Obtener reserva individual
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const reservationId = parseInt(params.id);

    // Validar que el ID sea válido
    if (isNaN(reservationId)) {
      return NextResponse.json(
        { success: false, message: 'ID de reserva inválido' },
        { status: 400 }
      );
    }

    const query = `SELECT * FROM reservations WHERE id = ?`;
    const reservations = await executeQuery(query, [reservationId]) as any[];

    if (reservations.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    const reservation = reservations[0];

    // Formatear la respuesta
    const formattedReservation = {
      id: reservation.id,
      reservationNumber: reservation.reservation_number,
      eventId: reservation.event_id,
      eventTitle: reservation.event_title,
      firstName: reservation.first_name,
      lastName: reservation.last_name,
      email: reservation.email,
      phone: reservation.phone,
      birthDate: reservation.birth_date,
      nationality: reservation.nationality,
      emergencyContact: reservation.emergency_contact,
      emergencyPhone: reservation.emergency_phone,
      roomType: reservation.room_type,
      dietaryRestrictions: reservation.dietary_restrictions || '',
      medicalConditions: reservation.medical_conditions || '',
      experience: reservation.experience || '',
      motivation: reservation.motivation,
      additionalOptions: reservation.additional_options || '[]',
      paymentMethod: reservation.payment_method,
      totalPrice: parseFloat(reservation.total_price),
      status: reservation.status,
      newsletter: Boolean(reservation.newsletter),
      createdAt: reservation.created_at,
      updatedAt: reservation.updated_at
    };

    return NextResponse.json({
      success: true,
      reservation: formattedReservation
    });

  } catch (error) {
    console.error('Error fetching reservation:', error);
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