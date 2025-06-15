'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, Tag, Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_name: string;
  author_id: number;
  published_at: string;
  category_name: string;
  category_id: number;
  tags?: string[];
  read_time: string;
  featured: boolean;
  status: 'draft' | 'published';
}

interface Category {
  id: number;
  name: string;
}

const categories = [
  'Todas',
  'Neuroplasticidad',
  'Sanación Emocional',
  'Movimiento Consciente',
  'Espiritualidad',
  'Liberación Familiar',
  'Autoconocimiento'
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'Todas') {
        params.append('category', selectedCategory);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/blog-posts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los posts');
      }

      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data); // Establecer directamente los posts filtrados
    } catch (err) {
      setError('Error al cargar los artículos');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  // Cargar posts desde la API
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Usar fetchPosts como dependencia

  // No necesitamos este useEffect separado ya que fetchPosts maneja el filtrado

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog de Transformación
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Artículos, reflexiones y guías prácticas para acompañarte en tu viaje 
            de crecimiento personal y transformación auténtica.
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
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Artículos Destacados
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-64">
                    <Image 
                      src={post.featured_image || '/images/default-blog.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Destacado
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar size={16} className="mr-2" />
                      <span>{new Date(post.published_at).toLocaleDateString('es-ES')}</span>
                      <span className="mx-2">•</span>
                      <User size={16} className="mr-1" />
                      <span>{post.author_name}</span>
                      <span className="mx-2">•</span>
                      <span>{post.read_time}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag size={16} className="text-blue-600 mr-1" />
                        <span className="text-sm text-blue-600 font-medium">
                          {post.category_name}
                        </span>
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug || post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      >
                        Leer más
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Todos los Artículos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-40">
                    <Image
                      src={post.featured_image || '/images/default-blog.jpg'} 
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(post.published_at).toLocaleDateString('es-ES')}</span>
                      <span className="mx-2">•</span>
                      <span>{post.read_time}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                        {post.category_name}
                      </span>
                      
                      <Link
                        href={`/blog/${post.slug || post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                      >
                        Leer
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron artículos</h3>
            <p className="text-gray-600">Intenta con otros términos de búsqueda o categorías.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 mt-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Quieres recibir nuestros artículos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Suscríbete a nuestro newsletter y recibe contenido exclusivo sobre 
            transformación personal directamente en tu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}