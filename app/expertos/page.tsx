'use client';

import { motion } from 'framer-motion';
import { Star, Award, Users, Calendar, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const experts = [
  {
    id: 1,
    name: 'Dr. Susana Gomez',
    role: 'Life coach, Escritora y Educadora',
    image: '/images/susana.png',
    bio: 'Doctora en Psicología Transpersonal con más de 20 años de experiencia en transformación personal y desarrollo de la conciencia.',
    specialties: ['Neuroplasticidad', 'Liberación Emocional', 'Terapia Transpersonal', 'Coaching Transformacional'],
    experience: '20+ años',
    certifications: ['PhD Psicología Transpersonal', 'Certificación Internacional en Neuroplasticidad', 'Master en Terapia Gestalt'],
    languages: ['Español', 'Inglés', 'Francés'],
    rating: 4.9,
    reviews: 156,
    featured: true
  },
  {
    id: 2,
    name: 'Cesar Angel',
    role: 'Coach ontológico, Mentor, Terapeuta Emocional, Experto en Ansiedad, Coach Organizacional y Laboral',
    image: '/images/cesar.jpg',
    bio: 'Coach ontológico certificado con especialización en manejo de ansiedad y desarrollo organizacional.',
    specialties: ['Master en Coaching Ontológico', 'Danza Consciente', 'Trabajo Corporal', 'Bioenergética'],
    experience: '15+ años',
    certifications: ['Certificación Internacional Yoga Alliance', 'Formación en Danza Movimiento Terapia', 'Especialización en Bioenergética'],
    languages: ['Español'],
    rating: 4.8,
    reviews: 89,
    featured: true
  },
  {
    id: 3,
    name: 'Andrew Guerra',
    role: 'Terapeuta gestáltico, coach, mentor, creador y provocador de resultados',
    image: '/images/andrew.jpeg',
    bio: 'Terapeuta gestáltico y coach especializado en autoconocimiento y desarrollo personal.',
    specialties: ['Autoconocimiento', 'Desarrollo Personal', 'Coaching de Vida', 'Psicología Positiva'],
    experience: '12+ años',
    certifications: ['Trabajo Corporal', 'Yoga Terapéutico', 'Certificación en Psicología Positiva'],
    languages: ['Español', 'Inglés'],
    rating: 4.9,
    reviews: 134,
    featured: true
  },
  {
    id: 4,
    name: 'Hannye Del Valle',
    role: 'Terapeuta gestáltico, coach, mentor, creador y provocador de resultados',
    image: '/images/hani.jpg',
    bio: 'Terapeuta gestáltico y coach especializado en autoconocimiento y desarrollo personal.',
    specialties: ['Autoconocimiento', 'Desarrollo Personal', 'Coaching de Vida', 'Psicología Positiva'],
    experience: '5+ años',
    certifications: ['Trabajo Corporal', 'Yoga Terapéutico', 'Certificación en Psicología Positiva'],
    languages: ['Español', 'Inglés'],
    rating: 4.9,
    reviews: 134,
    featured: true
  }
];

export default function ExpertosPage() {
  const featuredExperts = experts.filter(expert => expert.featured);
  const otherExperts = experts.filter(expert => !expert.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nuestros Expertos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce al equipo de profesionales altamente cualificados que te acompañarán 
            en tu proceso de transformación personal y crecimiento espiritual.
          </p>
        </motion.div>

        {/* Featured Experts - Grid de 4 columnas */}
        <section className="mb-16">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nuestro Equipo de Expertos
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Expert Image */}
                <div className="relative h-56 overflow-hidden">
                  {expert.image ? (
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-full flex items-center justify-center">
                      <div className="text-white text-3xl font-bold">
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Experto
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{expert.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3 text-sm line-clamp-2">{expert.role}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-3">
                      <Star className="text-yellow-400 fill-current" size={14} />
                      <span className="ml-1 text-sm font-semibold">{expert.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({expert.reviews})</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">{expert.bio}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {expert.specialties.slice(0, 2).map((specialty, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {expert.specialties.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{expert.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Award size={12} className="mr-1" />
                      <span>{expert.experience}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={12} className="mr-1" />
                      <span>{expert.reviews}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link 
                      href={`/expertos/${expert.id}`}
                      className="block"
                    >
                      <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200">
                        Ver Perfil
                      </button>
                    </Link>
                    <Link 
                      href="/contact"
                      className="block"
                    >
                      <button className="w-full border border-blue-600 text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200">
                        Contactar
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Experiencia Colectiva
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Años de Experiencia Combinada</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">30+</div>
              <div className="text-gray-600">Certificaciones Internacionales</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3,000+</div>
              <div className="text-gray-600">Personas Transformadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">4.9</div>
              <div className="text-gray-600">Valoración Promedio</div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            ¿Quieres conocer más sobre nuestros expertos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Programa una consulta gratuita para conocer qué experto es el más adecuado 
            para acompañarte en tu proceso de transformación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
            >
              <Calendar className="mr-2" size={20} />
              Agendar Consulta
            </Link>
            <a
              href="mailto:info@sanandodesdeelser.com"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300 flex items-center justify-center"
            >
              <Mail className="mr-2" size={20} />
              Escribir Email
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}