'use client';

import React from 'react';
import { Flame, Snowflake, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function HeroBanner() {
  const { setSelectedCategory } = useStore();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-amber-950/40 border border-zinc-800 p-6 sm:p-10 mb-8 shadow-2xl">
      {/* Decorative ambient lights */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
          <Flame className="w-3.5 h-3.5" />
          <span>Sextou com a melhor adega da região</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Bebidas <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">estupidamente geladas</span> na sua porta em minutos.
        </h1>

        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
          Cervejas no ponto, whiskies importados, vinhos selecionados, kits completos de gin, gelo e petiscos. Peça online e receba rápido com pagamento via Pix ou Cartão.
        </p>

        {/* Action pills */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSelectedCategory('combos')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm shadow-lg shadow-orange-950/40 transition cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            Ver Combos da Galera
          </button>
          
          <button
            onClick={() => setSelectedCategory('cervejas')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-sm border border-zinc-700 transition cursor-pointer"
          >
            <Snowflake className="w-4 h-4 text-cyan-400" />
            Cervejas Trincando
          </button>

          <button
            onClick={() => setSelectedCategory('destilados')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-sm border border-zinc-700 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Whiskies & Gins
          </button>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-zinc-800/80 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Entrega expressa (25-40 min)</span>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-cyan-400" />
            <span>Chega na temperatura certa</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bebidas 100% originais</span>
          </div>
        </div>
      </div>
    </div>
  );
}
