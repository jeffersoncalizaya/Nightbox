'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, MapPin, Clock } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { config } = useStore();

  return (
    <footer className="w-full bg-[#0a0a0d] border-t border-zinc-800 text-zinc-400 text-sm mt-12 pb-16 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-flex flex-col items-start">
              <div className="flex items-center gap-1 font-black text-2xl tracking-tighter leading-none">
                <span className="text-white">NIGHT</span>
                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded font-black text-xl shadow-md">
                  BOX
                </span>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">
                TUDO PARA SEU ROLÊ
              </span>
            </Link>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed">
              O seu delivery e conveniência número 1 da noite. Bebidas trincando de geladas, combos especiais, narguilé, pods, gelo e carvão entregues onde você estiver.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-300 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantia de procedência 100% original e produtos lacrados.</span>
            </div>
          </div>

          {/* Atendimento & Delivery */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-white text-sm tracking-wide uppercase">Atendimento</h4>
            <div className="flex items-start gap-2 text-zinc-400">
              <Clock className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{config.openingHours}</span>
            </div>
            <div className="flex items-start gap-2 text-zinc-300">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="font-medium">100% Online • Apenas Entregas / Delivery (Sem loja física)</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{config.phone}</span>
            </div>
          </div>

          {/* Formas de Pagamento & Segurança */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm tracking-wide uppercase">Formas de Pagamento</h4>
            <div className="flex flex-wrap gap-2 text-zinc-300">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                ⚡ Exclusivo via Pix Instantâneo
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 pt-1">
              Confirmação em tempo real e separação imediata do seu pedido.
            </div>
          </div>
        </div>

        {/* Warning bar & Copyright */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-zinc-500">
          <div>
            <p className="text-zinc-400 font-medium mb-1">
              PROIBIDA A VENDA DE BEBIDAS ALCOÓLICAS E PRODUTOS COM NICOTINA PARA MENORES DE 18 ANOS.
            </p>
            <p>
              Aprecie com moderação. Se beber, não dirija.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/admin" className="text-zinc-400 hover:text-red-400 transition">
              Painel do Lojista
            </Link>
            <span>•</span>
            <span>© {new Date().getFullYear()} NIGHTBOX. Todos os direitos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
