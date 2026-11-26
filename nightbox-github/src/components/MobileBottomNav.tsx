'use client';

import React from 'react';
import Link from 'next/link';
import { Home, LayoutGrid, Tag, User, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

export default function MobileBottomNav() {
  const { itemCount, setIsCartOpen } = useCart();
  const { selectedCategory, setSelectedCategory } = useStore();
  const { user, isLoggedIn, openAuthModal } = useAuth();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d11]/95 backdrop-blur-md border-t border-zinc-800 text-zinc-400 py-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around text-[10px] font-semibold">
        {/* Início */}
        <button
          onClick={() => {
            setSelectedCategory('todas');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 transition ${
            selectedCategory === 'todas' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Início</span>
        </button>

        {/* Categorias */}
        <button
          onClick={() => {
            const el = document.getElementById('categorias-bar');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition"
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Categorias</span>
        </button>

        {/* Ofertas */}
        <button
          onClick={() => {
            setSelectedCategory('ofertas');
            const el = document.getElementById('ofertas-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 transition ${
            selectedCategory === 'ofertas' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span>Ofertas</span>
        </button>

        {/* Conta / Login */}
        <button
          onClick={openAuthModal}
          className={`flex flex-col items-center gap-1 transition ${
            isLoggedIn ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{isLoggedIn && user ? user.name.split(' ')[0] : 'Conta'}</span>
        </button>

        {/* Carrinho */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span>Carrinho</span>
        </button>
      </div>
    </div>
  );
}
