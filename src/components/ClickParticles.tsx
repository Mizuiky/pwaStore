'use client';

import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import clickParticlesAnimation from "@/animations/clickParticles.json";

interface ClickParticlesProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ClickParticles({ trigger, onComplete }: ClickParticlesProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsPlaying(true);

      // Para parar a animação após o tempo estimado (ex: 1s)
      const timeout = setTimeout(() => {
        setIsPlaying(false);
        if (onComplete) onComplete();
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  if (!isPlaying) return null;

    return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 150, height: 150, position: 'relative' }}>
        <Lottie
            animationData={clickParticlesAnimation}
            loop={false}
            autoplay
            style={{
            width: '170%',
            height: '170%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            }}
        />
        </div>
    </div>
    );
}
