'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Heart, Sparkles, Activity, Eye, Users } from 'lucide-react';
import Image from 'next/image';

// Definir el tipo para los colores
type ColorType = 'blue' | 'pink' | 'purple' | 'green' | 'indigo' | 'orange';

const categories = [
  {
    id: 'transformacion',
    title: 'Transformación Profunda',
    icon: Brain,
    description: 'Procesos intensivos de cambio personal utilizando neuroplasticidad y técnicas avanzadas de reprogramación mental.',
    benefits: [
      'Reprogramación de patrones mentales limitantes',
      'Desarrollo de nuevas redes neuronales',
      'Transformación de creencias profundas',
      'Integración de nuevos hábitos conscientes'
    ],
    duration: '7-10 días',
    level: 'Intermedio-Avanzado',
    image: '/images/logo.png',
    color: 'blue' as ColorType
  },
  {
    id: 'sanacion',
    title: 'Sanación Emocional',
    icon: Heart,
    description: 'Liberación de traumas, heridas emocionales y patrones que bloquean tu bienestar y crecimiento personal.',
    benefits: [
      'Liberación de traumas almacenados',
      'Sanación de heridas emocionales',
      'Restauración del equilibrio interno',
      'Desarrollo de inteligencia emocional'
    ],
    duration: '5-7 días',
    level: 'Todos los niveles',
    image: '/images/logo.png',
    color: 'pink' as ColorType
  },
  {
    id: 'espiritual',
    title: 'Reconexión Espiritual',
    icon: Sparkles,
    description: 'Viaje hacia tu interior para conectar con tu esencia espiritual, propósito de vida y sabiduría interior.',
    benefits: [
      'Conexión con tu esencia auténtica',
      'Claridad sobre tu propósito de vida',
      'Desarrollo de intuición y sabiduría',
      'Experiencias de conexión trascendente'
    ],
    duration: '5-7 días',
    level: 'Todos los niveles',
    image: '/images/logo.png',
    color: 'purple' as ColorType
  },
  {
    id: 'movimiento',
    title: 'Movimiento Consciente',
    icon: Activity,
    description: 'Reconexión con tu cuerpo a través del movimiento consciente, yoga terapéutico y expresión corporal.',
    benefits: [
      'Reconexión cuerpo-mente-espíritu',
      'Liberación de tensiones físicas',
      'Desarrollo de conciencia corporal',
      'Expresión auténtica a través del movimiento'
    ],
    duration: '3-5 días',
    level: 'Todos los niveles',
    image: '/images/logo.png',
    color: 'green' as ColorType
  },
  {
    id: 'autoconocimiento',
    title: 'Autoconocimiento',
    icon: Eye,
    description: 'Exploración profunda de tu identidad auténtica, valores, talentos y potencial único.',
    benefits: [
      'Claridad sobre tu identidad auténtica',
      'Reconocimiento de talentos únicos',
      'Alineación con valores profundos',
      'Desarrollo del potencial personal'
    ],
    duration: '5-7 días',
    level: 'Todos los niveles',
    image: '/images/logo.png',
    color: 'indigo' as ColorType
  },
  {
    id: 'liberacion',
    title: 'Liberación Familiar',
    icon: Users,
    description: 'Sanación de patrones familiares heredados, lealtades inconscientes y dinámicas que limitan tu libertad.',
    benefits: [
      'Liberación de lealtades familiares inconscientes',
      'Sanación de patrones generacionales',
      'Desarrollo de autonomía emocional',
      'Creación de relaciones más sanas'
    ],
    duration: '5-7 días',
    level: 'Intermedio-Avanzado',
    image: '/images/logo.png',
    color: 'orange' as ColorType
  }
];

const colorClasses: Record<ColorType, string> = {
  blue: 'from-blue-500 to-blue-600',
  pink: 'from-pink-500 to-pink-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  indigo: 'from-indigo-500 to-indigo-600',
  orange: 'from-orange-500 to-orange-600'
};

export default function CategoriasPage() {
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
            Categorías de Transformación
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada categoría está diseñada para abordar aspectos específicos de tu crecimiento 
            personal y transformación. Encuentra el camino que resuene más contigo.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative h-48">
                <Image 
                  src={category.image} 
                  alt={category.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[category.color]} opacity-80`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <category.icon size={48} className="mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Duración</h4>
                    <p className="text-gray-600">{category.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Nivel</h4>
                    <p className="text-gray-600">{category.level}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Beneficios Principales</h4>
                  <ul className="space-y-2">
                    {category.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href={`/retiros?category=${category.id}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    Ver Retiros
                  </Link>
                  <Link
                    href="/registro"
                    className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-center font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
                  >
                    Registrarse
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nuestro Proceso de Transformación
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Evaluación Inicial</h3>
              <p className="text-gray-600 text-sm">Análisis personalizado de tu situación y objetivos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Inmersión Profunda</h3>
              <p className="text-gray-600 text-sm">Experiencia intensiva con técnicas especializadas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Integración</h3>
              <p className="text-gray-600 text-sm">Consolidación de aprendizajes y nuevos patrones</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguimiento</h3>
              <p className="text-gray-600 text-sm">Acompañamiento post-retiro para mantener cambios</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            ¿No estás seguro de qué categoría elegir?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nuestros expertos te ayudarán a identificar el camino de transformación 
            más adecuado para tu momento actual y objetivos personales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Consulta Gratuita
            </a>
            <a
              href="/expertos"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Conocer Expertos
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}