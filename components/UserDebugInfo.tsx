// components/UserDebugInfo.tsx - TEMPORAL PARA DEBUGGING
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function UserDebugInfo() {
  const { user, authenticated, isAdmin, hasPermission } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs">
      <h4 className="font-bold mb-2">Debug User Info:</h4>
      <div className="space-y-1">
        <p><strong>Authenticated:</strong> {authenticated ? 'YES' : 'NO'}</p>
        <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
        <p><strong>Is Admin:</strong> {isAdmin() ? 'YES' : 'NO'}</p>
        <p><strong>Can Manage Users:</strong> {hasPermission('admin') ? 'YES' : 'NO'}</p>
        <p><strong>Token exists:</strong> {localStorage.getItem('admin-token') ? 'YES' : 'NO'}</p>
      </div>
    </div>
  );
}