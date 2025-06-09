import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PWA Lojinha Otimizada - Performance para Dispositivos Limitados",
  description: "Demonstração de técnicas avançadas de otimização para PWAs em dispositivos com recursos limitados e conexões lentas usando Next.js",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  keywords: ["PWA", "Next.js", "Performance", "Otimização", "Lojinha", "E-commerce"],
  authors: [{ name: "Manus AI" }],
  openGraph: {
    title: "PWA Lojinha Otimizada",
    description: "Performance otimizada para dispositivos com recursos limitados",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
