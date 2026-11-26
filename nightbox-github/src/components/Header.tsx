'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  MapPin, 
  Truck,
  ChevronDown,
  Sparkles,
  Flame,
  Wine,
  Package
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { NAV_CATEGORIES } from '@/lib/data';
import TopHeader from './TopHeader';

export default function Header() {
  const { itemCount, total, setIsCartOpen } = useCart();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useStore();
  const { favoritesCount } = useFavorites();
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0d11]/90 backdrop-blur-md border-b border-zinc-800/80 text-white shadow-xl">
      {/* Top microbar */}
      <TopHeader />

      {/* Mobile Top Delivery Bar (as seen in screenshot 2) */}
      <div className="sm:hidden bg-[#09090b] border-b border-zinc-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1 text-zinc-300">
          <MapPin className="w-3 h-3 text-red-500" />
          <span>Entregar em <strong>São Paulo - SP</strong></span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <Truck className="w-3 h-3 text-zinc-400" />
          <span>Frete rápido para todo o Brasil</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Mobile Menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-1.5 text-zinc-300 hover:text-white"
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* LOGO: NIGHTBOX */}
        <Link href="/" className="flex flex-col items-start group flex-shrink-0">
          <div className="flex items-center gap-1 font-black text-2xl sm:text-3xl tracking-tighter leading-none">
            <span className="text-white">NIGHT</span>
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded font-black text-xl sm:text-2xl shadow-md shadow-red-950/60">
              BOX
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">
            TUDO PARA SEU ROLÊ
          </span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden sm:flex flex-1 max-w-2xl mx-2">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="O que você está procurando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18181f] border border-zinc-700/80 rounded-l-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-red-600 transition"
            />
            <button 
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-r-xl border border-red-600 flex items-center justify-center transition cursor-pointer shadow-lg shadow-red-950/40"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Minha Conta / Login */}
          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition group cursor-pointer text-left"
          >
            <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
              isLoggedIn 
                ? 'bg-red-600/20 border-red-500 text-red-400' 
                : 'bg-[#18181f] border-zinc-800 text-zinc-300 group-hover:border-red-600'
            }`}>
              <User className="w-4 h-4 group-hover:text-red-500" />
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-[11px] text-zinc-400">
                {isLoggedIn && user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}
              </span>
              <span className="text-xs font-bold text-white">
                {isLoggedIn ? 'Minha conta' : 'Criar conta'}
              </span>
            </div>
          </button>

          {/* Favoritos */}
          <button
            onClick={() => {
              // Filtrar por favoritos se desejado
            }}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition group relative cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#18181f] border border-zinc-800 flex items-center justify-center group-hover:border-red-600 transition relative">
              <Heart className="w-4 h-4 text-zinc-300 group-hover:text-red-500" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {favoritesCount}
                </span>
              )}
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white">Favoritos</span>
            </div>
          </button>

          {/* Carrinho */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#18181f] border border-zinc-800 flex items-center justify-center group-hover:border-red-600 transition relative">
              <ShoppingBag className="w-4 h-4 text-zinc-300 group-hover:text-red-500" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {itemCount}
              </span>
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-[11px] text-zinc-400">Carrinho</span>
              <span className="text-xs font-black text-white">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (full width) */}
      <div className="sm:hidden px-4 pb-2.5">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            placeholder="O que você está procurando?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#18181f] border border-zinc-700/80 rounded-l-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-red-600"
          />
          <button 
            type="button"
            className="bg-red-600 text-white px-3.5 py-2 rounded-r-xl border border-red-600 flex items-center justify-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-bar Categories Navigation (Desktop + Mobile scroll) */}
      {/* Category Bar Navigation */}
      <div className="bg-[#121217] border-t border-zinc-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none no-scrollbar text-xs whitespace-nowrap">
          {NAV_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? 'text-white bg-zinc-800 font-bold border border-zinc-700'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation (se abrir menu hamburguer) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#0d0d11] border-b border-zinc-800 p-4 space-y-3">
          {/* Mobile Login / Perfil */}
          <div className="pb-3 border-b border-zinc-800">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {isLoggedIn && user ? user.name : 'Minha Conta'}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {isLoggedIn && user ? user.email : 'Toque para entrar ou criar conta'}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-red-400">
                {isLoggedIn ? 'Ver Perfil' : 'Entrar'}
              </span>
            </button>
          </div>

          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Navegar por Departamento
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {NAV_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.id);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left p-2 rounded-lg bg-[#18181f] text-zinc-200 hover:text-white hover:bg-red-950/30 font-medium"
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-xs">
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-red-400 font-bold"
            >
              Acessar Painel Lojista
            </Link>
            <span className="text-zinc-500">Nightbox v1.0</span>
          </div>
        </div>
      )}
    </header>
  );
}
