'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import RoleProtection from '@/components/RoleProtection';
import {  
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  MapPin,
  Euro,
  Users,
  Save,
  X,
  AlertCircle,
  Star,
  CheckCircle
} from 'lucide-react';

// Interfaces
interface Retiro {
  id?: number;
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
  benefits?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  schedule?: Array<{
    day: string;
    title: string;
    activities: string[];
  }>;
  includes?: string[];
  notIncludes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  { value: 'transformacion', label: 'Transformación' },
  { value: 'sanacion', label: 'Sanación' },
  { value: 'espiritual', label: 'Espiritual' },
  { value: 'bienestar', label: 'Bienestar' }
];

const RetirosAdminDashboard = () => {
  // Estados
  const [retiros, setRetiros] = useState<Retiro[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingRetiro, setEditingRetiro] = useState<Retiro | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar retiros
  useEffect(() => {
    loadRetiros();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRetiros = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/admin/retiros?${params}`);
      const data = await response.json();

      if (data.success) {
        setRetiros(data.retiros);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error loading retiros:', error);
      setError('Error al cargar retiros');
    } finally {
      setLoading(false);
    }
  };

  // Funciones CRUD
  const handleCreateRetiro = () => {
    const newRetiro: Retiro = {
      title: '',
      description: '',
      fullDescription: '',
      location: '',
      date: '',
      price: 0,
      duration: '',
      category: 'transformacion',
      featured: false,
      imageUrl: '',
      maxParticipants: 20,
      currentParticipants: 0,
      status: 'draft',
      benefits: [],
      schedule: [],
      includes: [],
      notIncludes: []
    };
    setEditingRetiro(newRetiro);
    setShowEditor(true);
  };

  const handleEditRetiro = (retiro: Retiro) => {
    setEditingRetiro(retiro);
    setShowEditor(true);
  };

  const handleDeleteRetiro = async (retiroId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este retiro?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/retiros/${retiroId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setRetiros(retiros.filter(retiro => retiro.id !== retiroId));
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error deleting retiro:', error);
      setError('Error al eliminar retiro');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRetiro = async (retiro: Retiro) => {
    setLoading(true);
    setError('');
    
    try {
      const url = retiro.id ? `/api/admin/retiros/${retiro.id}` : '/api/admin/retiros';
      const method = retiro.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(retiro),
      });

      const data = await response.json();

      if (data.success) {
        await loadRetiros();
        setShowEditor(false);
        setEditingRetiro(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error saving retiro:', error);
      setError('Error al guardar retiro');
    } finally {
      setLoading(false);
    }
  };

  // Filtros
  const filteredRetiros = retiros.filter(retiro => {
    const matchesSearch = retiro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         retiro.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || retiro.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <RoleProtection requiredRole="editor">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Administración de Retiros</h1>
            <p className="text-gray-600 mt-2">Gestiona todos los retiros y experiencias transformadoras</p>
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
                    placeholder="Buscar retiros..."
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
                  <option value="archived">Archivados</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateRetiro}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Nuevo Retiro
              </button>
            </div>
          </div>

          {/* Retiros Table */}
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
                        Retiro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ubicación & Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio & Participantes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRetiros.map((retiro) => (
                      <tr key={retiro.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 relative">
                              <Image
                                src={retiro.imageUrl || '/images/default-retiro.jpg'}
                                alt={retiro.title}
                                fill
                                className="rounded-lg object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                {retiro.title}
                                {retiro.featured && (
                                  <Star className="ml-2 h-4 w-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {retiro.description.substring(0, 50)}...
                              </div>
                              <div className="text-xs text-gray-400">
                                {retiro.category} • {retiro.duration}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin size={14} className="text-gray-400 mr-1" />
                            {retiro.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={14} className="text-gray-400 mr-1" />
                            {retiro.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Euro size={14} className="text-gray-400 mr-1" />
                            {retiro.price}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users size={14} className="text-gray-400 mr-1" />
                            {retiro.currentParticipants}/{retiro.maxParticipants}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            retiro.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : retiro.status === 'archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {retiro.status === 'published' ? 'Publicado' : 
                             retiro.status === 'archived' ? 'Archivado' : 'Borrador'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditRetiro(retiro)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteRetiro(retiro.id!)}
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
          {filteredRetiros.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron retiros</h3>
              <p className="text-gray-600">Intenta con otros términos de búsqueda o crea un nuevo retiro.</p>
            </div>
          )}
        </div>

        {/* Editor Modal */}
        {showEditor && editingRetiro && (
          <RetiroEditor
            retiro={editingRetiro}
            categories={categories}
            onSave={handleSaveRetiro}
            onCancel={() => {
              setShowEditor(false);
              setEditingRetiro(null);
            }}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </RoleProtection>
  );
};

// Componente Editor (continuará en el siguiente artifact)
interface RetiroEditorProps {
  retiro: Retiro;
  categories: Array<{value: string; label: string}>;
  onSave: (retiro: Retiro) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
}

const RetiroEditor: React.FC<RetiroEditorProps> = ({
  retiro,
  categories,
  onSave,
  onCancel,
  loading,
  error
}) => {
  const [formData, setFormData] = useState(retiro);

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.location || !formData.date || !formData.price) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {retiro.id ? 'Editar Retiro' : 'Crear Nuevo Retiro'}
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Corta *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Completa
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción detallada del retiro..."
                />
              </div>

              {/* Location and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    placeholder="27 Sep - 3 Oct 2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="7 días"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Includes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incluye (una línea por item)
                </label>
                <textarea
                  value={formData.includes?.join('\n') || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    includes: e.target.value.split('\n').filter(item => item.trim())
                  })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Alojamiento completo&#10;Todas las comidas&#10;Material didáctico"
                />
              </div>

              {/* Not Includes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Incluye (una línea por item)
                </label>
                <textarea
                  value={formData.notIncludes?.join('\n') || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    notIncludes: e.target.value.split('\n').filter(item => item.trim())
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Transporte hasta el lugar&#10;Gastos personales&#10;Seguro de viaje"
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
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published' | 'archived'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
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
                      Retiro destacado
                    </label>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Participantes
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: Number(e.target.value)})}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      width={200}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
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

export default RetirosAdminDashboard;