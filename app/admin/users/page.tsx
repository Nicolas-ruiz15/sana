'use client';

import React, { useState, useEffect } from 'react';
import RoleProtection from '@/components/RoleProtection';
import { motion } from 'framer-motion';
import {  
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  User,
  Mail,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Interfaces
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator' | 'editor';
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'moderator' | 'editor';
  active: boolean;
}

const UsersAdminDashboard = () => {
  // Estados
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole !== 'all') params.append('role', filterRole);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Funciones CRUD
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Usuario eliminado exitosamente');
        loadUsers();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          active: !currentStatus 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
        loadUsers();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError('Error al cambiar estado del usuario');
    } finally {
      setLoading(false);
    }
  };

  // Filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Cerrar mensajes
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getRoleConfig = (role: string) => {
    const roles = {
      admin: { label: 'Administrador', bg: 'bg-red-100', text: 'text-red-800', icon: ShieldCheck },
      user: { label: 'Usuario', bg: 'bg-gray-100', text: 'text-gray-800', icon: User },
      moderator: { label: 'Moderador', bg: 'bg-blue-100', text: 'text-blue-800', icon: Shield },
      editor: { label: 'Editor', bg: 'bg-green-100', text: 'text-green-800', icon: Edit }
    };
    return roles[role as keyof typeof roles] || roles.user;
  };

  return (
    <RoleProtection requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-2">Administra los usuarios del panel de administración</p>
          </div>

          {/* Mensajes */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
            >
              <CheckCircle className="text-green-500 mr-2" size={20} />
              <span className="text-green-700">{success}</span>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
            >
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <span className="text-red-700">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </motion.div>
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
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="user">Usuarios</option>
                  <option value="moderator">Moderadores</option>
                  <option value="editor">Editores</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateUser}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Nuevo Usuario
              </button>
            </div>
          </div>

          {/* Users Table */}
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
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último acceso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha registro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => {
                      const roleConfig = getRoleConfig(user.role);
                      const RoleIcon = roleConfig.icon;
                      
                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {roleConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.lastLogin ? (
                              <div className="flex items-center">
                                <Clock size={14} className="text-gray-400 mr-1" />
                                {new Date(user.lastLogin).toLocaleDateString('es-ES')}
                              </div>
                            ) : (
                              <span className="text-gray-400">Nunca</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar size={14} className="text-gray-400 mr-1" />
                              {new Date(user.createdAt).toLocaleDateString('es-ES')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar usuario"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(user.id, user.active)}
                                className={`${user.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                title={user.active ? 'Desactivar usuario' : 'Activar usuario'}
                              >
                                {user.active ? <XCircle size={16} /> : <CheckCircle size={16} />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Eliminar usuario"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
  
            {/* Empty State */}
            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <User size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron usuarios</h3>
                <p className="text-gray-600">Intenta con otros términos de búsqueda o crea un nuevo usuario.</p>
              </div>
            )}
          </div>
        </div>
  
        {/* Modal */}
        {showModal && (
          <UserModal
            user={editingUser}
            onSave={loadUsers}
            onCancel={() => {
              setShowModal(false);
              setEditingUser(null);
            }}
            onError={setError}
            onSuccess={setSuccess}
          />
        )}
      </div>
    </RoleProtection>
  );
};

// Componente Modal
interface UserModalProps {
  user: User | null;
  onSave: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  onSave,
  onCancel,
  onError,
  onSuccess
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
    active: user?.active !== undefined ? user.active : true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      onError('Nombre y email son requeridos');
      return;
    }

    if (!user && !formData.password) {
      onError('La contraseña es requerida para nuevos usuarios');
      return;
    }

    try {
      setLoading(true);
      
      const url = user ? `/api/admin/users/${user.id}` : '/api/admin/users';
      const method = user ? 'PUT' : 'POST';
      
      const body: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        active: formData.active
      };

      if (formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(user ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
        onSave();
        onCancel();
      } else {
        onError(data.message);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      onError('Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {user ? 'Editar Usuario' : 'Crear Usuario'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña {!user && '*'}
                {user && <span className="text-gray-500 text-xs">(dejar vacío para mantener la actual)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!user}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user' | 'moderator' | 'editor'})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="moderator">Moderador</option>
                <option value="editor">Editor</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Los administradores tienen acceso completo al sistema
              </p>
            </div>

            {/* Estado */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                Usuario activo
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersAdminDashboard;