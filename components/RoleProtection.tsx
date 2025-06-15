// components/RoleProtection.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle, Shield, Loader2 } from 'lucide-react';

interface RoleProtectionProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'editor' | 'user';
  fallbackPath?: string;
  showRestrictedMessage?: boolean;
}

export default function RoleProtection({ 
  children, 
  requiredRole,
  fallbackPath = "/admin",
  showRestrictedMessage = true
}: RoleProtectionProps) {
  const { user, loading, authenticated, hasPermission } = useAuth();
  const router = useRouter();

  // Jerarquía de roles
  const roleHierarchy = {
    'user': 1,
    'editor': 2,
    'moderator': 3,
    'admin': 4
  };

  const canAccess = () => {
    if (!requiredRole) return true; // Sin restricción
    if (!user) return false;
    
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 999;
    
    return userLevel >= requiredLevel;
  };

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/admin/login');
    }
  }, [loading, authenticated, router]);

  // Mostrar loader mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!authenticated) {
    return null;
  }

  // Si no tiene permisos, mostrar mensaje o redirigir
  if (!canAccess()) {
    if (showRestrictedMessage) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Acceso Restringido
              </h1>
              <p className="text-gray-600">
                Esta sección requiere permisos de <strong>{requiredRole}</strong>
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Tu rol actual <strong>({user?.role || 'usuario'})</strong> no tiene 
                    permisos para acceder a esta función.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Volver Atrás
              </button>
              <button
                onClick={() => router.push(fallbackPath)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      // Redirigir silenciosamente
      router.push(`${fallbackPath}?error=insufficient_permissions`);
      return null;
    }
  }

  // El usuario tiene permisos, mostrar el contenido
  return <>{children}</>;
}