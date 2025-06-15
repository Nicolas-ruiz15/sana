'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import EventCard from '@/components/EventCard';
import Image from 'next/image';

interface Retiro {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  location: string;
  date: string;
  price: number;
  duration: string;
  category: string;
  featured: boolean;
  imageUrl: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'draft' | 'published' | 'archived';
}

const categories = [
  { value: 'all', label: 'Todas las Categorías' },
  { value: 'transformacion', label: 'Transformación' },
  { value: 'sanacion', label: 'Sanación' },
  { value: 'espiritual', label: 'Espiritual' },
  { value: 'bienestar', label: 'Bienestar' }
];

export default function RetirosPage() {
  const [retiros, setRetiros] = useState<Retiro[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRetiros = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      params.append('status', 'published'); // Solo traer retiros publicados

      const response = await fetch(`/api/admin/retiros?${params.toString()}`);
      if (!response.ok) throw new Error('Error al cargar retiros');

      const data = await response.json();
      if (data.success) {
        setRetiros(data.retiros);
      } else {
        setError(data.message || 'Error desconocido');
        setRetiros([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setRetiros([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchRetiros();
  }, [fetchRetiros]);

  const featuredRetiros = retiros.filter(r => r.featured);
  const regularRetiros = retiros.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestros Retiros
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre experiencias transformadoras diseñadas para reconectarte con tu esencia más auténtica y liberar tu máximo potencial.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar retiros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando retiros...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {/* Featured Retiros */}
        {!loading && !error && featuredRetiros.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Retiros Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRetiros.map((retiro) => (
                <EventCard
                  key={retiro.id}
                  featured
                  event={{
                    ...retiro,
                    image_url: retiro.imageUrl
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Regular Retiros */}
        {!loading && !error && regularRetiros.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Todos los Retiros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularRetiros.map((retiro) => (
                <EventCard
                  key={retiro.id}
                  event={{
                    ...retiro,
                    image_url: retiro.imageUrl
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {!loading && !error && retiros.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron retiros</h3>
            <p className="text-gray-600">Intenta ajustar tus criterios de búsqueda o filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
