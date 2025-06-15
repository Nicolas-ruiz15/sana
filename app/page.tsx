'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import TestimonialCard from '@/components/TestimonialCard';
import { Heart, Brain, Users, Award } from 'lucide-react';
import Image from 'next/image'; // ← Agregar esta línea

// Evento destacado
const featuredEvent = {
  id: 1,
  title: 'Retiro de Transformación Profunda',
  date: '27 Sep - 3 Oct 2025',
  location: 'Valencia, España',
  description: 'Un viaje profundo de transformación personal, donde a través de herramientas de neuroplasticidad, liberación emocional, movimiento consciente, reconexión espiritual y autoconocimiento, sanarás heridas invisibles.',
  fullDescription: 'Durante 7 días de inmersión total en un entorno seguro, amoroso y consciente, acompañado por un equipo de expertos, te guiarás en el camino de reprogramar tu mente, reconectar con tu cuerpo, liberar lealtades familiares inconscientes y reconectar con tu esencia.',
  image_url: '/images/retiro-de-transformacion.jpg',
  price: 1299,
  duration: '7 días',
  category: 'transformacion',
  featured: true,
  benefits: [
    {
      icon: '🧠',
      title: 'Neuroplasticidad',
      description: 'Reprogramar tu mente para nuevos patrones de pensamiento'
    },
    {
      icon: '💫',
      title: 'Liberación Emocional',
      description: 'Soltar cargas emocionales que limitan tu crecimiento'
    },
    {
      icon: '🌸',
      title: 'Reconexión Espiritual',
      description: 'Conectar con tu esencia más profunda y auténtica'
    },
    {
      icon: '🔑',
      title: 'Autoconocimiento',
      description: 'Descubrir tu verdad, propósito y libertad interior'
    }
  ]
};

const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Participante Retiro Valencia 2023',
    content: 'Este retiro cambió mi vida completamente. Logré sanar heridas que llevaba años cargando y reconecté con mi verdadera esencia.',
    image_url: '/images/maria.jpg',
    rating: 5
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    role: 'Empresario',
    content: 'La experiencia de transformación profunda me ayudó a encontrar mi propósito y liberarme de patrones limitantes.',
    image_url: '/images/carlos.jpg',
    rating: 5
  },
  {
    id: 3,
    name: 'Ana Martín',
    role: 'Terapeuta',
    content: 'Un viaje increíble de autoconocimiento. Los expertos te acompañan con amor y profesionalidad en cada paso.',
    image_url: '/images/laura.jpg',
    rating: 5
  }
];

const stats = [
  { icon: Heart, label: 'Vidas Transformadas', value: '2,500+' },
  { icon: Brain, label: 'Retiros Realizados', value: '150+' },
  { icon: Users, label: 'Expertos Certificados', value: '25+' },
  { icon: Award, label: 'Años de Experiencia', value: '12+' }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Próximo Retiro Destacado
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No es solo un retiro. Es el punto de partida de una nueva versión de ti.
            </p>
          </motion.div>

          <EventCard event={featuredEvent} featured={true} />
        </div>
      </section>

     {/* About Section */}
<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Transformación Auténtica
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Nuestros retiros van más allá de la relajación temporal. Ofrecemos 
          experiencias profundas de transformación personal que te permiten 
          sanar, crecer y reconectar con tu verdadera esencia.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Metodologías basadas en neuroplasticidad</span>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Expertos certificados en transformación personal</span>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Entorno seguro y amoroso para el crecimiento</span>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Acompañamiento integral durante todo el proceso</span>
          </li>
        </ul>
      </motion.div>
      
      <motion.div
        className="relative h-96"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image 
          src="/images/retiro-de-transformacion.jpg"  // ← Cambia por tu imagen local
          alt="Retiro de transformación"
          fill
          className="rounded-lg shadow-lg object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
    </div>
  </div>
</section>
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Historias de Transformación
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce las experiencias de quienes han vivido su proceso de transformación con nosotros.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para Tu Transformación?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a miles de personas que han transformado sus vidas a través de nuestros retiros. 
              Comienza tu viaje hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/retiros"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Ver Todos los Retiros
              </a>
              <a 
                href="/registro"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                Registrarse Ahora
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}