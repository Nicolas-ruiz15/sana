// app/admin/layout.tsx - CON ROLES DINÁMICOS
'use client';

import '../globals.css';
import { Inter } from 'next/font/google';
import { Mountain } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Calendar,
  MessageSquare,
  Loader2,
  Lock,
  Shield,
  Edit,
  Eye
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

// Definir tipo para elementos del sidebar
interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  requiredRole: string | null;
  description: string;
}

// Configuración de elementos del sidebar con permisos
const sidebarItems: SidebarItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: Home,
    requiredRole: null, // Todos pueden acceder
    description: 'Vista general del sistema'
  },
  {
    href: '/admin/reservations',
    label: 'Reservas',
    icon: Calendar,
    requiredRole: 'moderator', // Moderadores y superiores
    description: 'Gestionar reservas de retiros'
  },
  {
    href: '/admin/retiros',
    label: 'Retiros',
    icon: Mountain,
    requiredRole: 'editor', // Editores y superiores pueden gestionar retiros
    description: 'Gestionar retiros espirituales'
  },
  {
    href: '/admin/blog',
    label: 'Blog',
    icon: FileText,
    requiredRole: 'editor', // Editores y superiores
    description: 'Crear y editar artículos'
  },
  {
    href: '/admin/messages',
    label: 'Mensajes',
    icon: MessageSquare,
    requiredRole: 'moderator', // Moderadores y superiores
    description: 'Gestionar mensajes de contacto'
  },
  {
    href: '/admin/users',
    label: 'Usuarios',
    icon: Users,
    requiredRole: 'admin', // Solo administradores
    description: 'Gestionar usuarios del sistema'
  },
  {
    href: '/admin/settings',
    label: 'Configuración',
    icon: Settings,
    requiredRole: 'admin', // Solo administradores
    description: 'Configuración del sitio'
  }
];

// Jerarquía de roles
const roleHierarchy = {
  'user': { level: 1, label: 'Usuario', color: 'bg-gray-600', badge: 'bg-gray-100 text-gray-800' },
  'editor': { level: 2, label: 'Editor', color: 'bg-green-600', badge: 'bg-green-100 text-green-800' },
  'moderator': { level: 3, label: 'Moderador', color: 'bg-blue-600', badge: 'bg-blue-100 text-blue-800' },
  'admin': { level: 4, label: 'Administrador', color: 'bg-red-600', badge: 'bg-red-100 text-red-800' }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, authenticated, logout, requireAuth, hasPermission } = useAuth();

  // Función para verificar si el usuario puede acceder a una ruta
  const canAccess = (requiredRole: string | null): boolean => {
    if (!requiredRole) return true; // Sin restricción
    if (!user) return false;
    
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy]?.level || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy]?.level || 999;
    
    return userLevel >= requiredLevel;
  };

  // No mostrar nada mientras carga
  if (loading) {
    return (
      <html lang="es" className={inter.className}>
        <body>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Verificando autenticación...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Si es la página de login, mostrar solo el contenido
  if (pathname === '/admin/login') {
    return (
      <html lang="es" className={inter.className}>
        <body>{children}</body>
      </html>
    );
  }

  // Si no está autenticado, requerir auth
  if (!authenticated) {
    requireAuth();
    return (
      <html lang="es" className={inter.className}>
        <body>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Redirigiendo al login...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Obtener configuración del rol del usuario
  const userRoleConfig = roleHierarchy[user?.role as keyof typeof roleHierarchy] || roleHierarchy.user;

  // Filtrar elementos del sidebar según permisos (OCULTAR opciones sin acceso)
  const visibleSidebarItems = sidebarItems.filter(item => canAccess(item.requiredRole));

  return (
    <html lang="es" className={inter.className}>
      <body>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
              {/* Header del sidebar */}
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/" className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Sanando desde el Ser</p>
                    <p className="text-xs text-gray-500">Panel Admin</p>
                  </div>
                </Link>
              </div>
              
              {/* Info del usuario actual */}
              <div className="mt-4 mx-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${userRoleConfig.color}`}>
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-2 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${userRoleConfig.badge}`}>
                      {userRoleConfig.label}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex-grow flex flex-col">
                {/* Navegación */}
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {visibleSidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        title={item.description}
                      >
                        <Icon
                          className={`mr-3 flex-shrink-0 h-5 w-5 ${
                            isActive
                              ? 'text-blue-500'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mostrar opciones restringidas si existen */}
                {sidebarItems.some(item => !canAccess(item.requiredRole)) && (
                  <div className="px-2 pb-4">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Requiere más permisos
                      </p>
                      {sidebarItems
                        .filter(item => !canAccess(item.requiredRole))
                        .map((item) => {
                          const Icon = item.icon;
                          const requiredRoleConfig = item.requiredRole 
                            ? roleHierarchy[item.requiredRole as keyof typeof roleHierarchy]
                            : null;
                          
                          return (
                            <div
                              key={item.href}
                              className="group flex items-center px-2 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
                              title={`Requiere rol: ${requiredRoleConfig?.label || item.requiredRole || 'Sin restricción'}`}
                            >
                              <Icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-300" />
                              {item.label}
                              <Lock className="ml-auto h-4 w-4 text-gray-300" />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                
                {/* Footer con logout */}
                <div className="flex-shrink-0 border-t border-gray-200 p-4">
                  <button 
                    onClick={logout}
                    className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            {/* Top bar móvil */}
            <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${userRoleConfig.color}`}>
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${userRoleConfig.badge}`}>
                      {userRoleConfig.label}
                    </span>
                  </div>
                </div>
                <button onClick={logout} className="text-gray-500 hover:text-gray-700">
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}