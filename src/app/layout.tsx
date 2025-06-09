import "./globals.css";

export const metadata = {
  title: "Lojinha Gamificada",
  description: "Feita com Next.js + Tailwind + Framer Motion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
