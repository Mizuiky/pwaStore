'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Heart, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useLazyLoad, useDeviceCapabilities, usePerformanceMetrics } from '@/hooks/useOptimizations';

interface ShopItem {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
}

interface DeviceCapabilities {
  memory: number;
  cores: number;
  connection: string;
  reducedMotion: boolean;
  isLowEnd: boolean;
}

interface LoadingStrategy {
  batchSize: number;
  delay: number;
  maxConcurrentAnimations: number;
}

interface OptimizedShopItemProps {
  item: ShopItem;
  index: number;
  deviceCapabilities: DeviceCapabilities | null;
}

const OptimizedShopItem = React.memo<OptimizedShopItemProps>(({ item, index, deviceCapabilities }) => {
  const [ref, isVisible] = useLazyLoad(0.1, '100px');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);

  const animationDelay = useMemo(() => {
    if (!deviceCapabilities) return index * 100;
    
    if (deviceCapabilities.isLowEnd) {
      return index * 200;
    }
    
    return index * 100;
  }, [index, deviceCapabilities]);

  const animationConfig = useMemo(() => {
    if (!deviceCapabilities || deviceCapabilities.reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      };
    }

    return {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { 
        duration: 0.6, 
        delay: animationDelay / 1000,
        ease: "easeOut"
      }
    };
  }, [deviceCapabilities, animationDelay]);

  if (!isVisible) {
    return (
      <div ref={ref} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
    );
  }

  return (
    <motion.div
      {...animationConfig}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <Image
          src={item.image}
          alt={item.name}
          width={300}
          height={200}
          className={`w-full h-48 object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({item.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">R$ {item.price}</span>
            {item.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                R$ {item.originalPrice}
              </span>
            )}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Comprar
          </button>
        </div>
      </div>
    </motion.div>
  );
});

OptimizedShopItem.displayName = 'OptimizedShopItem';

interface OptimizedShopProps {
  onBack?: () => void;
}

const OptimizedShop: React.FC<OptimizedShopProps> = ({ onBack }) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingStrategy, setLoadingStrategy] = useState<LoadingStrategy | null>(null);
  
  const deviceCapabilities = useDeviceCapabilities();
  const { metrics, startMeasurement, endMeasurement } = usePerformanceMetrics();

  const generateShopItems = (count = 24): ShopItem[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Produto Incrível ${i + 1}`,
      price: (Math.random() * 200 + 20).toFixed(2),
      originalPrice: Math.random() > 0.7 ? (Math.random() * 300 + 100).toFixed(2) : undefined,
      image: `https://picsum.photos/300/200?random=${i + 1}`,
      rating: Math.floor(Math.random( ) * 2) + 4,
      reviews: Math.floor(Math.random() * 500) + 10
    }));
  };

  const determineLoadingStrategy = (capabilities: DeviceCapabilities | null): LoadingStrategy => {
    if (!capabilities) {
      return { batchSize: 6, delay: 200, maxConcurrentAnimations: 4 };
    }

    if (capabilities.isLowEnd) {
      return {
        batchSize: 4,
        delay: 400,
        maxConcurrentAnimations: 2
      };
    }

    if (capabilities.memory <= 4) {
      return {
        batchSize: 8,
        delay: 200,
        maxConcurrentAnimations: 4
      };
    }

    return {
      batchSize: 12,
      delay: 100,
      maxConcurrentAnimations: 8
    };
  };

  useEffect(() => {
    if (!deviceCapabilities) return;

    const strategy = determineLoadingStrategy(deviceCapabilities);
    setLoadingStrategy(strategy);

    const loadItemsProgressively = async () => {
      startMeasurement('itemsLoading');
      
      const allItems = generateShopItems(24);
      setLoadingStage(1);

      for (let i = 0; i < allItems.length; i += strategy.batchSize) {
        const batch = allItems.slice(i, i + strategy.batchSize);
        
        setItems(prev => [...prev, ...batch]);
        setLoadingStage(Math.min(4, Math.floor((i + strategy.batchSize) / allItems.length * 4) + 1));
        
        if (i + strategy.batchSize < allItems.length) {
          await new Promise(resolve => setTimeout(resolve, strategy.delay));
        }
      }

      endMeasurement('itemsLoading');
    };

    loadItemsProgressively();
  }, [deviceCapabilities, startMeasurement, endMeasurement]);

  const gridConfig = useMemo(() => {
    if (!deviceCapabilities) return 'grid-cols-2';
    
    if (deviceCapabilities.isLowEnd) {
      return 'grid-cols-1 sm:grid-cols-2';
    }
    
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  }, [deviceCapabilities]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lojinha Otimizada</h1>
              <p className="text-gray-600 mt-1">
                Performance otimizada para dispositivos com recursos limitados
              </p>
            </div>
          </div>
        </div>
      </header>

      {process.env.NODE_ENV === 'development' && deviceCapabilities && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="max-w-7xl mx-auto text-sm">
            <strong>Dispositivo:</strong> {deviceCapabilities.memory}GB RAM, 
            {deviceCapabilities.cores} cores, {deviceCapabilities.connection}, 
            {deviceCapabilities.isLowEnd ? 'Baixo desempenho' : 'Bom desempenho'}
            {loadingStrategy && (
              <span className="ml-4">
                <strong>Estratégia:</strong> {loadingStrategy.batchSize} itens por batch, 
                {loadingStrategy.delay}ms delay
              </span>
            )}
          </div>
        </div>
      )}

      {loadingStage > 0 && loadingStage < 4 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Carregando produtos...
              </span>
              <span className="text-sm text-gray-500">
                {loadingStage}/4
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(loadingStage / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${gridConfig} gap-6`}>
          <AnimatePresence>
            {items.map((item, index) => (
              <OptimizedShopItem
                key={item.id}
                item={item}
                index={index}
                deviceCapabilities={deviceCapabilities}
              />
            ))}
          </AnimatePresence>
        </div>

        {process.env.NODE_ENV === 'development' && Object.keys(metrics).length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Métricas de Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(value)}ms
                  </div>
                  <div className="text-sm text-gray-600">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OptimizedShop;
