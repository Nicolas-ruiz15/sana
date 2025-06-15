import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Configurar transporter de email - CORREGIDO
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Crear conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Guardar en base de datos
    await connection.execute(`
      INSERT INTO contact_submissions (name, email, subject, message, status) 
      VALUES (?, ?, ?, ?, 'new')
    `, [
      `${formData.firstName} ${formData.lastName}`,
      formData.email,
      'Registro para Retiro',
      `
        NUEVO REGISTRO PARA RETIRO

        === INFORMACIÓN PERSONAL ===
        Nombre: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Teléfono: ${formData.phone}
        Fecha de Nacimiento: ${formData.birthDate}
        País: ${formData.country}
        Ciudad: ${formData.city}

        === INTERESES Y MOTIVACIÓN ===
        Experiencia: ${formData.experience}
        Intereses: ${formData.interests.join(', ')}
        Motivación: ${formData.motivation}

        === INFORMACIÓN ADICIONAL ===
        Condiciones Médicas: ${formData.medicalConditions || 'Ninguna'}
        Contacto de Emergencia: ${formData.emergencyContact}
        Teléfono de Emergencia: ${formData.emergencyPhone}
        Newsletter: ${formData.newsletter ? 'Sí' : 'No'}
      `
    ]);

    await connection.end();

    // Enviar email a ti
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'nicolasruiz153@gmail.com', // ← CAMBIAR POR TU EMAIL
      subject: `🧘 Nuevo Registro: ${formData.firstName} ${formData.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nuevo Registro para Retiro</h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Información Personal</h3>
            <p><strong>Nombre:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Teléfono:</strong> ${formData.phone}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${formData.birthDate}</p>
            <p><strong>Ubicación:</strong> ${formData.city}, ${formData.country}</p>
          </div>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Intereses y Motivación</h3>
            <p><strong>Experiencia:</strong> ${formData.experience}</p>
            <p><strong>Intereses:</strong> ${formData.interests.join(', ')}</p>
            <p><strong>Motivación:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px;">${formData.motivation}</p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">Información Adicional</h3>
            <p><strong>Condiciones Médicas:</strong> ${formData.medicalConditions || 'Ninguna'}</p>
            <p><strong>Contacto de Emergencia:</strong> ${formData.emergencyContact}</p>
            <p><strong>Teléfono de Emergencia:</strong> ${formData.emergencyPhone}</p>
            <p><strong>Newsletter:</strong> ${formData.newsletter ? 'Sí' : 'No'}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">Este registro fue enviado desde tu sitio web</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Enviar email de confirmación al usuario
    const confirmationMail = {
      from: process.env.SMTP_USER,
      to: formData.email,
      subject: '✅ Registro Confirmado - Sanando Desde el Ser',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Gracias por tu registro, ${formData.firstName}!</h2>

          <p>Hemos recibido tu registro para nuestros retiros de transformación.</p>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af;">Próximos Pasos:</h3>
            <ul>
              <li>Revisaremos tu información en las próximas 24 horas</li>
              <li>Te contactaremos para discutir el retiro más adecuado para ti</li>
              <li>Recibirás información detallada sobre fechas y ubicaciones</li>
            </ul>
          </div>

          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>

          <p>Con gratitud,<br>
          <strong>Equipo Sanando Desde el Ser</strong></p>
        </div>
      `
    };

    await transporter.sendMail(confirmationMail);

    return NextResponse.json({ 
      success: true, 
      message: 'Registro enviado correctamente' 
    });

  } catch (error) {
    console.error('Error al procesar registro:', error);
    return NextResponse.json(
      { success: false, message: 'Error al procesar el registro' },
      { status: 500 }
    );
  }
}