'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  Users,
  Calendar,
  Euro,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Activity,
  AlertTriangle,
  Shield,
  Lock,
  ArrowRight
} from 'lucide-react';

interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalBlogPosts: number;
  publishedPosts: number;
  totalMessages: number;
  newMessages: number;
}

// Tarjetas de acciones rápidas con permisos
const quickActions = [
  {
    title: 'Gestionar Usuarios',
    description: 'Crear y administrar usuarios del sistema',
    href: '/admin/users',
    icon: Users,
    color: 'bg-red-600',
    hoverColor: 'hover:bg-red-700',
    requiredRole: 'admin'
  },
  {
    title: 'Configuración',
    description: 'Ajustar configuración del sitio',
    href: '/admin/settings',
    icon: Shield,
    color: 'bg-gray-600',
    hoverColor: 'hover:bg-gray-700',
    requiredRole: 'admin'
  },
  {
    title: 'Crear Post',
    description: 'Escribir un nuevo artículo',
    href: '/admin/blog',
    icon: FileText,
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    requiredRole: 'editor'
  },
  {
    title: 'Revisar Mensajes',
    description: 'Gestionar mensajes de contacto',
    href: '/admin/messages',
    icon: MessageSquare,
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    requiredRole: 'moderator'
  },
  {
    title: 'Ver Reservas',
    description: 'Gestionar reservas de retiros',
    href: '/admin/reservations',
    icon: Calendar,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    requiredRole: 'moderator'
  }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 45,
    pendingReservations: 8,
    confirmedReservations: 32,
    totalRevenue: 58750,
    monthlyRevenue: 12800,
    totalBlogPosts: 12,
    publishedPosts: 8,
    totalMessages: 23,
    newMessages: 5
  });
  
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const { user, hasPermission } = useAuth();

  // Verificar si puede acceder a una acción
  const canAccess = (requiredRole: string) => {
    const roleHierarchy = {
      'user': 1,
      'editor': 2,
      'moderator': 3,
      'admin': 4
    };
    
    const userLevel = roleHierarchy[user?.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 999;
    
    return userLevel >= requiredLevel;
  };

  // Filtrar acciones según permisos
  const accessibleActions = quickActions.filter(action => canAccess(action.requiredRole));
  const restrictedActions = quickActions.filter(action => !canAccess(action.requiredRole));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Principal
              </h1>
              <p className="text-gray-600">
                Bienvenido/a, <span className="font-medium">{user?.name}</span> 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user?.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                  user?.role === 'editor' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user?.role === 'admin' ? 'Administrador' :
                   user?.role === 'moderator' ? 'Moderador' :
                   user?.role === 'editor' ? 'Editor' : 'Usuario'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Error de permisos */}
        {error === 'insufficient_permissions' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-3" size={20} />
              <div>
                <h3 className="text-sm font-medium text-red-800">Acceso Denegado</h3>
                <p className="text-sm text-red-700 mt-1">
                  No tienes permisos suficientes para acceder a esa sección.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Reservas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reservas Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Clock className="text-yellow-500 mr-1" size={14} />
                <span className="text-yellow-600">{stats.pendingReservations} pendientes</span>
              </div>
              {canAccess('moderator') ? (
                <Link
                  href="/admin/reservations"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todas →
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">
                  <Lock size={14} />
                </span>
              )}
            </div>
          </motion.div>

          {/* Ingresos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Euro className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Total</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm">
                <TrendingUp className="text-green-500 mr-1" size={14} />
                <span className="text-green-600">€{stats.monthlyRevenue.toLocaleString()} este mes</span>
              </div>
              <span className="text-green-600 text-sm font-medium">+12%</span>
            </div>
          </motion.div>

          {/* Blog */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Posts del Blog</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBlogPosts}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm">
                <CheckCircle className="text-green-500 mr-1" size={14} />
                <span className="text-green-600">{stats.publishedPosts} publicados</span>
              </div>
              {canAccess('editor') ? (
                <Link
                  href="/admin/blog"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Gestionar →
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">
                  <Lock size={14} />
                </span>
              )}
            </div>
          </motion.div>

          {/* Mensajes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <MessageSquare className="text-red-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mensajes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span className="text-red-600">{stats.newMessages} nuevos</span>
              </div>
              {canAccess('moderator') ? (
                <Link
                  href="/admin/messages"
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Revisar →
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">
                  <Lock size={14} />
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Acciones Disponibles */}
          {accessibleActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
                <p className="text-sm text-gray-600 mt-1">Funciones disponibles para tu rol</p>
              </div>
              <div className="p-6 space-y-4">
                {accessibleActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className={`flex items-center p-4 rounded-lg ${action.color} ${action.hoverColor} text-white transition-colors group`}
                    >
                      <Icon size={24} className="mr-4" />
                      <div className="flex-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                      <ArrowRight size={20} className="opacity-75 group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Acciones Restringidas */}
          {restrictedActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Lock className="mr-2 text-gray-400" size={20} />
                  Funciones Restringidas
                </h2>
                <p className="text-sm text-gray-600 mt-1">Requieren permisos adicionales</p>
              </div>
              <div className="p-6 space-y-4">
                {restrictedActions.map((action) => {
                  const Icon = action.icon;
                  const roleHierarchy = {
                    'user': 'Usuario',
                    'editor': 'Editor',
                    'moderator': 'Moderador', 
                    'admin': 'Administrador'
                  };
                  const requiredRoleLabel = roleHierarchy[action.requiredRole as keyof typeof roleHierarchy];
                  
                  return (
                    <div
                      key={action.href}
                      className="flex items-center p-4 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
                    >
                      <Icon size={24} className="mr-4 text-gray-400" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-600">{action.title}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Requiere: {requiredRoleLabel}
                        </p>
                      </div>
                      <Lock size={20} className="text-gray-400" />
                    </div>
                  );
                })}
                
                {/* Mensaje explicativo */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">¿Necesitas más permisos?</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Contacta con un administrador para solicitar acceso a estas funciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Información del usuario actual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Perfil</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <p className="text-sm text-gray-900 mt-1">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900 mt-1">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                user?.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                user?.role === 'editor' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user?.role === 'admin' ? 'Administrador' :
                 user?.role === 'moderator' ? 'Moderador' :
                 user?.role === 'editor' ? 'Editor' : 'Usuario'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}