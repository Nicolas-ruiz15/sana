import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise';

// Interfaces para tipado
interface ReservationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  nationality: string;
  emergencyContact: string;
  emergencyPhone: string;
  motivation: string;
  eventId: string;
  eventTitle: string;
  totalPrice: number;
  roomType?: string;
  dietaryRestrictions?: string;
  medicalConditions?: string;
  experience?: string;
  additionalOptions?: string[];
  paymentMethod?: string;
  newsletter?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: ReservationData = await request.json();

    // Validar datos requeridos
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'birthDate', 
      'nationality', 'emergencyContact', 'emergencyPhone', 
      'motivation', 'eventId', 'eventTitle', 'totalPrice'
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof ReservationData]) {
        return NextResponse.json(
          { success: false, message: `Campo requerido faltante: ${field}` },
          { status: 400 }
        );
      }
    }

    // Configurar transporter de email - USANDO LA MISMA CONFIG QUE REGISTRO
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD, // ← CAMBIADO A SMTP_PASSWORD
      },
    });

    // Crear conexión a la base de datos - USANDO MYSQL DIRECTO COMO REGISTRO
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Generar número de reserva único
    const reservationNumber = `RET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Guardar reserva en la base de datos - USANDO MYSQL DIRECTO
    await connection.execute(`
      INSERT INTO reservations (
        reservation_number, event_id, event_title, first_name, last_name, 
        email, phone, birth_date, nationality, emergency_contact, emergency_phone,
        room_type, dietary_restrictions, medical_conditions, experience, 
        motivation, additional_options, payment_method, total_price, status, 
        newsletter, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      reservationNumber,
      data.eventId,
      data.eventTitle,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.birthDate,
      data.nationality,
      data.emergencyContact,
      data.emergencyPhone,
      data.roomType || 'shared',
      data.dietaryRestrictions || '',
      data.medicalConditions || '',
      data.experience || '',
      data.motivation,
      JSON.stringify(data.additionalOptions || []),
      data.paymentMethod || 'card',
      data.totalPrice,
      'pending',
      data.newsletter || false
    ]);

    await connection.end();

    // Email para el cliente
    const customerEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmación de Reserva - ${data.eventTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
        .price-box { background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
        .highlight { color: #2563eb; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Reserva Confirmada!</h1>
          <p>Gracias por confiar en nosotros para tu transformación personal</p>
        </div>

        <div class="content">
          <p>Estimado/a <strong>${data.firstName} ${data.lastName}</strong>,</p>
          <p>¡Excelente noticia! Tu reserva para el retiro "<strong>${data.eventTitle}</strong>" ha sido procesada exitosamente.</p>

          <div class="info-box">
            <h3>📋 Detalles de tu Reserva</h3>
            <p><strong>Número de Reserva:</strong> <span class="highlight">${reservationNumber}</span></p>
            <p><strong>Retiro:</strong> ${data.eventTitle}</p>
            <p><strong>Participante:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Teléfono:</strong> ${data.phone}</p>
            <p><strong>Tipo de Habitación:</strong> ${getRoomTypeName(data.roomType || 'shared')}</p>
          </div>

          <div class="price-box">
            <h3>💰 Total a Pagar</h3>
            <div style="font-size: 2em; color: #2563eb; font-weight: bold;">€${data.totalPrice}</div>
            <p>Método de pago preferido: ${getPaymentMethodName(data.paymentMethod || 'card')}</p>
          </div>

          <div class="info-box">
            <h3>⏰ Próximos Pasos</h3>
            <ol>
              <li><strong>Pago:</strong> Tienes 48 horas para completar el pago y confirmar tu plaza</li>
              <li><strong>Confirmación:</strong> Una vez recibido el pago, te enviaremos la confirmación final</li>
              <li><strong>Información detallada:</strong> Recibirás un paquete completo con toda la información del retiro</li>
              <li><strong>Preparación:</strong> Te enviaremos una guía de preparación una semana antes del retiro</li>
            </ol>
          </div>

          <div class="info-box">
            <h3>💳 Instrucciones de Pago</h3>
            ${getPaymentInstructions(data.paymentMethod || 'card', data.totalPrice, reservationNumber)}
          </div>

          <p><strong>¿Tienes preguntas?</strong> No dudes en contactarnos:</p>
          <ul>
            <li>📧 Email: info@sanandodesdeelser.com</li>
            <li>📱 WhatsApp: +34 XXX XXX XXX</li>
            <li>🌐 Web: www.sanandodesdeelser.com</li>
          </ul>

          <p>Estamos emocionados de acompañarte en este viaje de transformación personal.</p>
          <p>Con amor y gratitud,<br><strong>El Equipo de Sanando Desde el Ser</strong></p>
        </div>

        <div class="footer">
          <p>Este email fue enviado porque realizaste una reserva en nuestro sitio web.</p>
          <p>Si no realizaste esta reserva, por favor contacta con nosotros inmediatamente.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Email para el administrador
    const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nueva Reserva Recibida</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .info-section { background: white; margin: 15px 0; padding: 15px; border-radius: 5px; }
        .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎉 Nueva Reserva Recibida</h2>
        </div>

        <div class="content">
          <div class="info-section">
            <h3>📋 Información de la Reserva</h3>
            <p><strong>Número:</strong> <span class="highlight">${reservationNumber}</span></p>
            <p><strong>Retiro:</strong> ${data.eventTitle}</p>
            <p><strong>Total:</strong> €${data.totalPrice}</p>
            <p><strong>Estado:</strong> Pendiente de pago</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          </div>

          <div class="info-section">
            <h3>👤 Datos del Cliente</h3>
            <p><strong>Nombre:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Teléfono:</strong> ${data.phone}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${data.birthDate}</p>
            <p><strong>Nacionalidad:</strong> ${data.nationality}</p>
          </div>

          <div class="info-section">
            <h3>🏠 Preferencias</h3>
            <p><strong>Habitación:</strong> ${getRoomTypeName(data.roomType || 'shared')}</p>
            <p><strong>Restricciones Dietéticas:</strong> ${data.dietaryRestrictions || 'Ninguna'}</p>
            <p><strong>Condiciones Médicas:</strong> ${data.medicalConditions || 'Ninguna'}</p>
            <p><strong>Experiencia:</strong> ${data.experience || 'No especificada'}</p>
          </div>

          <div class="info-section">
            <h3>🚨 Contacto de Emergencia</h3>
            <p><strong>Nombre:</strong> ${data.emergencyContact}</p>
            <p><strong>Teléfono:</strong> ${data.emergencyPhone}</p>
          </div>

          <div class="info-section">
            <h3>💭 Motivación</h3>
            <p>${data.motivation}</p>
          </div>

          <div class="info-section">
            <h3>💳 Información de Pago</h3>
            <p><strong>Método Preferido:</strong> ${getPaymentMethodName(data.paymentMethod || 'card')}</p>
            <p><strong>Newsletter:</strong> ${data.newsletter ? 'Sí' : 'No'}</p>
          </div>

          ${data.additionalOptions && data.additionalOptions.length > 0 ? `
          <div class="info-section">
            <h3>➕ Opciones Adicionales</h3>
            <ul>
              ${data.additionalOptions.map((option: string) => `<li>${getAdditionalOptionName(option)}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <p><strong>Acción requerida:</strong> Seguir el estado del pago y confirmar la reserva una vez recibido.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Enviar emails
    try {
      // Email al cliente
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: data.email,
        subject: `Confirmación de Reserva - ${data.eventTitle} (${reservationNumber})`,
        html: customerEmailHtml,
      });

      // Email al administrador
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'nicolasruiz153@gmail.com', // ← CAMBIAR POR TU EMAIL
        subject: `Nueva Reserva: ${data.eventTitle} - ${data.firstName} ${data.lastName}`,
        html: adminEmailHtml,
      });

    } catch (emailError) {
      console.error('Error enviando emails:', emailError);
      // No fallar la reserva si hay error en el email
    }

    return NextResponse.json({
      success: true,
      message: 'Reserva creada exitosamente',
      reservationNumber,
      data: {
        reservationNumber,
        status: 'pending',
        totalPrice: data.totalPrice,
      }
    });

  } catch (error) {
    console.error('Error procesando reserva:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Funciones auxiliares
function getRoomTypeName(roomType: string): string {
  const types: { [key: string]: string } = {
    'shared': 'Habitación Compartida',
    'private': 'Habitación Individual',
    'suite': 'Suite Premium'
  };
  return types[roomType] || roomType;
}

function getPaymentMethodName(method: string): string {
  const methods: { [key: string]: string } = {
    'card': 'Tarjeta de crédito/débito',
    'transfer': 'Transferencia bancaria',
    'installments': 'Pago en cuotas'
  };
  return methods[method] || method;
}

function getAdditionalOptionName(optionId: string): string {
  const options: { [key: string]: string } = {
    'transport': 'Transporte desde el aeropuerto',
    'massage': 'Sesión de masaje terapéutico',
    'nutrition': 'Consulta nutricional personalizada',
    'materials': 'Kit de materiales premium'
  };
  return options[optionId] || optionId;
}

function getPaymentInstructions(method: string, amount: number, reservationNumber: string): string {
  switch (method) {
    case 'transfer':
      return `
        <p><strong>Transferencia Bancaria:</strong></p>
        <ul>
          <li><strong>Banco:</strong> [Nombre del Banco]</li>
          <li><strong>IBAN:</strong> ES XX XXXX XXXX XXXX XXXX XXXX</li>
          <li><strong>Beneficiario:</strong> Sanando Desde el Ser</li>
          <li><strong>Concepto:</strong> ${reservationNumber}</li>
          <li><strong>Importe:</strong> €${amount}</li>
        </ul>
        <p><em>Importante: Incluye siempre el número de reserva en el concepto.</em></p>
      `;
    case 'installments':
      return `
        <p><strong>Pago en Cuotas:</strong></p>
        <p>Nos pondremos en contacto contigo en las próximas 24 horas para acordar un plan de pago personalizado.</p>
        <p>Opciones disponibles:</p>
        <ul>
          <li>2 cuotas (50% ahora, 50% en 30 días)</li>
          <li>3 cuotas (40% ahora, 30% en 30 días, 30% en 60 días)</li>
        </ul>
      `;
    default: // card
      return `
        <p><strong>Pago con Tarjeta:</strong></p>
        <p>Recibirás un enlace de pago seguro en las próximas 2 horas para completar tu reserva.</p>
        <p>El enlace será válido por 48 horas.</p>
        <p><em>Procesamos los pagos de forma segura a través de Stripe.</em></p>
      `;
  }
}