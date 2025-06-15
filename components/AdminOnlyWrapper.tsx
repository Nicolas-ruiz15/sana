'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle, Shield, Loader2 } from 'lucide-react';

interface AdminOnlyProps {
  children: React.ReactNode;
  message?: string;
  fallbackPath?: string;
}

export default function AdminOnly({ 
  children, 
  message = "Esta sección es solo para administradores",
  fallbackPath = "/admin"
}: AdminOnlyProps) {
  const { user, loading, isAdmin, requireAdmin } = useAuth();

  useEffect(() => {
    requireAdmin();
  }, [requireAdmin, isAdmin, loading]);

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

  if (!isAdmin()) {
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
              {message}
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Tu cuenta actual <strong>({user?.role || 'usuario'})</strong> no tiene permisos 
                  para acceder a esta sección.
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
            <a
              href={fallbackPath}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}