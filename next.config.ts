import type { NextConfig } from "next";

// Importa o next-pwa. Note que ele é um módulo CommonJS, então a importação é um pouco diferente.
// Se você tiver problemas com esta linha, pode ser necessário ajustar a configuração do seu tsconfig.json
// para permitir importações CommonJS em módulos ES, ou usar um 'require' dinâmico.
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
   buildExcludes: [
   /middleware-manifest\.json$/,
   /_middleware\.js$/,
   /[\\/]sw\.js$/ // Evita duplicação
 ],
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias (reduza para dispositivos fracos)
        },
        networkTimeoutSeconds: 15 // Timeout mais curto para 3G
      },
    },
    // Adicione cache para estáticos
   {
    urlPattern: /\.(?:js|css|woff2)$/,
     handler: "StaleWhileRevalidate",
     options: {
       cacheName: "static-resources",
       expiration: {
         maxEntries: 100,
         maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
       }
     }
   }
  ],
} );

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
    scrollRestoration: true,
  },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // Reduza para 1 dia
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer } ) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
   modularizeImports: {
   "lucide-react": {
     transform: "lucide-react/dist/esm/icons/{{ kebabCase member }}",
   },
 },
};

// Exporta a configuração com o PWA habilitado
export default withPWA(nextConfig);
