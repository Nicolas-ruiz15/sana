'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Award, Target, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const team = [
  {
    name: 'Dr. Susana Gomez',
    role: 'Life coach, Escritora y Educadora ',
    image: '/images/susana.png',
    bio: 'Dra. Muchos años trabajando'
  },
  {
    name: 'Cesar Angel',
    role: 'Coach ontologico, Mentor, Terapeuta Emocional , Experto en Ansiedad, Coanch Organizacional y Laboral',
    image: '/images/cesar.jpg',
    bio: 'muchos años trabajando'
  },
  {
    name: 'Andrew Guerra',
    role: 'Terapeuta gestáltico, coach, mentor, creador y provocador de resultados',
    image: '/images/andrew.jpeg',
    bio: 'muchos años trabajando'
  }
];

const values = [
  {
    icon: Heart,
    title: 'Compassion',
    description: 'We approach every interaction with kindness and understanding, creating a safe space for growth and healing.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in the power of connection and support, fostering a community of practitioners who learn together.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in our programs, ensuring evidence-based practices and expert instruction.'
  },
  {
    icon: Target,
    title: 'Accessibility',
    description: 'We strive to make sanando desde el ser accessible to everyone, regardless of background or experience level.'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Global sanando desde el ser
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Dedicated to making sanando desde el ser accessible to everyone through 
              evidence-based programs and compassionate instruction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At Global sanando desde el ser, we believe that everyone deserves access to the 
                transformative power of sanando desde el ser. Our mission is to provide high-quality, 
                evidence-based sanando desde el ser programs that help individuals and organizations 
                reduce stress, enhance well-being, and cultivate greater awareness and compassion.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Founded in 2012, we have helped over 10,000 people discover the benefits 
                of sanando desde el ser through our comprehensive programs, expert instruction, and 
                supportive community.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="text-blue-600 mr-3" size={20} />
                  <span className="text-gray-700">Evidence-based programs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-blue-600 mr-3" size={20} />
                  <span className="text-gray-700">Expert certified instructors</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-blue-600 mr-3" size={20} />
                  <span className="text-gray-700">Supportive learning environment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-blue-600 mr-3" size={20} />
                  <span className="text-gray-700">Flexible online and in-person options</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-96">
                <Image 
                  src='/images/logo.png'
                  alt="sanando desde el ser meditation group"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we serve our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                  <value.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our experienced team of sanando desde el ser experts is dedicated to supporting 
              your journey to greater well-being.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative h-64">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our community of practitioners and discover the transformative power of sanando desde el ser.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/programs"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Explore Programs
              </a>
              <a 
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}