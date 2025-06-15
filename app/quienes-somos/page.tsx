'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Users, Award, Target, CheckCircle, Star } from 'lucide-react';

const team = [
  {
    name: 'Dr. Susana Gomez',
    role: 'Life coach, Escritora y Educadora ',
    image: '/images/susana.png',
    bio: 'Dra. Muchos años trabajando',
	specialties: ['Neuroplasticidad', 'Liberación Emocional', 'Terapia Transpersonal']
	
  },
  {
    name: 'Cesar Angel',
    role: 'Coach ontologico, Mentor, Terapeuta Emocional , Experto en Ansiedad, Coanch Organizacional y Laboral',
    image: '/images/cesar.jpg',
    bio: 'muchos años trabajando',
	specialties: ['Yoga Terapéutico', 'Danza Consciente', 'Trabajo Corporal']
  },
  {
    name: 'Andrew Guerra',
    role: 'Terapeuta gestáltico, coach, mentor, creador y provocador de resultados',
    image: '/images/andrew.jpeg',
    bio: 'muchos años trabajando',
    specialties: ['Autoconocimiento', 'Desarrollo Personal', 'Coaching Transformacional']
  }
];

const values = [
  {
    icon: Heart,
    title: 'Amor Incondicional',
    description: 'Creamos un espacio seguro y amoroso donde cada persona puede ser auténtica y vulnerable sin juicio.'
  },
  {
    icon: Users,
    title: 'Comunidad Consciente',
    description: 'Fomentamos conexiones profundas y auténticas entre los participantes, creando una red de apoyo duradera.'
  },
  {
    icon: Award,
    title: 'Excelencia Transformacional',
    description: 'Mantenemos los más altos estándares en nuestros métodos, basados en ciencia y experiencia comprobada.'
  },
  {
    icon: Target,
    title: 'Transformación Auténtica',
    description: 'Nos enfocamos en cambios reales y duraderos, no en soluciones temporales o superficiales.'
  }
];

const achievements = [
  { number: '2,500+', label: 'Vidas Transformadas' },
  { number: '150+', label: 'Retiros Realizados' },
  { number: '25+', label: 'Expertos Certificados' },
  { number: '12+', label: 'Años de Experiencia' },
  { number: '95%', label: 'Satisfacción Participantes' },
  { number: '40+', label: 'Países Representados' }
];

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-white">
    {/* Hero Section */}
    <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
    className="text-center text-white"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
    Quiénes Somos
    </h1>
    <p className="text-xl md:text-2xl max-w-3xl mx-auto">
    Somos un equipo de expertos dedicados a facilitar procesos profundos 
    de transformación personal y reconexión con la esencia auténtica.
    </p>
    </motion.div>
    </div>
    </section>

    {/* Mission Section */}
    <section className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    >
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
    Nuestra Misión
    </h2>
    <p className="text-lg text-gray-600 mb-6">
    Sanando desde el Ser existe para acompañar a seres humanos comprometidos con su evolución personal y espiritual en un proceso 		     profundo de transformación interna. A través de retiros vivenciales, experiencias formativas, herramientas de reprogramación mental     y prácticas integradoras, cultivamos espacios seguros y amorosos donde las personas pueden liberar lealtades inconscientes, sanar       heridas del alma y reconectar con su propósito esencial.
    </p>
    <p className="text-lg text-gray-600 mb-8">
    Nuestra misión es facilitar un camino de regreso al ser auténtico, potenciando la salud emocional, mental, energética y relacional       de cada participante.
    </p>
	<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
    Nuestra Vision
    </h2>
    <p className="text-lg text-gray-600 mb-6">
    Ser una comunidad internacional de alto impacto en el desarrollo humano, reconocida por brindar experiencias profundas de               transformación y despertar espiritual.
    Visualizamos un mundo donde cada persona viva desde su autenticidad, en coherencia con su ser, su historia y su poder creador,           multiplicando conciencia, sanación y amor en sus vínculos, familias, espacios laborales y comunidades.
    </p>
    <div className="space-y-4">
    <div className="flex items-center">
    <CheckCircle className="text-blue-600 mr-3" size={20} />
    <span className="text-gray-700">Metodologías basadas en neurociencia</span>
    </div>
    <div className="flex items-center">
    <CheckCircle className="text-blue-600 mr-3" size={20} />
    <span className="text-gray-700">Expertos certificados internacionalmente</span>
    </div>
    <div className="flex items-center">
    <CheckCircle className="text-blue-600 mr-3" size={20} />
    <span className="text-gray-700">Entorno seguro y amoroso</span>
    </div>
    <div className="flex items-center">
    <CheckCircle className="text-blue-600 mr-3" size={20} />
    <span className="text-gray-700">Acompañamiento integral personalizado</span>
    </div>
    </div>
    </motion.div>
    
    <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="relative h-96 rounded-lg overflow-hidden shadow-lg"
    >
    <Image 
    src="/images/logo.png"
    alt="Equipo de transformación"
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
    />
    </motion.div>
    </div>
    </div>
    </section>

    {/* Achievements Section */}
    <section className="py-16 bg-blue-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    >
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    Nuestro Impacto
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
    Más de una década facilitando transformaciones auténticas y duraderas.
    </p>
    </motion.div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
    {achievements.map((achievement, index) => (
    <motion.div
    key={achievement.label}
    className="text-center"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    >
    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
    {achievement.number}
    </div>
    <div className="text-gray-600 text-sm">{achievement.label}</div>
    </motion.div>
    ))}
    </div>
    </div>
    </section>

    {/* Values Section */}
    <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    >
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    Nuestros Valores
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
    Los principios que guían cada aspecto de nuestro trabajo y nuestra misión.
    </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {values.map((value, index) => (
    <motion.div
    key={value.title}
    className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    >
    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
    <value.icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
    <p className="text-gray-600">{value.description}</p>
    </motion.div>
    ))}
    </div>
    </div>
    </section>

    {/* Team Section */}
    <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    >
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    Nuestro Equipo de Expertos
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
    Profesionales altamente cualificados y comprometidos con tu proceso 
    de transformación personal.
    </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {team.map((member, index) => (
    <motion.div
    key={member.name}
    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    >
    <div className="relative h-64">
    <Image 
    src={member.image} 
    alt={member.name}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
    />
    </div>
    <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
    <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
    <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>
    <div className="space-y-1">
    {member.specialties.map((specialty, idx) => (
    <span 
    key={idx}
    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
    >
    {specialty}
    </span>
    ))}
    </div>
    </div>
    </motion.div>
    ))}
    </div>
    </div>
    </section>

    {/* CTA Section */}
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
    <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
    ¿Listo para Conocer Tu Verdadera Esencia?
    </h2>
    <p className="text-xl text-blue-100 mb-8">
    Únete a nuestra comunidad de transformación y descubre el potencial 
    ilimitado que reside en tu interior.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <a 
    href="/retiros"
    className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
    >
    Explorar Retiros
    </a>
    <a 
    href="/registro"
    className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
    >
    Comenzar Ahora
    </a>
    </div>
    </motion.div>
    </div>
    </section>
    </div>
  );
}