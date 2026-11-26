'use client';

import React from 'react';
import { Truck, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';

export default function TrustBadgesFooter() {
  return (
    <div className="w-full bg-[#0d0d11] border-t border-zinc-800 text-zinc-300 py-6 sm:py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 4 Badges principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-6 border-b border-zinc-800/80 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-white">
              <Truck className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Frete Rápido</div>
              <div className="text-[11px] text-zinc-400">Entrega expressa na sua porta</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Pagamento via Pix</div>
              <div className="text-[11px] text-zinc-400">Aprovação imediata e segura</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-white">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">100% Delivery</div>
              <div className="text-[11px] text-zinc-400">Apenas entrega (sem loja física)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Compra Garantida</div>
              <div className="text-[11px] text-zinc-400">Produtos 100% originais e lacrados</div>
            </div>
          </div>
        </div>

        {/* Marketplaces */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            <span>Também estamos nos maiores marketplaces</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mercado Livre Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffe600] text-blue-900 font-extrabold text-xs shadow">
              <span>mercado</span>
              <span className="text-black">livre</span>
            </div>

            {/* Shopee Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ee4d2d] text-white font-extrabold text-xs shadow">
              <span>Shopee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
