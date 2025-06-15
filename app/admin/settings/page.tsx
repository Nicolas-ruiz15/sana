'use client';

import { useState, useEffect } from 'react';
import RoleProtection from '@/components/RoleProtection';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Save, 
  RefreshCw, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon,
  Upload,
  Eye,
  Calendar
} from 'lucide-react';

interface SiteSettings {
  // Información general
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl: string;
  
  // Información de contacto
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  
  // Redes sociales
  socialInstagram: string;
  socialFacebook: string;
  socialTwitter: string;
  
  // Configuración de email
  emailHost: string;
  emailPort: string;
  emailUser: string;
  emailPassword: string;
  
  // Configuración de reservas
  reservationAutoConfirm: boolean;
  reservationEmailNotifications: boolean;
  maxReservationsPerEvent: number;
  
  // Configuración del blog
  postsPerPage: number;
  allowComments: boolean;
  moderateComments: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Sanando desde el Ser',
    siteDescription: 'Transformación personal auténtica a través de retiros conscientes',
    siteUrl: 'https://sanandodesdeelser.com',
    logoUrl: '/images/logo.png',
    contactEmail: 'info@sanandodesdeelser.com',
    contactPhone: '+34 600 000 000',
    contactAddress: 'Valencia, España',
    socialInstagram: 'https://instagram.com/sanandodesdeelser',
    socialFacebook: 'https://facebook.com/sanandodesdeelser',
    socialTwitter: 'https://twitter.com/sanandodesdeelser',
    emailHost: 'smtp.gmail.com',
    emailPort: '587',
    emailUser: 'nicolasruiz153@gmail.com',
    emailPassword: 'bkxnyfwreqkhjpng',
    reservationAutoConfirm: false,
    reservationEmailNotifications: true,
    maxReservationsPerEvent: 50,
    postsPerPage: 6,
    allowComments: false,
    moderateComments: true
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings({ ...settings, ...data.settings });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Configuración guardada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Error al guardar la configuración');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: keyof SiteSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contacto', icon: Mail },
    { id: 'social', label: 'Redes Sociales', icon: Instagram },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'reservations', label: 'Reservas', icon: Calendar },
    { id: 'blog', label: 'Blog', icon: SettingsIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Sitio
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Sitio
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del Sitio
              </label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del Logo
              </label>
              <input
                type="url"
                value={settings.logoUrl}
                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {settings.logoUrl && (
                <div className="mt-2 flex items-center">
                  <Image
                    src={settings.logoUrl}
                    alt="Logo preview"
                    width={48}
                    height={48}
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <textarea
                value={settings.contactAddress}
                onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={settings.socialInstagram}
                onChange={(e) => handleInputChange('socialInstagram', e.target.value)}
                placeholder="https://instagram.com/tu-usuario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={settings.socialFacebook}
                onChange={(e) => handleInputChange('socialFacebook', e.target.value)}
                placeholder="https://facebook.com/tu-pagina"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={settings.socialTwitter}
                onChange={(e) => handleInputChange('socialTwitter', e.target.value)}
                placeholder="https://twitter.com/tu-usuario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Configuración de Email
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Esta configuración se usa para enviar emails de notificación y confirmaciones.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  value={settings.emailHost}
                  onChange={(e) => handleInputChange('emailHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puerto
                </label>
                <input
                  type="text"
                  value={settings.emailPort}
                  onChange={(e) => handleInputChange('emailPort', e.target.value)}
                  placeholder="587"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario/Email
              </label>
              <input
                type="email"
                value={settings.emailUser}
                onChange={(e) => handleInputChange('emailUser', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={settings.emailPassword}
                onChange={(e) => handleInputChange('emailPassword', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'reservations':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Reservas por Evento
              </label>
              <input
                type="number"
                value={settings.maxReservationsPerEvent}
                onChange={(e) => handleInputChange('maxReservationsPerEvent', parseInt(e.target.value))}
                min={1}
                max={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoConfirm"
                  checked={settings.reservationAutoConfirm}
                  onChange={(e) => handleInputChange('reservationAutoConfirm', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoConfirm" className="ml-2 text-sm text-gray-700">
                  Confirmación automática de reservas
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.reservationEmailNotifications}
                  onChange={(e) => handleInputChange('reservationEmailNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                  Enviar notificaciones por email
                </label>
              </div>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posts por Página
              </label>
              <input
                type="number"
                value={settings.postsPerPage}
                onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                min={1}
                max={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowComments"
                  checked={settings.allowComments}
                  onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowComments" className="ml-2 text-sm text-gray-700">
                  Permitir comentarios en los posts
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="moderateComments"
                  checked={settings.moderateComments}
                  onChange={(e) => handleInputChange('moderateComments', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="moderateComments" className="ml-2 text-sm text-gray-700">
                  Moderar comentarios antes de publicar
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <RoleProtection requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        </div>
      </RoleProtection>
    );
  }

  return (
    <RoleProtection requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Configuración del Sitio
                </h1>
                <p className="text-gray-600">
                  Administra la configuración general de tu plataforma
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={loadSettings}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Recargar
                </button>
                
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Save size={16} className="mr-2" />
                  )}
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8"
            >
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                <span className="text-green-700">{success}</span>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
            >
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={20} />
                <span className="text-red-700">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Settings Content */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-r border-gray-200">
                <nav className="p-4 space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon
                          className={`mr-3 h-5 w-5 ${
                            activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                          }`}
                        />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-8">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleProtection>
  );
}