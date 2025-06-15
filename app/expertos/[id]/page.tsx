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
  MapPin
} from 'lucide-react';
import { useState, useCallback } from 'react';

// Datos de los expertos (idealmente esto vendría de una API o base de datos)
const experts = [
  {
    id: 1,
    name: 'Dr. Susana Gomez',
    role: 'Life coach, Escritora y Educadora',
    image: '/images/susana.png',
    bio: 'Doctora en Psicología Transpersonal con más de 20 años de experiencia ayudando a personas a transformar sus vidas a través del poder de la neuroplasticidad y la liberación emocional. Su enfoque integral combina técnicas científicamente probadas con sabiduría ancestral para crear procesos de sanación profunda y duradera.',
    detailedBio: 'La Dra. Susana Gomez es una pionera en el campo de la transformación personal y el desarrollo de la conciencia. Con una sólida formación académica y décadas de experiencia práctica, ha desarrollado metodologías únicas que integran la neurociencia moderna con técnicas milenarias de sanación. Su trabajo se centra en empoderar a las personas para que reconozcan su potencial innato y lo manifiesten en todas las áreas de su vida. Ha acompañado a miles de personas en procesos de sanación emocional, superación de traumas y desarrollo de una vida plena y consciente.',
    specialties: ['Neuroplasticidad', 'Liberación Emocional', 'Terapia Transpersonal', 'Coaching Transformacional', 'Sanación de Traumas', 'Desarrollo de Conciencia'],
    experience: '20+ años',
    certifications: [
      'PhD Psicología Transpersonal - Universidad Internacional',
      'Certificación Internacional en Neuroplasticidad',
      'Master en Terapia Gestalt',
      'Especialización en EMDR',
      'Certificación en Coaching Ontológico',
      'Formación en Constelaciones Familiares'
    ],
    languages: ['Español', 'Inglés', 'Francés'],
    rating: 4.9,
    reviews: 156,
    featured: true,
    sessionTypes: ['Sesión Individual 1:1', 'Terapia de Pareja', 'Talleres Grupales', 'Retiros Intensivos'],
    sessionDuration: '60-90 minutos',
    availability: 'Lunes a Viernes 9:00 - 18:00',
    location: 'Consultorio en Madrid + Online',
    email: 'susana@sanandodesdeelser.com',
    phone: '+34 600 123 456',
    testimonials: [
      {
        name: 'María Elena R.',
        text: 'Susana me ayudó a sanar heridas profundas que llevaba años cargando. Su enfoque es profundo pero amoroso.',
        rating: 5
      },
      {
        name: 'Carlos M.',
        text: 'Un proceso transformador que cambió completamente mi perspectiva de vida. Altamente recomendada.',
        rating: 5
      }
    ],
    achievements: [
      'Autora de 3 libros sobre transformación personal',
      'Conferencista internacional en más de 50 eventos',
      'Más de 2000 personas transformadas',
      'Colaboradora en medios especializados'
    ]
  },
  {
    id: 2,
    name: 'Cesar Angel',
    role: 'Coach ontológico, Mentor, Terapeuta Emocional, Experto en Ansiedad, Coach Organizacional y Laboral',
    image: '/images/cesar.jpg',
    bio: 'Coach ontológico certificado con especialización en el manejo de la ansiedad y el desarrollo organizacional. Su enfoque único combina técnicas de coaching con trabajo corporal y danza consciente para crear transformaciones profundas tanto a nivel personal como profesional.',
    detailedBio: 'Cesar Angel es un facilitador experto en procesos de transformación personal y organizacional. Con formación en coaching ontológico y una amplia experiencia en el mundo empresarial, ha desarrollado metodologías innovadoras que integran el cuerpo, la mente y las emociones en los procesos de cambio. Su especialización en ansiedad le permite ayudar a personas que luchan con este desafío tan común en nuestros tiempos, ofreciendo herramientas prácticas y efectivas para recuperar el bienestar emocional.',
    specialties: ['Coaching Ontológico', 'Manejo de Ansiedad', 'Danza Consciente', 'Trabajo Corporal', 'Bioenergética', 'Coaching Organizacional'],
    experience: '15+ años',
    certifications: [
      'Master en Coaching Ontológico - ICF Certificado',
      'Certificación Internacional Yoga Alliance',
      'Formación en Danza Movimiento Terapia',
      'Especialización en Bioenergética',
      'Certificación en Mindfulness',
      'Coaching Organizacional Avanzado'
    ],
    languages: ['Español'],
    rating: 4.8,
    reviews: 89,
    featured: true,
    sessionTypes: ['Coaching Individual', 'Terapia de Ansiedad', 'Sesiones de Danza Consciente', 'Coaching Empresarial'],
    sessionDuration: '45-75 minutos',
    availability: 'Lunes a Sábado 10:00 - 19:00',
    location: 'Barcelona + Online',
    email: 'cesar@sanandodesdeelser.com',
    phone: '+34 600 789 012',
    testimonials: [
      {
        name: 'Ana L.',
        text: 'Cesar me ayudó a superar mi ansiedad de una forma que nunca imaginé. Su método es revolucionario.',
        rating: 5
      },
      {
        name: 'Roberto S.',
        text: 'Como empresario, su coaching me ha dado herramientas invaluables para liderar con conciencia.',
        rating: 5
      }
    ],
    achievements: [
      'Más de 1500 sesiones de coaching realizadas',
      'Facilitador en 30+ empresas multinacionales',
      'Creador del método Danza del Ser',
      'Mentor de coaches emergentes'
    ]
  },
  {
    id: 3,
    name: 'Andrew Guerra',
    role: 'Terapeuta gestáltico, coach, mentor, creador y provocador de resultados',
    image: '/images/andrew.jpeg',
    bio: 'Terapeuta gestáltico y coach especializado en autoconocimiento y desarrollo personal. Su estilo directo y transformador ha ayudado a cientos de personas a descubrir su verdadero potencial y crear la vida que realmente desean vivir.',
    detailedBio: 'Andrew Guerra es un provocador de resultados extraordinarios. Con una formación sólida en terapia gestáltica y técnicas de coaching avanzado, se ha especializado en trabajar con personas que buscan cambios profundos y duraderos en sus vidas. Su enfoque directo y sin rodeos, combinado con una profunda compasión, crea un espacio único donde las personas pueden confrontar sus limitaciones y expandir sus posibilidades. Andrew cree firmemente que todos tenemos el poder de crear la vida que deseamos, y su trabajo consiste en ayudar a las personas a despertar ese poder interior.',
    specialties: ['Terapia Gestáltica', 'Autoconocimiento', 'Desarrollo Personal', 'Coaching de Vida', 'Psicología Positiva', 'Trabajo Corporal'],
    experience: '12+ años',
    certifications: [
      'Certificación en Terapia Gestáltica',
      'Formación en Trabajo Corporal',
      'Yoga Terapéutico Certificado',
      'Certificación en Psicología Positiva',
      'Coach Profesional Certificado',
      'Especialización en PNL'
    ],
    languages: ['Español', 'Inglés'],
    rating: 4.9,
    reviews: 134,
    featured: true,
    sessionTypes: ['Terapia Individual', 'Coaching de Vida', 'Sesiones de Trabajo Corporal', 'Intensivos de Fin de Semana'],
    sessionDuration: '60-120 minutos',
    availability: 'Martes a Sábado 8:00 - 20:00',
    location: 'Valencia + Online',
    email: 'andrew@sanandodesdeelser.com',
    phone: '+34 600 345 678',
    testimonials: [
      {
        name: 'Laura P.',
        text: 'Andrew tiene un don para ir directo al corazón de los temas. Cada sesión es una revelación.',
        rating: 5
      },
      {
        name: 'Miguel A.',
        text: 'Su estilo directo pero amoroso me ayudó a romper patrones que llevaba años repitiendo.',
        rating: 5
      }
    ],
    achievements: [
      'Más de 1000 procesos terapéuticos completados',
      'Creador de talleres vivenciales únicos',
      'Facilitador internacional',
      'Colaborador en programas de desarrollo humano'
    ]
  }
];

export default function ExpertProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactForm, setShowContactForm] = useState(false);

  const expertId = parseInt(params.id as string);
  const expert = experts.find(e => e.id === expertId);

  const handleBackClick = useCallback(() => {
    router.back();
  }, [router]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleContactFormToggle = useCallback((show: boolean) => {
    setShowContactForm(show);
  }, []);

  if (!expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Experto no encontrado</h1>
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
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-3 text-blue-500" />
                  <span className="text-sm">{expert.sessionDuration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-3 text-blue-500" />
                  <span className="text-sm">{expert.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-3 text-blue-500" />
                  <span className="text-sm">{expert.reviews} personas atendidas</span>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Idiomas</h4>
                  <div className="flex flex-wrap gap-2">
                    {expert.languages.map((lang, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

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
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
                      <Phone className="mr-1" size={16} />
                      Llamar
                    </button>
                    <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center">
                      <Mail className="mr-1" size={16} />
                      Email
                    </button>
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
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
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
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">{expert.detailedBio}</p>
                  </div>

                  {/* Specialties */}
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

                  {/* Session Types */}
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

                  {/* Achievements */}
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
                </motion.div>
              )}

              {activeTab === 'experience' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Formación y Certificaciones</h2>
                  
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

                  {/* Availability */}
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
                      <div className="flex items-center">
                        <MapPin className="text-blue-500 mr-3" size={20} />
                        <div>
                          <div className="font-semibold text-gray-900">Modalidad</div>
                          <div className="text-gray-600">{expert.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'testimonials' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Lo que dicen nuestros clientes</h2>
                  
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
                      <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                      <div className="text-gray-600">Recomendarían</div>
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
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Mail className="text-blue-500 mr-4" size={24} />
                        <div>
                          <div className="font-semibold text-gray-900">Email</div>
                          <div className="text-gray-600">{expert.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Phone className="text-blue-500 mr-4" size={24} />
                        <div>
                          <div className="font-semibold text-gray-900">Teléfono</div>
                          <div className="text-gray-600">{expert.phone}</div>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <MapPin className="text-blue-500 mr-4" size={24} />
                        <div>
                          <div className="font-semibold text-gray-900">Ubicación</div>
                          <div className="text-gray-600">{expert.location}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                      <h3 className="text-xl font-bold mb-4">¿Listo para comenzar?</h3>
                      <p className="mb-6">Agenda tu consulta gratuita de 20 minutos para conocer cómo podemos ayudarte.</p>
                      <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
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
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
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