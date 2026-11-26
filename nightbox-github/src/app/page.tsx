'use client';

import React from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import FlashSaleHeader from '@/components/FlashSaleHeader';
import ProductCard from '@/components/ProductCard';
import TrustBadgesFooter from '@/components/TrustBadgesFooter';
import { useStore } from '@/context/StoreContext';
import { AlertCircle } from 'lucide-react';

export default function HomePage() {
  const { filteredProducts, selectedCategory, searchQuery, config, isLoading } = useStore();

  // Produtos exibidos (ofertas quando filtrado por ofertas, ou produtos filtrados)
  const flashSaleProducts = filteredProducts.filter(p => p.isFlashSale);
  const displayProducts = selectedCategory === 'ofertas'
    ? (flashSaleProducts.length > 0 ? flashSaleProducts : filteredProducts)
    : filteredProducts;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* 1. Hero Carousel - Especial de Fim de Ano */}
      <HeroCarousel />

      {/* 2. Seção Oferta de Fim de Ano (Super Combo da Virada) */}
      <div id="ofertas-section">
        <FlashSaleHeader />
      </div>

      {/* 3. Catálogo Oficial dos Produtos Enviados */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-[#141419] rounded-2xl border border-zinc-800" />
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#141419] border border-zinc-800 rounded-2xl p-8 mb-8">
          <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Nenhum produto encontrado</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Não encontramos nenhum item com esse filtro. Tente buscar por outro termo ou categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 4. Selos de Confiança e Delivery */}
      <TrustBadgesFooter />
    </main>
  );
}
