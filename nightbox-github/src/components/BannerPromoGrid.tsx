'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function BannerPromoGrid() {
  const { setSelectedCategory } = useStore();

  const BANNERS = [
    {
      id: 'adega',
      title: 'ADEGA PREMIUM',
      subtitle: 'WHISKYS, VODKAS, GINS E MAIS',
      category: 'whisky',
      imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=600&q=80',
      gradient: 'from-amber-950/80 via-black/80 to-transparent',
    },
    {
      id: 'narguile',
      title: 'NARGUILÉS E ACESSÓRIOS',
      subtitle: 'AS MELHORES MARCAS',
      category: 'narguile',
      imageUrl: '/images/narguile_banner.jpg',
      gradient: 'from-purple-950/80 via-black/80 to-transparent',
    },
    {
      id: 'pods',
      title: 'PODS & VAPES',
      subtitle: 'DIVERSAS MARCAS • ENTREGA RÁPIDA',
      category: 'pods',
      imageUrl: '/images/pods_banner.jpg',
      gradient: 'from-pink-950/80 via-black/80 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 my-10">
      {BANNERS.map((banner) => (
        <div
          key={banner.id}
          className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-zinc-800 group shadow-xl bg-zinc-950"
        >
          {/* Background Image */}
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />

          {/* Content */}
          <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-end items-start">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase leading-none mb-1">
              {banner.title}
            </h3>

            <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-4">
              {banner.subtitle}
            </p>

            <button
              onClick={() => setSelectedCategory(banner.category)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition transform group-hover:translate-x-1 cursor-pointer shadow-lg"
            >
              <span>CONFERIR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
