'use client';

import { useState, useEffect, useCallback } from 'react';
import RoleProtection from '@/components/RoleProtection';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  Phone,
  Calendar,
  Euro,
  Users,
  AlertTriangle,
  RefreshCw,
  FileText
} from 'lucide-react';

interface Reservation {
  id: number;
  reservationNumber: string;
  eventId: number;
  eventTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  nationality: string;
  emergencyContact: string;
  emergencyPhone: string;
  roomType: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  experience: string;
  motivation: string;
  additionalOptions: string;
  paymentMethod: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  newsletter: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const filterReservations = useCallback(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter]);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [filterReservations]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/admin/reservations');
      
      if (!response.ok) {
        throw new Error('Error al cargar las reservas');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReservations(data.reservations);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Error al cargar las reservas. Por favor, intenta de nuevo.');
      
      // Datos de ejemplo si falla la API
      const sampleReservations: Reservation[] = [
        {
          id: 1,
          reservationNumber: 'RET-SAMPLE-001',
          eventId: 1,
          eventTitle: 'Retiro de Transformación Profunda',
          firstName: 'María',
          lastName: 'González',
          email: 'maria@ejemplo.com',
          phone: '+34 600 000 001',
          birthDate: '1985-03-15',
          nationality: 'Española',
          emergencyContact: 'Juan González',
          emergencyPhone: '+34 600 000 002',
          roomType: 'private',
          dietaryRestrictions: '',
          medicalConditions: '',
          experience: 'Principiante',
          motivation: 'Busco reconectar conmigo misma',
          additionalOptions: '[]',
          paymentMethod: 'card',
          totalPrice: 1299,
          status: 'confirmed',
          newsletter: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setReservations(sampleReservations);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: number, newStatus: string) => {
    try {
      setUpdating(id);
      setError('');
      
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la reserva');
      }

      const data = await response.json();
      
      if (data.success) {
        setReservations(prev =>
          prev.map(reservation =>
            reservation.id === id
              ? { ...reservation, status: newStatus as any, updatedAt: new Date().toISOString() }
              : reservation
          )
        );
        console.log(`Reserva ${newStatus} actualizada exitosamente`);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      setError('Error al actualizar la reserva. Por favor, intenta de nuevo.');
    } finally {
      setUpdating(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Número de Reserva',
      'Nombre Completo',
      'Email',
      'Teléfono',
      'Retiro',
      'Tipo de Habitación',
      'Precio Total',
      'Estado',
      'Método de Pago',
      'Newsletter',
      'Fecha de Reserva',
      'Última Actualización'
    ];

    const csvData = filteredReservations.map(reservation => [
      reservation.reservationNumber,
      `${reservation.firstName} ${reservation.lastName}`,
      reservation.email,
      reservation.phone,
      reservation.eventTitle,
      getRoomTypeName(reservation.roomType),
      `€${reservation.totalPrice}`,
      getStatusText(reservation.status),
      getPaymentMethodText(reservation.paymentMethod),
      reservation.newsletter ? 'Sí' : 'No',
      new Date(reservation.createdAt).toLocaleDateString('es-ES'),
      new Date(reservation.updatedAt).toLocaleDateString('es-ES')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelled': return <XCircle className="text-red-500" size={16} />;
      case 'completed': return <CheckCircle className="text-blue-500" size={16} />;
      default: return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada',
      'completed': 'Completada'
    };
    return statusTexts[status] || status;
  };

  const getRoomTypeName = (roomType: string) => {
    const types: Record<string, string> = {
      'shared': 'Compartida',
      'private': 'Individual',
      'suite': 'Suite Premium'
    };
    return types[roomType] || roomType;
  };

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      'card': 'Tarjeta',
      'transfer': 'Transferencia',
      'installments': 'A plazos'
    };
    return methods[method] || method;
  };

  const calculateTotalRevenue = () => {
    return reservations
      .filter(r => r.status === 'confirmed' || r.status === 'completed')
      .reduce((sum, r) => sum + r.totalPrice, 0);
  };

  if (loading) {
    return (
      <RoleProtection requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reservas...</p>
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
                  Panel de Administración - Reservas
                </h1>
                <p className="text-gray-600">
                  Gestiona todas las reservas de retiros desde aquí
                </p>
              </div>
              <button
                onClick={fetchReservations}
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
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
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reservations.filter(r => r.status === 'pending').length}
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reservations.filter(r => r.status === 'confirmed').length}
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Euro className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingresos Confirmados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{calculateTotalRevenue().toLocaleString()}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, número de reserva..."
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
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="cancelled">Canceladas</option>
                <option value="completed">Completadas</option>
              </select>

              <button
                onClick={exportToCSV}
                disabled={filteredReservations.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} className="mr-2" />
                Exportar CSV ({filteredReservations.length})
              </button>
            </div>
          </motion.div>

          {/* Reservations Table */}
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
                      Reserva
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Retiro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
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
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.reservationNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {reservation.firstName} {reservation.lastName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail size={12} className="mr-1" />
                              {reservation.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone size={12} className="mr-1" />
                              {reservation.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{reservation.eventTitle}</div>
                        <div className="text-sm text-gray-500">{getRoomTypeName(reservation.roomType)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          €{reservation.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getPaymentMethodText(reservation.paymentMethod)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="ml-1">{getStatusText(reservation.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(reservation.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>

                          {reservation.status === 'pending' && (
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                              disabled={updating === reservation.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Confirmar"
                            >
                              {updating === reservation.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </button>
                          )}

                          {reservation.status !== 'cancelled' && (
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                              disabled={updating === reservation.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Cancelar"
                            >
                              {updating === reservation.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReservations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron reservas</h3>
                <p className="text-gray-600">
                  {reservations.length === 0 
                    ? 'No hay reservas registradas aún.' 
                    : 'Intenta ajustar tus criterios de búsqueda.'
                  }
                </p>
              </div>
            )}
          </motion.div>

          {/* Modal for Reservation Details */}
          {showModal && selectedReservation && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Detalles de la Reserva
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
                        <label className="block text-sm font-medium text-gray-700">Número de Reserva</label>
                        <p className="text-sm text-gray-900 font-mono">{selectedReservation.reservationNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReservation.status)}`}>
                          {getStatusIcon(selectedReservation.status)}
                          <span className="ml-1">{getStatusText(selectedReservation.status)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <p className="text-sm text-gray-900">{selectedReservation.firstName} {selectedReservation.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nacionalidad</label>
                        <p className="text-sm text-gray-900">{selectedReservation.nationality}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedReservation.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="text-sm text-gray-900">{selectedReservation.phone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contacto de Emergencia</label>
                        <p className="text-sm text-gray-900">{selectedReservation.emergencyContact}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono de Emergencia</label>
                        <p className="text-sm text-gray-900">{selectedReservation.emergencyPhone}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Retiro</label>
                      <p className="text-sm text-gray-900">{selectedReservation.eventTitle}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo de Habitación</label>
                        <p className="text-sm text-gray-900">{getRoomTypeName(selectedReservation.roomType)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                        <p className="text-sm text-gray-900">{getPaymentMethodText(selectedReservation.paymentMethod)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Precio Total</label>
                        <p className="text-sm text-gray-900 font-semibold">€{selectedReservation.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    {selectedReservation.dietaryRestrictions && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Restricciones Dietéticas</label>
                        <p className="text-sm text-gray-900">{selectedReservation.dietaryRestrictions}</p>
                      </div>
                    )}

                    {selectedReservation.medicalConditions && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Condiciones Médicas</label>
                        <p className="text-sm text-gray-900">{selectedReservation.medicalConditions}</p>
                      </div>
                    )}

                    {selectedReservation.experience && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Experiencia</label>
                        <p className="text-sm text-gray-900">{selectedReservation.experience}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivación</label>
                      <p className="text-sm text-gray-900">{selectedReservation.motivation}</p>
                    </div>

                    {selectedReservation.additionalOptions && selectedReservation.additionalOptions !== '[]' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Opciones Adicionales</label>
                        <div className="text-sm text-gray-900">
                          {(() => {
                            try {
                              const options = JSON.parse(selectedReservation.additionalOptions);
                              const optionNames: Record<string, string> = {
                                'transport': 'Transporte',
                                'massage': 'Masajes',
                                'nutrition': 'Consulta Nutricional',
                                'materials': 'Materiales Adicionales'
                              };
                              return options.map((opt: string) => optionNames[opt] || opt).join(', ');
                            } catch {
                              return selectedReservation.additionalOptions;
                            }
                          })()}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Reserva</label>
                        <p className="text-sm text-gray-900">{new Date(selectedReservation.createdAt).toLocaleString('es-ES')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
                        <p className="text-sm text-gray-900">{new Date(selectedReservation.updatedAt).toLocaleString('es-ES')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Newsletter</label>
                        <p className="text-sm text-gray-900">{selectedReservation.newsletter ? 'Sí' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cerrar
                    </button>

                    {selectedReservation.status === 'pending' && (
                      <button
                        onClick={() => {
                          updateReservationStatus(selectedReservation.id, 'confirmed');
                          setShowModal(false);
                        }}
                        disabled={updating === selectedReservation.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {updating === selectedReservation.id ? (
                          <div className="flex items-center">
                            <RefreshCw size={16} className="animate-spin mr-2" />
                            Confirmando...
                          </div>
                        ) : (
                          'Confirmar Reserva'
                        )}
                      </button>
                    )}

                    {selectedReservation.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          updateReservationStatus(selectedReservation.id, 'completed');
                          setShowModal(false);
                        }}
                        disabled={updating === selectedReservation.id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {updating === selectedReservation.id ? (
                          <div className="flex items-center">
                            <RefreshCw size={16} className="animate-spin mr-2" />
                            Completando...
                          </div>
                        ) : (
                          'Marcar como Completada'
                        )}
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