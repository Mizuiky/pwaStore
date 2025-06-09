'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export const useLazyLoad = (threshold = 0.1, rootMargin = '50px') => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible] as const;
};

interface DeviceCapabilities {
  memory: number;
  cores: number;
  connection: string;
  reducedMotion: boolean;
  isLowEnd: boolean;
}

export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);

  useEffect(() => {
    const detectCapabilities = () => {
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      const connection = (navigator as any).connection?.effectiveType || '4g';
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      const caps: DeviceCapabilities = {
        memory,
        cores,
        connection,
        reducedMotion,
        isLowEnd: memory <= 2 || connection === '3g' || connection === '2g'
      };
      
      setCapabilities(caps);
    };

    detectCapabilities();
  }, []);

  return capabilities;
};

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const measurements = useRef(new Map<string, number>());

  const startMeasurement = useCallback((name: string) => {
    measurements.current.set(name, performance.now());
  }, []);

  const endMeasurement = useCallback((name: string) => {
    const startTime = measurements.current.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      setMetrics(prev => ({
        ...prev,
        [name]: duration
      }));
      measurements.current.delete(name);
      return duration;
    }
    return null;
  }, []);

  return { metrics, startMeasurement, endMeasurement };
};
