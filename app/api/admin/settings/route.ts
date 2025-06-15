// app/api/admin/settings/route.ts - VERSIÓN PROTEGIDA
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { verifyAdminRole, adminOnlyResponse } from '@/lib/adminPermissions';

// GET - Obtener configuración (Solo admins)
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de admin
    const { isAdmin } = await verifyAdminRole(request);
    if (!isAdmin) {
      return adminOnlyResponse();
    }

    // Primero verificar si existe la tabla de configuración
    try {
      const query = 'SELECT setting_key, setting_value FROM site_settings';
      const results = await executeQuery(query) as any[];
      
      // Convertir array de configuraciones a objeto
      const settings: Record<string, any> = {};
      results.forEach((row: any) => {
        settings[row.setting_key] = row.setting_value;
      });

      return NextResponse.json({
        success: true,
        settings
      });
    } catch (tableError) {
      // Si la tabla no existe, devolver configuración por defecto
      const defaultSettings = {
        siteName: 'Sanando desde el Ser',
        siteDescription: 'Transformación personal auténtica a través de retiros conscientes',
        siteUrl: 'https://sanandodesdeelser.com',
        logoUrl: '/images/logo.png',
        contactEmail: 'info@sanandodesdeelser.com',
        contactPhone: '+34 600 000 000',
        contactAddress: 'Valencia, España',
        socialInstagram: 'https://instagram.com/sanandodesdeelser',
        socialFacebook: 'https://facebook.com/sanandodesdeelser',
        socialTwitter: 'https://twitter.com/sanandodesdeelser',
        emailHost: 'smtp.gmail.com',
        emailPort: '587',
        emailUser: '',
        emailPassword: '',
        reservationAutoConfirm: 'false',
        reservationEmailNotifications: 'true',
        maxReservationsPerEvent: '50',
        postsPerPage: '6',
        allowComments: 'false',
        moderateComments: 'true'
      };

      return NextResponse.json({
        success: true,
        settings: defaultSettings,
        message: 'Usando configuración por defecto. Guarda los cambios para crear la tabla de configuración.'
      });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
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

// POST - Guardar configuración (Solo admins)
export async function POST(request: NextRequest) {
  try {
    // Verificar permisos de admin
    const { isAdmin } = await verifyAdminRole(request);
    if (!isAdmin) {
      return adminOnlyResponse();
    }

    const settings = await request.json();

    // Crear tabla si no existe
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(255) NOT NULL UNIQUE,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await executeQuery(createTableQuery);

    // Insertar o actualizar cada configuración
    for (const [key, value] of Object.entries(settings)) {
      const upsertQuery = `
        INSERT INTO site_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        setting_value = VALUES(setting_value),
        updated_at = CURRENT_TIMESTAMP
      `;
      
      await executeQuery(upsertQuery, [key, String(value)]);
    }

    return NextResponse.json({
      success: true,
      message: 'Configuración guardada exitosamente'
    });

  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error guardando configuración',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}