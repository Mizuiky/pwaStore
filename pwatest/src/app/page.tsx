'use client';

import { useState } from 'react';
import { ShoppingBag, Zap, Smartphone, Wifi } from 'lucide-react';
import OptimizedShop from '@/components/OptimizedShop';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop'>('home');

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            PWA Lojinha
            <span className="text-blue-600"> Otimizada</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Demonstração de técnicas avançadas de otimização para PWAs em dispositivos 
            com recursos limitados e conexões lentas usando Next.js.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Performance Otimizada</h3>
            <p className="text-gray-600 text-sm">
              Carregamento progressivo e lazy loading inteligente
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Smartphone className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dispositivos Limitados</h3>
            <p className="text-gray-600 text-sm">
              Otimizado para 1-2GB RAM e processadores lentos
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Wifi className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Conexões 3G</h3>
            <p className="text-gray-600 text-sm">
              Funciona perfeitamente em conexões lentas
            </p>
          </div>
        </div>

        <button 
          onClick={() => setCurrentPage('shop')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <ShoppingBag className="w-6 h-6" />
          Entrar na Lojinha
        </button>

        <div className="mt-12 text-sm text-gray-500">
          <p>
            <strong>Técnicas implementadas:</strong> Lazy Loading, Virtualização, 
            Detecção de Capacidades, Carregamento Progressivo, Animações Adaptativas
          </p>
        </div>
      </div>
    </div>
  );

  if (currentPage === 'shop') {
    return <OptimizedShop onBack={() => setCurrentPage('home')} />;
  }

  return <HomePage />;
}
