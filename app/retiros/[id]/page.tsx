'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  Heart,
  Brain,
  Sparkles,
  Key
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Tipo para el evento
type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  price: number;
  duration: string;
  category: string;
  featured: boolean;
  maxParticipants: number;
  currentParticipants: number;
  benefits?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  schedule?: Array<{
    day: string;
    title: string;
    activities: string[];
  }>;
  testimonials?: Array<{
    name: string;
    text: string;
    rating: number;
  }>;
  includes?: string[];
  notIncludes?: string[];
};

export default function RetiroDetailsPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;
    fetchRetiroDetails();
  }, [params.id]);

  const fetchRetiroDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/admin/retiros/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setEvent(data.retiro);
      } else {
        setError(data.message || 'Error al cargar el retiro');
      }
    } catch (err) {
      console.error('Error fetching retiro details:', err);
      setError('Error al cargar los detalles del retiro');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del retiro...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Retiro no encontrado'}
          </h2>
          <Link 
            href="/retiros"
            className="text-blue-600 hover:text-blue-700"
          >
            Volver a Retiros
          </Link>
        </div>
      </div>
    );
  }

  const availableSpots = event.maxParticipants - event.currentParticipants;

  // Iconos por defecto si no vienen de la base de datos
  const defaultBenefits = [
    {
      icon: '🧠',
      title: 'Transformación Mental',
      description: 'Técnicas avanzadas para reprogramar tu mente'
    },
    {
      icon: '💫',
      title: 'Liberación Emocional',
      description: 'Suelta cargas que limitan tu crecimiento'
    },
    {
      icon: '🌸',
      title: 'Reconexión Espiritual',
      description: 'Conecta con tu esencia más profunda'
    },
    {
      icon: '🔑',
      title: 'Autoconocimiento',
      description: 'Descubre tu verdadero propósito'
    }
  ];

  const benefitsToShow = event.benefits && event.benefits.length > 0 ? event.benefits : defaultBenefits;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <Link 
              href="/retiros"
              className="inline-flex items-center text-white hover:text-blue-200 mb-4 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver a Retiros
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-lg">
                <div className="flex items-center">
                  <Calendar size={20} className="mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <MapPin size={20} className="mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Clock size={20} className="mr-2" />
                  {event.duration}
                </div>
                <div className="flex items-center">
                  <Users size={20} className="mr-2" />
                  {availableSpots} plazas disponibles
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Descripción' },
                    { id: 'benefits', label: 'Beneficios' },
                    { id: 'schedule', label: 'Programa' },
                    { id: 'testimonials', label: 'Testimonios' },
                    { id: 'includes', label: 'Incluye' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Sobre este Retiro
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {event.description}
                    </p>
                    {event.fullDescription && (
                      <p className="text-gray-600 leading-relaxed">
                        {event.fullDescription}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Benefits Tab */}
                {activeTab === 'benefits' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Beneficios del Retiro
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {benefitsToShow.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="text-3xl">{benefit.icon}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {benefit.title}
                            </h3>
                            <p className="text-gray-600">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Programa del Retiro
                    </h2>
                    {event.schedule && event.schedule.length > 0 ? (
                      <div className="space-y-6">
                        {event.schedule.map((day, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {day.day}: {day.title}
                            </h3>
                            <ul className="space-y-1">
                              {day.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-center text-gray-600">
                                  <CheckCircle size={16} className="text-green-500 mr-2" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        El programa detallado se enviará a los participantes confirmados.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Testimonials Tab */}
                {activeTab === 'testimonials' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Lo que dicen nuestros participantes
                    </h2>
                    {event.testimonials && event.testimonials.length > 0 ? (
                      <div className="space-y-6">
                        {event.testimonials.map((testimonial, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                              <div className="flex text-yellow-400">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} size={16} fill="currentColor" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 italic mb-4">
                              &quot;{testimonial.text}&quot;
                            </p>
                            <p className="font-semibold text-gray-900">
                              - {testimonial.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        Los testimonios se actualizarán próximamente.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Includes Tab */}
                {activeTab === 'includes' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-green-600">
                          ✅ Incluye
                        </h2>
                        <ul className="space-y-2">
                          {event.includes && event.includes.length > 0 ? (
                            event.includes.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle size={16} className="text-green-500 mr-2 mt-1" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-600">
                              Información próximamente disponible
                            </li>
                          )}
                        </ul>
                      </div>

                      {event.notIncludes && event.notIncludes.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-4 text-red-600">
                            ❌ No Incluye
                          </h2>
                          <ul className="space-y-2">
                            {event.notIncludes.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-500 mr-2 mt-1">•</span>
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  €{event.price}
                </div>
                <div className="text-gray-600">por persona</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-semibold">{event.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plazas disponibles:</span>
                  <span className="font-semibold text-green-600">{availableSpots}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Máximo participantes:</span>
                  <span className="font-semibold">{event.maxParticipants}</span>
                </div>
                {event.featured && (
                  <div className="flex items-center justify-center mt-4">
                    <Star className="text-yellow-500 fill-current mr-2" size={20} />
                    <span className="text-sm font-semibold text-yellow-600">
                      Retiro Destacado
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Link
                  href={`/retiros/${event.id}/reservar`}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center block"
                >
                  Reservar Ahora
                </Link>

                <button className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
                  Más Información
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Heart size={16} className="text-red-500 mr-2" />
                  <span>Satisfacción garantizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}