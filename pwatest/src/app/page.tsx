'use client';

import { useState } from 'react';
import OptimizedShop from '@/components/OptimizedShop';
import { useRouter } from 'next/navigation';

export default function Home() {

  const HomePage = () => (
    <div className="justify-center">
      <OptimizedShop />
    </div>
  );

  return <HomePage />;
}
