'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, ShoppingBag, X, Check, Flame, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import confetti from 'canvas-confetti';
import { Product } from '@/lib/types';

export const COMBO_FIM_DE_ANO: Product = {
  id: "combo-fim-de-ano-300",
  name: "Super Combo da Virada (Red Label + Fogos + Baly 2L + 6 Gelos de Coco + Narguilé Completo)",
  description: "1 Whisky Johnnie Walker Red Label 1L + 1 Caixa de Foguetão Chorão Colorido (6 un) + 1 Energético Baly Tropical 2L + 6 Gelos de Água de Coco Puro Coco (180ml) + 1 Narguilé Completo (com fogareiro elétrico, abafador e kaloud).",
  price: 300.00,
  originalPrice: 490.00,
  discountPercent: 39,
  category: "fim-de-ano",
  imageUrl: "/images/combo_fim_de_ano.jpg",
  volume: "Kit Completo",
  inStock: true,
  isFlashSale: true,
  featured: true,
  rating: 5.0,
  reviewsCount: 489,
  isFastShipping: true
};

export default function FlashSaleHeader() {
  const { addItem, setIsCartOpen } = useCart();
  const { config } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem(COMBO_FIM_DE_ANO, 1);
    setIsCartOpen(true);
    setAddedSuccess(true);
    
    // Efeito comemorativo de confetes
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignora erro se não suportado
    }

    setTimeout(() => {
      setAddedSuccess(false);
      setIsModalOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* Banner Principal Clicável */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-gradient-to-r from-[#16131d] via-[#1f121a] to-[#16131d] border-2 border-red-600/40 hover:border-red-500 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xl relative overflow-hidden cursor-pointer transition-all duration-300 group hover:shadow-red-950/40"
      >
        {/* Glows de Fundo */}
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/30 transition-colors" />
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
          
          {/* Lado Esquerdo: Imagem + Detalhes */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full lg:w-auto">
            {/* Foto do Combo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-red-500/50 flex-shrink-0 shadow-lg shadow-red-950/60 group-hover:scale-105 transition-transform duration-300 bg-black">
              <Image 
                src="/images/combo_fim_de_ano.jpg" 
                alt="Super Combo Fim de Ano"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 112px"
              />
              <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider shadow">
                -29%
              </span>
            </div>

            {/* Textos da Oferta */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-600 text-white shadow-sm shadow-red-600/50">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  Oferta de Fim de Ano
                </span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Limitado até durar o estoque
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase group-hover:text-red-400 transition-colors">
                Super Combo da Virada
              </h2>

              {/* Itens do Combo */}
              <p className="text-xs sm:text-sm text-zinc-300 font-semibold mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span className="text-white font-bold">1x Whisky Red Label 1L</span>
                <span className="text-red-500">•</span>
                <span className="text-amber-300 font-bold">🎆 Caixa Foguetão Chorão (6 un)</span>
                <span className="text-red-500">•</span>
                <span className="text-white font-bold">1 Baly Tropical 2L</span>
                <span className="text-red-500">•</span>
                <span className="text-cyan-300 font-bold">6 Gelos Puro Coco</span>
                <span className="text-red-500">•</span>
                <span className="text-white font-bold">Narguilé Completo Kit</span>
              </p>
            </div>
          </div>

          {/* Lado Direito: Preço + Botões de Ação */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4 w-full sm:w-auto justify-center">
            {/* Preço */}
            <div className="text-center sm:text-right">
              <span className="text-xs text-zinc-400 line-through block">De R$ 490,00</span>
              <div className="flex items-baseline justify-center sm:justify-end gap-1">
                <span className="text-xs font-bold text-red-400">R$</span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">300,00</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block">Economize R$ 190,00</span>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-600/40 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Adicionado!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Aproveitar por R$ 300</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Interativo com os Detalhes da Oferta */}
      {isModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-combo-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#121217] border border-red-900/60 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagem de Capa do Combo */}
            <div className="relative w-full h-56 sm:h-64 bg-zinc-950">
              <Image 
                src="/images/combo_fim_de_ano.jpg" 
                alt="Super Combo Fim de Ano Completo"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/40" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  Especial Fim de Ano
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white font-bold text-xs uppercase tracking-wide">
                  Frete Rápido
                </span>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <h3 id="modal-combo-title" className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  Super Combo da Virada
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tudo o que você precisa para o seu rolê e réveillon completo em um único pedido!
                </p>
              </div>

              {/* Itens Inclusos */}
              <div className="bg-[#181822] border border-zinc-800 rounded-2xl p-4 space-y-2.5">
                <span className="text-[11px] font-black uppercase text-red-400 tracking-wider block">
                  Itens inclusos neste combo:
                </span>

                <div className="space-y-2 text-xs sm:text-sm text-zinc-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-black text-xs">
                      1x
                    </span>
                    <span className="font-bold text-white">Whisky Johnnie Walker Red Label 1L</span>
                    <span className="text-[11px] text-zinc-400 ml-auto">Original Escocês</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                      1x
                    </span>
                    <span className="font-bold text-white">Caixa Foguetão Chorão Colorido (6 un)</span>
                    <span className="text-[11px] text-amber-300 ml-auto font-bold">Piromania Fogos</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-black text-xs">
                      1x
                    </span>
                    <span className="font-bold text-white">Energético Baly Tropical 2L</span>
                    <span className="text-[11px] text-zinc-400 ml-auto">Garrafa 2 Litros</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-black text-xs">
                      6x
                    </span>
                    <span className="font-bold text-white">Gelos de Água de Coco Puro Coco (180ml)</span>
                    <span className="text-[11px] text-zinc-400 ml-auto">6 Caixas Originais</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-black text-xs">
                      1x
                    </span>
                    <span className="font-bold text-white">Narguilé Completo Kit</span>
                    <span className="text-[11px] text-zinc-400 ml-auto">Fogareiro, Kaloud e Abafador</span>
                  </div>
                </div>
              </div>

              {/* Box de Preço */}
              <div className="flex items-center justify-between p-3.5 bg-red-950/20 border border-red-900/40 rounded-xl">
                <div>
                  <span className="text-xs text-zinc-400 line-through block">De R$ 490,00</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-red-400">R$</span>
                    <span className="text-3xl font-black text-white">300,00</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
                    Economize R$ 190,00
                  </span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-300" />
                      <span>Combo Adicionado ao Carrinho!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Colocar no Carrinho (R$ 300,00)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
