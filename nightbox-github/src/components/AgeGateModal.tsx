'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnderage, setIsUnderage] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('adega_age_verified_v1');
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('adega_age_verified_v1', 'true');
    setIsOpen(false);
  };

  const handleReject = () => {
    setIsUnderage(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600" />
        
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-5">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Você tem mais de 18 anos?
        </h2>

        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          Este site comercializa bebidas alcoólicas. De acordo com o Art. 243 da Lei nº 8.069/90 (ECA), a venda é proibida para menores de 18 anos.
        </p>

        {isUnderage ? (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
            <p>
              Acesso negado. A venda e o consumo de bebidas alcoólicas são proibidos para menores de 18 anos. Beba com responsabilidade.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReject}
              className="w-full py-3 px-4 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 font-medium transition text-sm cursor-pointer"
            >
              Não, sou menor
            </button>
            <button
              onClick={handleConfirm}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold transition text-sm shadow-lg shadow-orange-950/30 cursor-pointer"
            >
              Sim, tenho 18+ anos
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-xs text-zinc-500">
          Se beber, não dirija. Aprecie com moderação.
        </div>
      </div>
    </div>
  );
}
