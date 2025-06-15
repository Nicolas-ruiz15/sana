// app/api/admin/reservations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - Obtener todas las reservas
export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT * FROM reservations 
      ORDER BY created_at DESC
    `;
    
    const reservations = await executeQuery(query) as any[];

    // Mapear los datos para que coincidan con la interfaz del frontend
    const formattedReservations = reservations.map((reservation: any) => ({
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
    }));

    return NextResponse.json({
      success: true,
      reservations: formattedReservations
    });

  } catch (error) {
    console.error('Error fetching reservations:', error);
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