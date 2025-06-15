'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  fullDescription?: string;
  image_url?: string;
  imageUrl?: string; // Para compatibilidad con la API
  price: number;
  duration: string;
  category: string;
  featured: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  benefits?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

interface EventCardProps {
  event: Event;
  featured?: boolean;
  index?: number;
}

export default function EventCard({ event, featured = false, index = 0 }: EventCardProps) {
  // Compatibilidad con diferentes nombres de campos de imagen
  const imageUrl = event.image_url || event.imageUrl || '/images/default-retiro.jpg';
  
  // Calcular plazas disponibles si los datos están disponibles
  const availableSpots = event.maxParticipants && event.currentParticipants !== undefined 
    ? event.maxParticipants - event.currentParticipants 
    : null;

  if (featured) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2 relative">
            <div className="relative h-64 md:h-full">
              <Image
                src={imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={featured}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Destacado
                </span>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="md:w-1/2 p-8">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="mr-1" size={16} />
              {event.date}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MapPin className="mr-1" size={16} />
              {event.location}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>
            <p className="text-gray-700 mb-6">{event.description}</p>
            
            {event.fullDescription && (
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-600 mb-6">
                &ldquo;{event.fullDescription}&rdquo;
              </blockquote>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold text-blue-600">
                €{event.price}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="mr-1" size={16} />
                {event.duration}
              </div>
            </div>
            
            {availableSpots !== null && (
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Users className="mr-1" size={16} />
                {availableSpots} plazas disponibles
              </div>
            )}
            
            <div className="flex gap-4">
              <Link
                href={`/retiros/${event.id}`}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Ver Alojamiento
              </Link>
              <Link
                href={`/retiros/${event.id}/reservar`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Reservar Plaza
              </Link>
            </div>
          </div>
        </div>
        
        {/* Benefits Section */}
        {event.benefits && event.benefits.length > 0 && (
          <div className="bg-gray-50 p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Durante {event.duration} de inmersión total
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {event.benefits.map((benefit, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h5 className="font-semibold text-gray-900 mb-2">{benefit.title}</h5>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {event.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Destacado
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="mr-1" size={16} />
          {event.date}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin className="mr-1" size={16} />
          {event.location}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
        <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold text-blue-600">
            €{event.price}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="mr-1" size={16} />
            {event.duration}
          </div>
        </div>
        
        {availableSpots !== null && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Users className="mr-1" size={16} />
            {availableSpots} plazas disponibles
          </div>
        )}
        
        <div className="flex gap-3">
          <Link
            href={`/retiros/${event.id}`}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 text-center"
          >
            Ver Detalles
          </Link>
          <Link
            href={`/retiros/${event.id}/reservar`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
          >
            Reservar
          </Link>
        </div>
      </div>
    </motion.div>
  );
}