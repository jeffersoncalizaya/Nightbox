'use client';

import React from 'react';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { BEST_SELLER_COMBOS } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/lib/types';

export default function BestSellerCombos() {
  const { addItem } = useCart();
  const { setSelectedCategory } = useStore();

  const handleAddCombo = (combo: typeof BEST_SELLER_COMBOS[0]) => {
    const productAdapter: Product = {
      id: combo.id,
      name: combo.title,
      description: combo.subtitle,
      price: combo.price,
      category: 'kits',
      imageUrl: combo.imageUrl,
      inStock: true,
      rating: combo.rating,
      reviewsCount: combo.reviewsCount,
      isFastShipping: true,
    };
    addItem(productAdapter, 1);
  };

  return (
    <div className="my-10">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Kits e Combos Mais Vendidos
        </h2>

        <button
          onClick={() => setSelectedCategory('kits')}
          className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
        >
          <span>Ver todos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid / Horizontal Scroll */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {BEST_SELLER_COMBOS.map((combo) => (
          <div
            key={combo.id}
            className="bg-[#141419] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col justify-between p-3 transition group hover:shadow-xl hover:shadow-red-950/20"
          >
            {/* Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0e0e12] mb-2.5">
              <img
                src={combo.imageUrl}
                alt={combo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1 mb-0.5">
                  {combo.title}
                </h3>
                <p className="text-[10px] text-zinc-400 line-clamp-1 mb-1.5">
                  {combo.subtitle}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-zinc-400 mb-2">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-zinc-200">{combo.rating}</span>
                  <span>({combo.reviewsCount})</span>
                </div>
              </div>

              {/* Price and Cart Button */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                <span className="text-xs sm:text-sm font-black text-red-500">
                  R$ {combo.price.toFixed(2).replace('.', ',')}
                </span>

                <button
                  onClick={() => handleAddCombo(combo)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition cursor-pointer shadow-md shadow-red-950/50 active:scale-95"
                  title="Adicionar combo"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
