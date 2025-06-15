'use client';

import { useState, useEffect, useCallback } from 'react';
import RoleProtection from '@/components/RoleProtection';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2,
  Mail,
  MailOpen,
  MessageSquare,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Reply
} from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  excerpt: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  isReservation: boolean;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const filterMessages = useCallback(() => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter);
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/messages?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los mensajes');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Error al cargar los mensajes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchMessages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterMessages();
  }, [filterMessages]);

  const updateMessageStatus = async (id: number, newStatus: string) => {
    try {
      setUpdating(id);
      setError('');
      
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el mensaje');
      }

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev =>
          prev.map(message =>
            message.id === id
              ? { ...message, status: newStatus as any }
              : message
          )
        );
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      setError('Error al actualizar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setUpdating(null);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      setUpdating(id);
      setError('');
      
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el mensaje');
      }

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => prev.filter(message => message.id !== id));
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Error al eliminar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setUpdating(null);
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Marcar como leído si es nuevo
    if (message.status === 'new') {
      await updateMessageStatus(message.id, 'read');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Mail className="text-red-500" size={16} />;
      case 'read':
        return <MailOpen className="text-blue-500" size={16} />;
      case 'replied':
        return <CheckCircle className="text-green-500" size={16} />;
      default:
        return <MessageSquare className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      'new': 'Nuevo',
      'read': 'Leído',
      'replied': 'Respondido'
    };
    return statusTexts[status] || status;
  };

  const parseReservationInfo = (message: string) => {
    const lines = message.split('\n').filter(line => line.trim());
    const info: Record<string, string> = {};
    
    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':').map(s => s.trim());
        info[key] = value;
      }
    });
    
    return info;
  };

  if (loading) {
    return (
      <RoleProtection requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mensajes...</p>
          </div>
        </div>
      </RoleProtection>
    );
  }

  return (
    <RoleProtection requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestión de Mensajes
                </h1>
                <p className="text-gray-600">
                  Administra todos los mensajes de contacto y solicitudes
                </p>
              </div>
              <button
                onClick={fetchMessages}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
            >
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={20} />
                <span className="text-red-700">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MessageSquare className="text-gray-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Mail className="text-red-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nuevos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {messages.filter(m => m.status === 'new').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MailOpen className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Leídos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {messages.filter(m => m.status === 'read').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Respondidos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {messages.filter(m => m.status === 'replied').length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o mensaje..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los Estados</option>
                <option value="new">Nuevos</option>
                <option value="read">Leídos</option>
                <option value="replied">Respondidos</option>
              </select>
            </div>
          </motion.div>

          {/* Messages Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remitente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asunto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mensaje
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
                  {filteredMessages.map((message) => (
                    <tr key={message.id} className={`hover:bg-gray-50 ${message.status === 'new' ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="text-gray-600" size={14} />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {message.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {message.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {message.subject}
                          {message.isReservation && (
                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              Reserva
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {message.excerpt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          <span className="ml-1">{getStatusText(message.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(message.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewMessage(message)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver mensaje"
                          >
                            <Eye size={16} />
                          </button>

                          {message.status !== 'replied' && (
                            <button
                              onClick={() => updateMessageStatus(message.id, 'replied')}
                              disabled={updating === message.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Marcar como respondido"
                            >
                              {updating === message.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <Reply size={16} />
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => deleteMessage(message.id)}
                            disabled={updating === message.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Eliminar"
                          >
                            {updating === message.id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MessageSquare size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron mensajes</h3>
                <p className="text-gray-600">
                  {messages.length === 0 
                    ? 'No hay mensajes registrados aún.' 
                    : 'Intenta ajustar tus criterios de búsqueda.'
                  }
                </p>
              </div>
            )}
          </motion.div>

          {/* Modal for Message Details */}
          {showModal && selectedMessage && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Detalles del Mensaje
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <p className="text-sm text-gray-900">{selectedMessage.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                          {getStatusIcon(selectedMessage.status)}
                          <span className="ml-1">{getStatusText(selectedMessage.status)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedMessage.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha</label>
                        <p className="text-sm text-gray-900">{new Date(selectedMessage.createdAt).toLocaleString('es-ES')}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Asunto</label>
                      <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                      {selectedMessage.isReservation ? (
                        <div className="mt-2 bg-purple-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-purple-900 mb-3">Información de Reserva:</h4>
                          <div className="space-y-2 text-sm">
                            {(() => {
                              const info = parseReservationInfo(selectedMessage.message);
                              return Object.entries(info).map(([key, value]) => (
                                <div key={key} className="flex">
                                  <span className="font-medium text-purple-800 w-1/3">{key}:</span>
                                  <span className="text-purple-700">{value}</span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cerrar
                    </button>

                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=Hola ${selectedMessage.name},%0D%0A%0D%0AGracias por contactarnos.%0D%0A%0D%0ASaludos,%0D%0AEquipo Sanando desde el Ser`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Responder por Email
                    </a>

                    {selectedMessage.status !== 'replied' && (
                      <button
                        onClick={() => {
                          updateMessageStatus(selectedMessage.id, 'replied');
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Marcar como Respondido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleProtection>
  );
}