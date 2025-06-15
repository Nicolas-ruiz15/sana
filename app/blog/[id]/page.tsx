'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, User, Tag, ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_name: string;
  published_at: string;
  category_name: string;
  read_time: string;
  featured: boolean;
  status: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const postId = params.id as string;
    fetchPost(postId);
  }, [params.id]);

  const fetchPost = async (id: string) => {
    try {
      setLoading(true);
      
      // Primero intentar por slug, luego por ID
      let response = await fetch(`/api/blog-posts/${id}`);
      
      if (!response.ok) {
        throw new Error('Post no encontrado');
      }

      const postData = await response.json();
      setPost(postData);
      
      // Cargar posts relacionados de la misma categoría
      if (postData.category_name) {
        const relatedResponse = await fetch(`/api/blog-posts?category=${postData.category_name}`);
        if (relatedResponse.ok) {
          const allPosts = await relatedResponse.json();
          // Filtrar el post actual y tomar solo 3
          const related = allPosts
            .filter((p: BlogPost) => p.id !== postData.id)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('No se pudo cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700">
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver al blog
            </Link>
            
            <div className="flex items-center text-blue-200 mb-4 flex-wrap">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mr-4 mb-2">
                {post.category_name}
              </span>
              <div className="flex items-center mb-2">
                <Calendar size={16} className="mr-2" />
                <span>{new Date(post.published_at).toLocaleDateString('es-ES')}</span>
                <span className="mx-2">•</span>
                <User size={16} className="mr-1" />
                <span>{post.author_name}</span>
                <span className="mx-2">•</span>
                <Clock size={16} className="mr-1" />
                <span>{post.read_time}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl">
              {post.excerpt}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative h-64 md:h-80">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8 md:p-12">
            {/* Article Body */}
            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share Buttons */}
            <div className="border-t border-gray-200 pt-8 mt-12">
              <div className="flex items-center justify-between flex-wrap">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Comparte este artículo
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook size={16} className="mr-2" />
                      Facebook
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      <Twitter size={16} className="mr-2" />
                      Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin size={16} className="mr-2" />
                      LinkedIn
                    </a>
                  </div>
                </div>

                {/* Author Info */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Escrito por</p>
                  <p className="font-semibold text-gray-900">{post.author_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Artículos Relacionados
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-40">
                    <Image
                      src={relatedPost.featured_image || '/images/default-blog.jpg'}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(relatedPost.published_at).toLocaleDateString('es-ES')}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedPost.read_time}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    
                    <Link
                      href={`/blog/${relatedPost.slug || relatedPost.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    >
                      Leer más
                      <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        )}

        {/* Newsletter CTA */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 mt-16 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            ¿Te gustó este artículo?
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
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .prose {
          color: #374151;
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #111827;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose h2 {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
        .prose h3 {
          font-size: 1.5rem;
          line-height: 2rem;
        }
        .prose h4 {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }
        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.75;
        }
        .prose ul, .prose ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        .prose strong {
          font-weight: 600;
          color: #111827;
        }
        .prose em {
          font-style: italic;
        }
        .prose blockquote {
          border-left: 4px solid #3B82F6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6B7280;
        }
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