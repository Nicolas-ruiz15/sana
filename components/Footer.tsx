import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image
                src="/images/logo-blanco.png"
                alt="Sanando Desde el Ser"
                width={250}
                height={100}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empoderar a personas y organizaciones para cultivar la sanando desde el ser, reducir el estrés y mejorar el bienestar mediante programas y prácticas basados ​​en evidencia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/retiros" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Retiros
                </Link>
              </li>
              <li>
                <Link href="/quienes-somos" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Politica de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Información de Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail size={16} className="text-blue-400 mr-3" />
                <span className="text-gray-300">contacto@sanandodesdeelser.com.es</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="text-blue-400 mr-3" />
                <span className="text-gray-300">+34 (620) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="text-blue-400 mr-3" />
                <span className="text-gray-300">Valencia, ES</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 sanando desde el ser. Todos los derechos reservado.
          </p>
        </div>
      </div>
    </footer>
  );
}