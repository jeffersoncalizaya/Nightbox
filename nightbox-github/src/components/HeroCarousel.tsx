'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Truck, Tag, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const SLIDES = [
  {
    id: 1,
    tag: '- ESPECIAL DE -',
    title: 'FIM DE ANO',
    subtitle: 'CONFRATERNIZAÇÃO • NATAL • RÉVEILLON',
    features: [
      { icon: Package, text: 'KIT COMPLETO' },
      { icon: Truck, text: 'ENTREGA RÁPIDA' },
      { icon: Tag, text: 'PREÇO IMPERDÍVEL' },
    ],
    buttonText: 'VER SUPER COMBO →',
    categoryTarget: 'fim-de-ano',
    bannerImage: '/images/combo_fim_de_ano.jpg',
  },
  {
    id: 2,
    tag: '- CATÁLOGO OFICIAL -',
    title: 'NARGUILÉS & PODS',
    subtitle: 'KITS COMPLETOS • SABORES E MODELOS EXCLUSIVOS',
    features: [
      { icon: Package, text: 'ORIGINAIS LACRADOS' },
      { icon: Truck, text: 'ENTREGA EXPRESSA' },
      { icon: Tag, text: 'SUPER DESCONTOS' },
    ],
    buttonText: 'VER PRODUTOS →',
    categoryTarget: 'narguile',
    bannerImage: '/images/narguile_completo_dourado.webp',
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSelectedCategory } = useStore();

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative w-full mb-8 rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800 bg-[#0c0c10] shadow-2xl">
      {/* Background with Dark festive glow */}
      <div 
        className="relative w-full min-h-[360px] sm:min-h-[420px] flex items-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 11, 14, 0.96) 0%, rgba(11, 11, 14, 0.85) 45%, rgba(11, 11, 14, 0.65) 100%), url(${slide.bannerImage})`,
        }}
      >
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-10 w-full flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text Block */}
          <div className="max-w-xl text-left">
            <span className="text-zinc-400 font-bold tracking-widest text-xs sm:text-sm uppercase block mb-1">
              {slide.tag}
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-3">
              <span className="bg-gradient-to-r from-white via-zinc-100 to-red-500 bg-clip-text text-transparent">
                {slide.title}
              </span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-zinc-300 tracking-wider uppercase mb-6">
              {slide.subtitle}
            </p>

            {/* Badges / Features */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              {slide.features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div 
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/60 text-[11px] font-bold text-zinc-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-red-500" />
                    <span>{feat.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setSelectedCategory(slide.categoryTarget)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-red-950/60 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{slide.buttonText}</span>
            </button>
          </div>

          {/* Card em Destaque da Promoção de Fim de Ano */}
          <div 
            onClick={() => setSelectedCategory('fim-de-ano')}
            className="hidden md:flex items-center gap-3 relative cursor-pointer"
          >
            <div className="relative w-72 h-80 rounded-2xl overflow-hidden border-2 border-red-600/70 shadow-2xl shadow-red-950/60 bg-zinc-950 group hover:border-red-500 transition-all">
              <img
                src="/images/combo_fim_de_ano.jpg"
                alt="Promoção de Fim de Ano"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg">
                🎉 Promoção Fim de Ano
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">Super Desconto</span>
                <span className="text-base font-black text-white leading-tight">Super Combo da Virada</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs text-zinc-400 line-through">De R$ 490</span>
                  <span className="text-sm font-black text-emerald-400">Por R$ 300,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === i ? 'bg-red-600 w-6' : 'bg-zinc-600 hover:bg-zinc-400'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
