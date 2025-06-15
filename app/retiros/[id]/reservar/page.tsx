'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone
} from 'lucide-react';
import Link from 'next/link';

// Tipo para el evento
type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  image_url: string;
};

// Datos de los retiros
const allEvents: Event[] = [
  {
    id: 1,
    title: 'Retiro de Transformación Profunda',
    date: '27 Sep - 3 Oct 2025',
    location: 'Valencia, España',
    price: 1299,
    duration: '7 días',
    maxParticipants: 20,
    currentParticipants: 12,
    image_url: '/images/albufera.jpg'
  },
	{
    id: 2,
    title: 'Retiro de Sanación Emocional',
    date: '30 Nov - 3 Dec 2025',
    location: 'Ibiza, España',
    price: 399,
    duration: '3 días',
    maxParticipants: 15,
    currentParticipants: 8,
    image_url: '/images/ibiza.jpg'
  },
  {
    id: 3,
    title: 'Despertar Espiritual',
    date: '5 Abril - 7 Abril 2025',
    location: 'Cadiz, España',
    price: 499,
    duration: '3 días',
    maxParticipants: 15,
    currentParticipants: 8,
    image_url: '/images/cadiz.jpg'
  }
];

// Tipos de habitación
const roomTypes = [
  {
    id: 'shared',
    name: 'Habitación Compartida',
    description: 'Habitación doble con baño compartido',
    price: 0,
    features: ['Cama individual', 'Baño compartido', 'Escritorio', 'Armario']
  },
  {
    id: 'private',
    name: 'Habitación Individual',
    description: 'Habitación privada con baño propio',
    price: 200,
    features: ['Cama doble', 'Baño privado', 'Escritorio', 'Armario', 'Balcón']
  },
  {
    id: 'suite',
    name: 'Suite Premium',
    description: 'Suite con sala de estar y vistas panorámicas',
    price: 400,
    features: ['Cama king size', 'Baño premium', 'Sala de estar', 'Balcón privado', 'Minibar']
  }
];

// Opciones adicionales
const additionalOptions = [
  {
    id: 'transport',
    name: 'Transporte desde el aeropuerto',
    description: 'Traslado ida y vuelta desde el aeropuerto más cercano',
    price: 50
  },
  {
    id: 'massage',
    name: 'Sesión de masaje terapéutico',
    description: 'Sesión individual de 60 minutos con terapeuta certificado',
    price: 80
  },
  {
    id: 'nutrition',
    name: 'Consulta nutricional personalizada',
    description: 'Plan nutricional personalizado para después del retiro',
    price: 60
  },
  {
    id: 'materials',
    name: 'Kit de materiales premium',
    description: 'Cuaderno, cristales, aceites esenciales y más',
    price: 40
  }
];

interface FormData {
  // Información personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  nationality: string;

  // Información de emergencia
  emergencyContact: string;
  emergencyPhone: string;

  // Preferencias del retiro
  roomType: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  experience: string;
  motivation: string;

  // Opciones adicionales
  additionalOptions: string[];

  // Información de pago
  paymentMethod: string;

  // Términos y condiciones
  terms: boolean;
  newsletter: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function ReservaPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    nationality: '',
    emergencyContact: '',
    emergencyPhone: '',
    roomType: 'shared',
    dietaryRestrictions: '',
    medicalConditions: '',
    experience: '',
    motivation: '',
    additionalOptions: [],
    paymentMethod: 'card',
    terms: false,
    newsletter: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    if (!params.id) return;

    const eventId = parseInt(params.id as string);
    const foundEvent = allEvents.find(e => e.id === eventId);
    setEvent(foundEvent || null);
  }, [params.id]);

  // Validación en tiempo real
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length < 2 ? 'Debe tener al menos 2 caracteres' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Email inválido' : '';
      case 'phone':
      case 'emergencyPhone':
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
        return !phoneRegex.test(value) ? 'Teléfono inválido' : '';
      case 'birthDate':
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        return age < 18 ? 'Debes ser mayor de 18 años' : '';
      case 'nationality':
      case 'emergencyContact':
        return value.trim().length < 2 ? 'Campo requerido' : '';
      case 'motivation':
        return value.trim().length < 10 ? 'Describe brevemente tus expectativas (mínimo 10 caracteres)' : '';
      default:
        return '';
    }
  };

  // Validación por pasos
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Validar información personal
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'nationality', 'emergencyContact', 'emergencyPhone'];
      
      requiredFields.forEach(field => {
        const value = formData[field as keyof FormData] as string;
        if (!value.trim()) {
          newErrors[field] = 'Campo requerido';
        } else {
          const fieldError = validateField(field, value);
          if (fieldError) {
            newErrors[field] = fieldError;
          }
        }
      });
    }

    if (step === 2) {
      // Validar preferencias del retiro
      if (!formData.motivation.trim()) {
        newErrors.motivation = 'Campo requerido';
      } else {
        const motivationError = validateField('motivation', formData.motivation);
        if (motivationError) {
          newErrors.motivation = motivationError;
        }
      }
    }

    if (step === 4) {
      // Validar términos y condiciones
      if (!formData.terms) {
        newErrors.terms = 'Debes aceptar los términos y condiciones';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'additionalOptions') {
        setFormData(prev => ({
          ...prev,
          additionalOptions: checked 
            ? [...prev.additionalOptions, value]
            : prev.additionalOptions.filter(option => option !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Validación en tiempo real
      if (value.trim()) {
        const fieldError = validateField(name, value);
        setErrors(prev => ({
          ...prev,
          [name]: fieldError
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTotal = () => {
    if (!event) return 0;

    let total = event.price;

    // Agregar precio de habitación
    const selectedRoom = roomTypes.find(room => room.id === formData.roomType);
    if (selectedRoom) {
      total += selectedRoom.price;
    }

    // Agregar opciones adicionales
    formData.additionalOptions.forEach(optionId => {
      const option = additionalOptions.find(opt => opt.id === optionId);
      if (option) {
        total += option.price;
      }
    });

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    // Validar todos los pasos
    let isValid = true;
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      setSubmitError('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Generar número de reserva único
      const reservationNumber = `RET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const reservationData = {
        ...formData,
        eventId: event.id,
        eventTitle: event.title,
        totalPrice: calculateTotal(),
        reservationDate: new Date().toISOString(),
        reservationNumber
      };

      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
      } else {
        throw new Error(result.message || 'Error al procesar la reserva');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setSubmitError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del retiro...</p>
        </div>
      </div>
    );
  }

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Reserva Confirmada!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu reserva para &quot;{event.title}&quot; ha sido procesada exitosamente.
            Recibirás un email de confirmación con todos los detalles.
          </p>
          <div className="space-y-3">
            <Link
              href="/retiros"
              className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Ver Otros Retiros
            </Link>
            <Link
              href="/"
              className="block text-blue-600 hover:text-blue-700 font-medium"
            >
              Volver al Inicio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error en la Reserva
          </h2>
          <p className="text-gray-600 mb-6">
            {submitError || 'Ha ocurrido un error al procesar tu reserva. Por favor, inténtalo de nuevo.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setSubmitStatus('idle');
                setSubmitError('');
              }}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Intentar de Nuevo
            </button>
            <Link
              href="/retiros"
              className="block text-blue-600 hover:text-blue-700 font-medium"
            >
              Volver a Retiros
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const availableSpots = event.maxParticipants - event.currentParticipants;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/retiros/${event.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a Detalles
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Reservar: {event.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {availableSpots} plazas disponibles
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 text-right">
                <div className="text-2xl font-bold text-blue-600">
                  €{calculateTotal()}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-600">
              Paso {currentStep} de 4: {
                currentStep === 1 ? 'Información Personal' :
                currentStep === 2 ? 'Preferencias del Retiro' :
                currentStep === 3 ? 'Opciones Adicionales' :
                'Confirmación y Pago'
              }
            </div>
          </div>
        </div>

        {/* Error General */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-3" size={20} />
              <p className="text-red-800">{submitError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="mr-3 text-blue-600" size={24} />
                  Información Personal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      required
                      value={formData.birthDate}
                      onChange={handleChange}
                      max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.birthDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.birthDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nacionalidad *
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      required
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="Española"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.nationality ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.nationality && (
                      <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contacto de Emergencia *
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      required
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="Nombre completo"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.emergencyContact ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.emergencyContact && (
                      <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono de Emergencia *
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      required
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.emergencyPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.emergencyPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Retreat Preferences */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Preferencias del Retiro
                </h2>

                {/* Room Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Tipo de Habitación *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {roomTypes.map((room) => (
                      <div
                        key={room.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.roomType === room.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, roomType: room.id }))}
                      >
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            name="roomType"
                            value={room.id}
                            checked={formData.roomType === room.id}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <h3 className="font-semibold">{room.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                        <div className="text-lg font-bold text-blue-600">
                          {room.price === 0 ? 'Incluido' : `+€${room.price}`}
                        </div>
                        <ul className="text-xs text-gray-500 mt-2">
                          {room.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restricciones Dietéticas
                    </label>
                    <textarea
                      name="dietaryRestrictions"
                      rows={3}
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      placeholder="Vegetariano, vegano, alergias, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condiciones Médicas
                    </label>
                    <textarea
                      name="medicalConditions"
                      rows={3}
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      placeholder="Cualquier condición médica que debamos conocer"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiencia Previa
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona tu nivel</option>
                    <option value="ninguna">Sin experiencia previa</option>
                    <option value="basica">Experiencia básica</option>
                    <option value="intermedia">Experiencia intermedia</option>
                    <option value="avanzada">Experiencia avanzada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué esperas de este retiro? *
                  </label>
                  <textarea
                    name="motivation"
                    required
                    rows={4}
                    value={formData.motivation}
                    onChange={handleChange}
                    placeholder="Comparte tus expectativas y objetivos..."
                    className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.motivation ? 'border-red-300' : 'border-gray-300'
                    }`}
                  ></textarea>
                  {errors.motivation && (
                    <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Additional Options */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Opciones Adicionales
                </h2>

                <div className="space-y-4">
                  {additionalOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 ${
                        formData.additionalOptions.includes(option.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          name="additionalOptions"
                          value={option.id}
                          checked={formData.additionalOptions.includes(option.id)}
                          onChange={handleChange}
                          className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{option.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                            </div>
                            <div className="text-lg font-bold text-blue-600 ml-4">
                              +€{option.price}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Resumen de Precios</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Precio base del retiro:</span>
                      <span>€{event.price}</span>
                    </div>
                    {formData.roomType !== 'shared' && (
                      <div className="flex justify-between">
                        <span>Suplemento habitación:</span>
                        <span>+€{roomTypes.find(r => r.id === formData.roomType)?.price || 0}</span>
                      </div>
                    )}
                    {formData.additionalOptions.map(optionId => {
                      const option = additionalOptions.find(opt => opt.id === optionId);
                      return option ? (
                        <div key={optionId} className="flex justify-between">
                          <span>{option.name}:</span>
                          <span>+€{option.price}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-blue-600">€{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment and Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="mr-3 text-blue-600" size={24} />
                  Confirmación y Pago
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="text-blue-600 mr-3 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-blue-900">Información Importante</h3>
                      <p className="text-blue-800 text-sm mt-1">
                        Al confirmar tu reserva, recibirás un email con las instrucciones de pago. 
                        Tu plaza quedará reservada por 48 horas para completar el pago.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago Preferido
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Tarjeta de crédito/débito</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={formData.paymentMethod === 'transfer'}
                        onChange={handleChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Transferencia bancaria</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="installments"
                        checked={formData.paymentMethod === 'installments'}
                        onChange={handleChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Pago en cuotas (consultar condiciones)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Quiero recibir información sobre próximos retiros y contenido exclusivo
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="terms"
                      required
                      checked={formData.terms}
                      onChange={handleChange}
                      className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Acepto los <a href="/terms" className="text-blue-600 hover:underline">términos y condiciones</a>, 
                      la <a href="/privacy" className="text-blue-600 hover:underline">política de privacidad</a> y 
                      las <a href="/cancellation" className="text-blue-600 hover:underline">condiciones de cancelación</a> *
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-500 text-sm">{errors.terms}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Resumen de tu Reserva</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Retiro:</span>
                      <span className="font-medium">{event.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fechas:</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ubicación:</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participante:</span>
                      <span>{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Habitación:</span>
                      <span>{roomTypes.find(r => r.id === formData.roomType)?.name}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total a pagar:</span>
                      <span className="text-blue-600">€{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Anterior
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.terms}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2" size={16} />
                      Confirmar Reserva
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="text-green-600 mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-green-900">Reserva Segura</h3>
              <p className="text-green-800 text-sm">
                Tus datos están protegidos con encriptación SSL. No procesamos pagos directamente - 
                recibirás instrucciones seguras por email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}