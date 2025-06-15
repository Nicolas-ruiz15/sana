'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image_url: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
    className="bg-white rounded-lg shadow-lg p-6 h-full"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    >
    <div className="flex items-center mb-4">
    {[...Array(testimonial.rating)].map((_, i) => (
    <Star key={i} className="text-yellow-400" size={20} fill="currentColor" />
    ))}
    </div>
    
    <blockquote className="text-gray-700 mb-6 italic">
    &ldquo;{testimonial.content}&rdquo;
    </blockquote>
    
    <div className="flex items-center">
    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 relative">
    <Image
    src={testimonial.image_url}
    alt={`Foto de ${testimonial.name}`}
    fill
    className="object-cover"
    sizes="48px"
    />
    </div>
    <div>
    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
    <p className="text-gray-600 text-sm">{testimonial.role}</p>
    </div>
    </div>
    </motion.div>
  );
}