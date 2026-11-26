'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { CIRCULAR_CATEGORIES } from '@/lib/data';
import { useStore } from '@/context/StoreContext';

export default function CategoryCircleBar() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="w-full mb-8 overflow-x-auto scrollbar-none no-scrollbar">
      <div className="flex items-center gap-3 sm:gap-4 min-w-max pb-2">
        {CIRCULAR_CATEGORIES.map((cat: any) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition group cursor-pointer ${
                isSelected
                  ? 'bg-zinc-800/80'
                  : 'hover:bg-zinc-900/60'
              }`}
            >
              {/* Thumbnail Container */}
              <div 
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#141419] border flex items-center justify-center overflow-hidden transition duration-300 ${
                  isSelected
                    ? 'border-red-600 shadow-lg shadow-red-950/40 ring-2 ring-red-600/30'
                    : 'border-zinc-800 group-hover:border-zinc-700'
                }`}
              >
                {cat.isMore ? (
                  <LayoutGrid className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                ) : (
                  <img
                    src={cat.imageUrl}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                )}
              </div>

              {/* Label */}
              <span 
                className={`text-[11px] sm:text-xs font-semibold tracking-tight transition ${
                  isSelected ? 'text-red-500 font-bold' : 'text-zinc-300 group-hover:text-white'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
