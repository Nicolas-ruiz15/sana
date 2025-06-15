'use client';

import React, { useState, useEffect } from 'react';
import RoleProtection from '@/components/RoleProtection';
import Image from 'next/image';
import {  
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  Tag,
  Save,
  X,
  Upload,
  AlertCircle
} from 'lucide-react';

// Tipos actualizados para coincidir con la API
interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_name?: string;
  author_id: number;
  published_at: string;
  category_name?: string;
  category_id: number;
  tags?: string[];
  read_time: string;
  featured: boolean;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

interface Author {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const BlogAdminDashboard = () => {
  // Estados
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar posts, autores y categorías en paralelo
      const [postsRes, authorsRes, categoriesRes] = await Promise.all([
        fetch('/api/blog-posts'),
        fetch('/api/authors'),
        fetch('/api/categories')
      ]);

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }

      if (authorsRes.ok) {
        const authorsData = await authorsRes.json();
        setAuthors(authorsData);
      } else {
        // Datos por defecto si no hay API de autores
        setAuthors([
          { id: 1, name: 'Dra. Susana Gomez' },
          { id: 2, name: 'Cesar Angel' },
          { id: 3, name: 'Andrew Guerra' }
        ]);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } else {
        // Datos por defecto si no hay API de categorías
        setCategories([
          { id: 1, name: 'Neuroplasticidad' },
          { id: 2, name: 'Sanación Emocional' },
          { id: 3, name: 'Movimiento Consciente' },
          { id: 4, name: 'Espiritualidad' },
          { id: 5, name: 'Liberación Familiar' },
          { id: 6, name: 'Autoconocimiento' }
        ]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Error al cargar los datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  // Funciones CRUD integradas con la API
  const handleCreatePost = () => {
    const newPost: BlogPost = {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      author_id: authors[0]?.id || 1,
      published_at: new Date().toISOString().split('T')[0],
      category_id: categories[0]?.id || 1,
      tags: [],
      read_time: '5 min',
      featured: false,
      status: 'draft'
    };
    setEditingPost(newPost);
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/blog-posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        const error = await response.json();
        setError('Error al eliminar el post: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Error al eliminar el post');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (post: BlogPost) => {
    setLoading(true);
    setError('');
    
    try {
      // Preparar datos para enviar a la API
      const postData = {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featured_image: post.featured_image || '/images/default-blog.jpg',
        author_id: post.author_id,
        category_id: post.category_id,
        status: post.status,
        featured: post.featured,
        read_time: post.read_time
      };

      let response;
      
      if (post.id) {
        // Actualizar post existente
        response = await fetch(`/api/blog-posts/${post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      } else {
        // Crear nuevo post
        response = await fetch('/api/blog-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      }

      if (response.ok) {
        // Recargar la lista de posts
        await loadInitialData();
        setShowEditor(false);
        setEditingPost(null);
      } else {
        const error = await response.json();
        setError('Error al guardar el post: ' + error.error);
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Error al guardar el post');
    } finally {
      setLoading(false);
    }
  };

  // Filtros
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <RoleProtection requiredRole="editor">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Administración del Blog</h1>
            <p className="text-gray-600 mt-2">Gestiona todos los artículos de tu blog</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Borradores</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreatePost}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Nuevo Post
              </button>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Autor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Image
                                src={post.featured_image || '/images/default-blog.jpg'}
                                alt={post.title}
                                fill
                                className="rounded-lg object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {post.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {post.excerpt.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{post.author_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Tag size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{post.category_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' ? 'Publicado' : 'Borrador'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {new Date(post.published_at).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron posts</h3>
              <p className="text-gray-600">Intenta con otros términos de búsqueda o crea un nuevo post.</p>
            </div>
          )}
        </div>

        {/* Editor Modal */}
        {showEditor && editingPost && (
          <PostEditor
            post={editingPost}
            authors={authors}
            categories={categories}
            onSave={handleSavePost}
            onCancel={() => {
              setShowEditor(false);
              setEditingPost(null);
            }}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </RoleProtection>
  );
};

// Componente Editor actualizado
interface PostEditorProps {
  post: BlogPost;
  authors: Author[];
  categories: Category[];
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
}

const PostEditor: React.FC<PostEditorProps> = ({
  post,
  authors,
  categories,
  onSave,
  onCancel,
  loading,
  error
}) => {
  const [formData, setFormData] = useState(post);
  const [tagsInput, setTagsInput] = useState(post.tags?.join(', ') || '');

  const handleSubmit = () => {
    // Validación básica
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    // Procesar tags
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    // Encontrar autor y categoría
    const selectedAuthor = authors.find(a => a.id === formData.author_id);
    const selectedCategory = categories.find(c => c.id === formData.category_id);
    
    const updatedPost = {
      ...formData,
      tags,
      author_name: selectedAuthor?.name || '',
      category_name: selectedCategory?.name || ''
    };
    
    onSave(updatedPost);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {post.id ? 'Editar Post' : 'Crear Nuevo Post'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extracto *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Puedes usar HTML para formatear el contenido..."
                  required
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Featured */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Publicación</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                      Artículo destacado
                    </label>
                  </div>
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autor
                </label>
                <select
                  value={formData.author_id}
                  onChange={(e) => setFormData({...formData, author_id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {authors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separa los tags con comas</p>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen destacada
                </label>
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de lectura
                </label>
                <input
                  type="text"
                  value={formData.read_time}
                  onChange={(e) => setFormData({...formData, read_time: e.target.value})}
                  placeholder="5 min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save size={16} className="mr-2" />
              )}
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAdminDashboard;