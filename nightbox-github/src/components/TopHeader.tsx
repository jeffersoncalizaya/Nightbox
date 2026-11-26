'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Truck, ShieldCheck, CheckCircle2, Headphones, Package } from 'lucide-react';

export default function TopHeader() {
  return (
    <div className="bg-zinc-950 border-b border-zinc-800/80 text-[11px] text-zinc-400 py-1.5 px-4 hidden sm:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Localização */}
        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
          <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <span>Entrega para <strong className="text-white font-semibold">São Paulo - SP</strong></span>
        </div>

        {/* Badges de confiança centrais */}
        <div className="hidden lg:flex items-center gap-6 text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-zinc-300" />
            <span>Frete rápido para todo o Brasil</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
            <span>Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300" />
            <span>Produtos originais</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-zinc-300" />
            <span>Suporte 24/7</span>
          </div>
        </div>

        {/* Rastreio */}
        <div>
          <Link 
            href="/admin" 
            className="flex items-center gap-1 text-zinc-300 hover:text-white transition font-medium"
          >
            <Package className="w-3.5 h-3.5 text-zinc-400" />
            <span>Acompanhe seu pedido</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
