'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Heart, CheckCircle } from 'lucide-react';

// Definir el tipo para el formulario
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  country: string;
  city: string;
  experience: string;
  interests: string[];
  motivation: string;
  medicalConditions: string;
  emergencyContact: string;
  emergencyPhone: string;
  newsletter: boolean;
  terms: boolean;
}

export default function RegistroPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    country: '',
    city: '',
    experience: '',
    interests: [],
    motivation: '',
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
    newsletter: true,
    terms: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const interests = [
    'Transformación Profunda',
    'Sanación Emocional',
    'Reconexión Espiritual',
    'Movimiento Consciente',
    'Autoconocimiento',
    'Liberación Familiar',
    'Neuroplasticidad',
    'Meditación'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'interests') {
        setFormData(prev => ({
          ...prev,
          interests: checked 
            ? [...prev.interests, value]
            : prev.interests.filter(interest => interest !== value)
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar datos reales a tu API
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FUNCIONES DE NAVEGACIÓN (FUERA DE handleSubmit)
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
            ¡Registro Completado!
          </h2>
          <p className="text-gray-600 mb-6">
            Gracias por registrarte. Nos pondremos en contacto contigo pronto para 
            ayudarte a encontrar el retiro perfecto para tu transformación.
          </p>
          <div className="space-y-3">
            <a
              href="/retiros"
              className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Explorar Retiros
            </a>
            <a
              href="/"
              className="block text-blue-600 hover:text-blue-700 font-medium"
            >
              Volver al Inicio
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Registro para Retiros
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Completa tu registro para acceder a nuestros retiros de transformación 
            y recibir información personalizada.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold $${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 $${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-600">
              Paso {currentStep} de 3: {
                currentStep === 1 ? 'Información Personal' :
                currentStep === 2 ? 'Intereses y Motivación' :
                'Información Adicional'
              }
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País *
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Interests and Motivation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Heart className="mr-3 text-blue-600" size={24} />
                  Intereses y Motivación
                </h2>

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
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Áreas de Interés (selecciona todas las que apliquen)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interests.map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          name="interests"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleChange}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué te motiva a participar en un retiro? *
                  </label>
                  <textarea
                    name="motivation"
                    required
                    rows={4}
                    value={formData.motivation}
                    onChange={handleChange}
                    placeholder="Comparte qué esperas lograr con esta experiencia..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="mr-3 text-blue-600" size={24} />
                  Información Adicional
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condiciones Médicas o Limitaciones
                  </label>
                  <textarea
                    name="medicalConditions"
                    rows={3}
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    placeholder="Describe cualquier condición médica o limitación física que debamos conocer..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      Acepto los <a href="/terms" className="text-blue-600 hover:underline">términos y condiciones</a> y la <a href="/privacy" className="text-blue-600 hover:underline">política de privacidad</a> *
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 $${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Anterior
              </button>

              {currentStep < 3 ? (
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
                      Enviando...
                    </>
                  ) : (
                    'Completar Registro'
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="bg-blue-50 rounded-lg p-6 mt-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Necesitas Ayuda?
          </h3>
          <p className="text-gray-600 mb-4">
            Si tienes alguna pregunta sobre el proceso de registro o nuestros retiros, 
            no dudes en contactarnos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Contactar Soporte
            </a>
            <a
              href="/expertos"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              Hablar con Experto
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}