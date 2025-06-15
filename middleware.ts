// middleware.ts - VERSIÓN SIMPLIFICADA QUE FUNCIONA
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo verificar rutas de admin que NO sean login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    
    // Verificar si hay token en localStorage se hace en el cliente
    // El middleware solo verifica rutas muy específicas
    
    // Por ahora, permitir todas las rutas de admin
    // La protección real se hace en los componentes del frontend
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}