'use client';

import React from 'react';
import { Sparkles, Wine, Flame, Beer, GlassWater, Package, Tag } from 'lucide-react';
import { NAV_CATEGORIES } from '@/lib/data';
import { useStore } from '@/context/StoreContext';

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {NAV_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950/40 scale-[1.02]'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
