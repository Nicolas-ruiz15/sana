// app/expertos/[id]/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Star, 
  Award, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  BookOpen, 
  Heart, 
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Video,
  Clock,
  MapPin,
  Languages
} from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

interface Expert {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  detailedBio: string;
  specialties: string[];
  experience: string;
  certifications: string[];
  languages: string[];
  rating: number;
  reviews: number;
  featured: boolean;
  sessionTypes: string[];
  sessionDuration: string;
  availability: string;
  location: string;
  email: string;
  phone: string;
  testimonials: Array<{
    name: string;
    text: string;
    rating: number;
  }>;
  achievements: string[];
  consultationFee: number;
}

export default function ExpertProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactForm, setShowContactForm] = useState(false);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const expertId = parseInt(params.id as string);

  useEffect(() => {
    if (expertId) {
      loadExpert();
    }
  }, [expertId]);

  const loadExpert = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching expert with ID:', expertId);
      const response = await fetch(`/api/expertos/${expertId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Expert data received:', data);

      if (data.success) {
        setExpert(data.expert);
      } else {
        setError(data.message || 'Expert not found');
      }
    } catch (error) {
      console.error('Error loading expert:', error);
      setError('Error al cargar el experto: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = useCallback(() => {
    router.back();
  }, [router]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleContactFormToggle = useCallback((show: boolean) => {
    setShowContactForm(show);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil del experto...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Experto no encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'El experto que buscas no está disponible.'}</p>
          <button 
            onClick={handleBackClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BookOpen },
    { id: 'experience', label: 'Experiencia', icon: Award },
    { id: 'testimonials', label: 'Testimonios', icon: Heart },
    { id: 'contact', label: 'Contacto', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a Expertos
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Expert Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              {/* Expert Header */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-8 text-white text-center relative overflow-hidden">
                {expert.image ? (
                  <div className="absolute inset-0">
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-600/80"></div>
                  </div>
                ) : null}
                
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {expert.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={expert.image}
                          alt={expert.name}
                          fill
                          className="object-cover rounded-full"
                          sizes="96px"
                        />
                      </div>
                    ) : (
                      <span className="text-2xl font-bold">
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{expert.name}</h1>
                  <p className="text-blue-100 mb-4">{expert.role}</p>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(expert.rating) ? "text-yellow-300 fill-current" : "text-blue-200"} 
                        />
                      ))}
                      <span className="ml-2 font-semibold">{expert.rating}</span>
                    </div>
                    <span className="text-blue-100">({expert.reviews} reseñas)</span>
                  </div>

                  {expert.featured && (
                    <div className="bg-blue-600 inline-block px-3 py-1 rounded-full text-sm font-semibold">
                      Experto Principal
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <Award size={16} className="mr-3 text-blue-500" />
                  <span className="text-sm">{expert.experience} de experiencia</span>
                </div>
                
                {expert.sessionDuration && (
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-3 text-blue-500" />
                    <span className="text-sm">{expert.sessionDuration}</span>
                  </div>
                )}
                
                {expert.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-3 text-blue-500" />
                    <span className="text-sm">{expert.location}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-3 text-blue-500" />
                  <span className="text-sm">{expert.reviews} personas atendidas</span>
                </div>

                {/* Languages */}
                {expert.languages.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Languages size={16} className="mr-2 text-blue-500" />
                      Idiomas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.languages.map((lang, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-3 pt-4">
                  <button 
                    onClick={() => handleContactFormToggle(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Calendar className="mr-2" size={18} />
                    Agendar Sesión
                  </button>
                  <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center">
                    <Video className="mr-2" size={18} />
                    Consulta Gratuita
                  </button>
                  <div className="flex gap-2">
                    {expert.phone && (
                      <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
                        <Phone className="mr-1" size={16} />
                        Llamar
                      </button>
                    )}
                    {expert.email && (
                      <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center">
                        <Mail className="mr-1" size={16} />
                        Email
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Detailed Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={16} className="mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Acerca de {expert.name}</h2>
                  
                  <div className="prose max-w-none mb-8">
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      {expert.detailedBio || expert.bio}
                    </p>
                  </div>

                  {/* Specialties */}
                  {expert.specialties.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Especialidades</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {expert.specialties.map((specialty, idx) => (
                          <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <span className="text-blue-800 font-medium text-sm">{specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Session Types */}
                  {expert.sessionTypes.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Tipos de Sesión</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {expert.sessionTypes.map((type, idx) => (
                          <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <CheckCircle className="text-green-500 mr-3" size={20} />
                            <span className="text-gray-700">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {expert.achievements.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Logros Destacados</h3>
                      <div className="space-y-3">
                        {expert.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-start">
                            <Award className="text-yellow-500 mr-3 mt-1" size={16} />
                            <span className="text-gray-700">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'experience' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Formación y Certificaciones</h2>
                  
                  {expert.certifications.length > 0 ? (
                    <div className="space-y-6">
                      {expert.certifications.map((cert, idx) => (
                        <div key={idx} className="border-l-4 border-blue-500 pl-6 py-2">
                          <div className="flex items-start">
                            <CheckCircle className="text-blue-500 mr-3 mt-1" size={16} />
                            <div>
                              <h4 className="font-semibold text-gray-900">{cert}</h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No hay certificaciones registradas.</p>
                  )}

                  {/* Availability */}
                  {expert.availability && (
                    <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Disponibilidad</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Clock className="text-blue-500 mr-3" size={20} />
                          <div>
                            <div className="font-semibold text-gray-900">Horarios</div>
                            <div className="text-gray-600">{expert.availability}</div>
                          </div>
                        </div>
                        {expert.location && (
                          <div className="flex items-center">
                            <MapPin className="text-blue-500 mr-3" size={20} />
                            <div>
                              <div className="font-semibold text-gray-900">Modalidad</div>
                              <div className="text-gray-600">{expert.location}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'testimonials' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Lo que dicen nuestros clientes</h2>
                  
                  {expert.testimonials.length > 0 ? (
                    <div className="space-y-6">
                      {expert.testimonials.map((testimonial, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} size={16} className="text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="ml-2 font-semibold text-gray-900">{testimonial.name}</span>
                          </div>
                          <p className="text-gray-700 italic">&quot;{testimonial.text}&quot;</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No hay testimonios disponibles aún.</p>
                  )}

                  {/* Stats */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{expert.rating}</div>
                      <div className="text-gray-600">Valoración promedio</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{expert.reviews}</div>
                      <div className="text-gray-600">Reseñas totales</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {expert.reviews > 0 ? Math.round((expert.rating / 5) * 100) : 0}%
                      </div>
                      <div className="text-gray-600">Satisfacción</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      {expert.email && (
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                          <Mail className="text-blue-500 mr-4" size={24} />
                          <div>
                            <div className="font-semibold text-gray-900">Email</div>
                            <div className="text-gray-600">{expert.email}</div>
                          </div>
                        </div>
                      )}
                      
                      {expert.phone && (
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                          <Phone className="text-blue-500 mr-4" size={24} />
                          <div>
                            <div className="font-semibold text-gray-900">Teléfono</div>
                            <div className="text-gray-600">{expert.phone}</div>
                          </div>
                        </div>
                      )}

                      {expert.location && (
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                          <MapPin className="text-blue-500 mr-4" size={24} />
                          <div>
                            <div className="font-semibold text-gray-900">Ubicación</div>
                            <div className="text-gray-600">{expert.location}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                      <h3 className="text-xl font-bold mb-4">¿Listo para comenzar?</h3>
                      <p className="mb-6">Agenda tu consulta gratuita de 20 minutos para conocer cómo podemos ayudarte.</p>
                      <button 
                        onClick={() => handleContactFormToggle(true)}
                        className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Agendar Consulta Gratuita
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contactar a {expert.name}</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (opcional)</label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea 
                  rows={4} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cuéntanos en qué te gustaría que te ayudáramos..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleContactFormToggle(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enviar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
