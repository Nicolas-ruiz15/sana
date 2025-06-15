require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'global_mindfulness',
  });

  try {
    console.log('Conectando a la base de datos para poblar datos...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await connection.execute(
      'INSERT IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['admin@sanandodesdeelser.com', hashedPassword, 'Admin User', 'admin']
    );
    console.log('✓ Usuario admin creado');

    // Seed programs
    const programs = [
      {
        title: 'Mindfulness-Based Stress Reduction (MBSR)',
        description: 'Un programa de 8 semanas basado en evidencia que enseña meditación mindfulness para ayudarte a lidiar con el estrés, dolor y enfermedad.',
        content: 'Este programa integral combina meditación mindfulness, conciencia corporal y yoga para ayudar a las personas a aprender cómo usar sus recursos y habilidades innatas para responder más efectivamente al estrés, dolor y enfermedad.',
        image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
        price: 299.00,
        duration: '8 semanas',
        level: 'beginner',
        featured: true
      },
      {
        title: 'Autocompasión Consciente (MSC)',
        description: 'Aprende a tratarte con la misma amabilidad que ofrecerías a un buen amigo en tiempos difíciles.',
        content: 'Este programa enseña las habilidades de autocompasión consciente, basado en la investigación pionera de Kristin Neff y la experiencia clínica de Christopher Germer.',
        image_url: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg',
        price: 249.00,
        duration: '6 semanas',
        level: 'intermediate',
        featured: true
      },
      {
        title: 'Mindfulness para la Ansiedad',
        description: 'Programa especializado diseñado para ayudar a manejar la ansiedad a través de prácticas de mindfulness.',
        content: 'Aprende técnicas específicas de mindfulness que han demostrado ser efectivas para manejar la ansiedad y la preocupación.',
        image_url: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg',
        price: 199.00,
        duration: '4 semanas',
        level: 'beginner',
        featured: false
      }
    ];

    for (const program of programs) {
      await connection.execute(
        'INSERT IGNORE INTO programs (title, description, content, image_url, price, duration, level, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [program.title, program.description, program.content, program.image_url, program.price, program.duration, program.level, program.featured]
      );
    }
    console.log('✓ Programas creados');

    // Seed testimonials
    const testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'Ejecutiva de Marketing',
        content: 'El programa MBSR transformó completamente cómo manejo el estrés en el trabajo. Me siento más centrada y enfocada que nunca.',
        image_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        rating: 5,
        featured: true
      },
      {
        name: 'Michael Chen',
        role: 'Profesor',
        content: 'La Autocompasión Consciente me ayudó a desarrollar una relación más saludable conmigo mismo. Las técnicas son prácticas y transformadoras.',
        image_url: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg',
        rating: 5,
        featured: true
      },
      {
        name: 'Emily Rodriguez',
        role: 'Trabajadora de la Salud',
        content: 'Estas prácticas de mindfulness han sido invaluables para manejar el estrés de mi trabajo demandante. ¡Altamente recomendado!',
        image_url: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
        rating: 5,
        featured: true
      }
    ];

    for (const testimonial of testimonials) {
      await connection.execute(
        'INSERT IGNORE INTO testimonials (name, role, content, image_url, rating, featured) VALUES (?, ?, ?, ?, ?, ?)',
        [testimonial.name, testimonial.role, testimonial.content, testimonial.image_url, testimonial.rating, testimonial.featured]
      );
    }
    console.log('✓ Testimonios creados');

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);