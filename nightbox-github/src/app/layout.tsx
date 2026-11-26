import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import AgeGateModal from '@/components/AgeGateModal';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import FireworksCanvas from '@/components/FireworksCanvas';

export const metadata: Metadata = {
  title: 'NIGHTBOX | Tudo Para Seu Rolê - Bebidas, Narguilé, Pods e Combos',
  description: 'A adega e conveniência mais completa da noite! Bebidas estupidamente geladas, kits de whisky e gin, narguilé, pods, gelo e carvão entregues rápido.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col antialiased selection:bg-red-600 selection:text-white pb-16 sm:pb-0 relative">
        {/* Fundo Temático Luminoso e Colorido de Fim de Ano */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Imagem de Fundo com Alta Saturação e Brilho */}
          <Image 
            src="/images/fireworks_bg.jpg"
            alt="Fogos de Fim de Ano"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-65 sm:opacity-80 filter saturate-[1.35] brightness-110 select-none"
          />

          {/* Orbes e Resplendores Luminosos Coloridos (Glow Efeitos) */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-12 -right-24 w-96 h-96 bg-fuchsia-600/25 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 -right-12 w-80 h-80 bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Degradê sutil para garantir contraste e leitura nítida de produtos e preços */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07070a]/35 via-[#07070a]/70 to-[#07070a]" />

          {/* Animação Viva de Fogos de Artifício em Canvas */}
          <FireworksCanvas />
        </div>

        <StoreProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <AgeGateModal />
                <AuthModal />
                <div className="relative z-20 flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1">
                    {children}
                  </div>
                  <CartDrawer />
                  <Footer />
                  <MobileBottomNav />
                </div>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
