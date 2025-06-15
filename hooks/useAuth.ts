// hooks/useAuth.ts - VERSIÓN EXTENDIDA
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setAuthenticated(true);
      } else {
        // Token inválido, eliminar
        localStorage.removeItem('admin-token');
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('admin-token');
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('admin-token', data.token);
      setUser(data.user);
      setAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  };

	// hooks/useAuth.ts - LOGOUT ACTUALIZADO
// Agrega esta función al hook useAuth existente

const logout = async () => {
  try {
    await fetch('/api/auth/verify', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Limpiar localStorage
    localStorage.removeItem('admin-token');
    
    // TAMBIÉN limpiar cookies
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    setUser(null);
    setAuthenticated(false);
    router.push('/admin/login');
  }
};

  const requireAuth = () => {
    if (!loading && !authenticated) {
      router.push('/admin/login');
    }
  };

  // ===== NUEVAS FUNCIONES DE ADMIN =====
  
  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Requerir permisos de admin
  const requireAdmin = () => {
    if (!loading && !isAdmin()) {
      router.push('/admin');
    }
  };

  // Verificar permisos específicos
  const hasPermission = (requiredRole: string) => {
    if (!user) return false;
    
    const roleHierarchy: Record<string, number> = {
      'user': 1,
      'editor': 2,
      'moderator': 3,
      'admin': 4
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  // Verificar si puede gestionar usuarios
  const canManageUsers = () => {
    return isAdmin();
  };

  // Verificar si puede cambiar configuración
  const canManageSettings = () => {
    return isAdmin();
  };

  // Verificar si puede gestionar el blog
  const canManageBlog = () => {
    return hasPermission('editor');
  };

  // Verificar si puede gestionar mensajes
  const canManageMessages = () => {
    return hasPermission('moderator');
  };

  // Verificar si puede gestionar reservas
  const canManageReservations = () => {
    return hasPermission('moderator');
  };

  return {
    user,
    loading,
    authenticated,
    login,
    logout,
    requireAuth,
    checkAuth,
    // Nuevas funciones de permisos
    isAdmin,
    requireAdmin,
    hasPermission,
    canManageUsers,
    canManageSettings,
    canManageBlog,
    canManageMessages,
    canManageReservations
  };
}