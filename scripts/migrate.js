
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS `global_sanando desde el ser`');
    await connection.execute('USE `global_sanando desde el ser`');

    console.log('🔄 Creando tablas existentes...');

    // Users table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
    `);

    // Programs table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content LONGTEXT,
    image_url VARCHAR(500),
    price DECIMAL(10, 2),
    duration VARCHAR(100),
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
    `);

    // Blog posts table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    image_url VARCHAR(500),
    author_id INT,
    published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
    )
    `);

    // Testimonials table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    rating INT DEFAULT 5,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

    // Contact submissions table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

    // Newsletter subscriptions table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

    console.log('✅ Tablas existentes creadas correctamente');
    console.log('🔄 Creando nuevas tablas para reservas...');

    // ========== NUEVAS TABLAS PARA RESERVAS ==========

    // Reservations table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_number VARCHAR(50) UNIQUE NOT NULL,

    -- Información del evento
    event_id INT NOT NULL,
    event_title VARCHAR(255) NOT NULL,

    -- Información personal
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    nationality VARCHAR(100) NOT NULL,

    -- Contacto de emergencia
    emergency_contact VARCHAR(200) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,

    -- Preferencias del retiro
    room_type ENUM('shared', 'private', 'suite') DEFAULT 'shared',
    dietary_restrictions TEXT,
    medical_conditions TEXT,
    experience TEXT,
    motivation TEXT NOT NULL,

    -- Opciones adicionales (JSON como TEXT)
    additional_options TEXT DEFAULT '[]',

    -- Información de pago
    payment_method ENUM('card', 'transfer', 'installments') DEFAULT 'card',
    total_price DECIMAL(10,2) NOT NULL,

    -- Estado y configuración
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    newsletter BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_reservation_number (reservation_number),
    INDEX idx_email (email),
    INDEX idx_event_id (event_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
    )
    `);

    // Payments table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    INDEX idx_reservation_id (reservation_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
    )
    `);

    // Notifications table
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT,
    user_email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status ENUM('sent', 'failed', 'pending') DEFAULT 'sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,
    INDEX idx_reservation_id (reservation_id),
    INDEX idx_user_email (user_email),
    INDEX idx_type (type),
    INDEX idx_sent_at (sent_at)
    )
    `);

    console.log('✅ Nuevas tablas para reservas creadas correctamente');
    console.log('🔄 Insertando datos de ejemplo...');

    // Insertar algunos datos de ejemplo para testing
    await connection.execute(`
    INSERT IGNORE INTO reservations (
      reservation_number, event_id, event_title, first_name, last_name, 
      email, phone, birth_date, nationality, emergency_contact, emergency_phone,
      room_type, motivation, total_price, status
    ) VALUES 
    (
      'RET-DEMO-001', 1, 'Retiro de Transformación Profunda', 
      'María', 'González', 'maria@example.com', '+34 600 000 001', 
      '1985-03-15', 'Española', 'Juan González', '+34 600 000 002',
      'private', 'Busco reconectar conmigo misma y encontrar mi propósito de vida.', 
      1499.00, 'confirmed'
    ),
    (
      'RET-DEMO-002', 2, 'Retiro de Sanación Emocional', 
      'Carlos', 'Ruiz', 'carlos@example.com', '+34 600 000 003', 
      '1978-07-22', 'Española', 'Ana Ruiz', '+34 600 000 004',
      'shared', 'Necesito sanar heridas del pasado y liberar emociones bloqueadas.', 
      899.00, 'pending'
    ),
    (
      'RET-DEMO-003', 3, 'Retiro de Mindfulness y Meditación', 
      'Laura', 'Martín', 'laura@example.com', '+34 600 000 005', 
      '1990-11-08', 'Española', 'Pedro Martín', '+34 600 000 006',
      'suite', 'Quiero aprender técnicas de meditación para reducir el estrés.', 
      1899.00, 'confirmed'
    )
    `);

    console.log('✅ Datos de ejemplo insertados correctamente');
    console.log('🎉 ¡Migración de base de datos completada exitosamente!');
    console.log('');
    console.log('📊 Resumen de tablas creadas:');
    console.log('- users (existente)');
    console.log('- programs (existente)');
    console.log('- blog_posts (existente)');
    console.log('- testimonials (existente)');
    console.log('- contact_submissions (existente)');
    console.log('- newsletter_subscriptions (existente)');
    console.log('- reservations (NUEVA)');
    console.log('- payments (NUEVA)');
    console.log('- notifications (NUEVA)');
    console.log('');
    console.log('✨ El sistema de reservas está listo para usar!');

  } catch (error) {
    console.error('❌ Error en la migración:', error);
    console.error('Detalles del error:', error.message);
  } finally {
    await connection.end();
  }
}

migrate();
