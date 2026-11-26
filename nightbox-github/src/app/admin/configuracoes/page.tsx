'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Check, 
  Store, 
  CreditCard, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Database,
  ExternalLink
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminSettingsPage() {
  const { config, updateConfig } = useStore();
  const [form, setForm] = useState({ ...config });
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateConfig({
      name: form.name,
      tagline: form.tagline,
      phone: form.phone,
      whatsapp: form.whatsapp,
      address: form.address,
      openingHours: form.openingHours,
      estimatedDeliveryTime: form.estimatedDeliveryTime,
      defaultDeliveryFee: Number(form.defaultDeliveryFee),
      freeDeliveryThreshold: form.freeDeliveryThreshold ? Number(form.freeDeliveryThreshold) : undefined,
      mercadoPagoPublicKey: form.mercadoPagoPublicKey,
      mercadoPagoAccessToken: form.mercadoPagoAccessToken,
      pixKey: form.pixKey,
      pixMerchantName: form.pixMerchantName,
      pixMerchantCity: form.pixMerchantCity,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-white">
      {/* Top Header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Configurações da Loja
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Personalize informações de contato, taxas de entrega e integração Mercado Pago / Supabase.
          </p>
        </div>

        {savedFeedback && (
          <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção 1: Dados Básicos da Adega */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
            <Store className="w-4 h-4" />
            <span>Dados da Adega</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Nome Fantasia da Adega</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Slogan / Frase de Impacto</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Telefone de Contato</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">WhatsApp para Pedidos (com DDI e DDD, ex: 5511987654321)</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Endereço Físico Completo (Para Retiradas)</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Horário de Atendimento / Funcionamento</label>
            <input
              type="text"
              value={form.openingHours}
              onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Seção 2: Prazos e Taxas de Entrega */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
            <Truck className="w-4 h-4" />
            <span>Prazos e Taxas de Delivery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Tempo Estimado</label>
              <input
                type="text"
                placeholder="25 - 40 min"
                value={form.estimatedDeliveryTime}
                onChange={(e) => setForm({ ...form, estimatedDeliveryTime: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Taxa de Entrega Padrão (R$)</label>
              <input
                type="number"
                step="0.10"
                value={form.defaultDeliveryFee}
                onChange={(e) => setForm({ ...form, defaultDeliveryFee: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Frete Grátis a partir de (R$)</label>
              <input
                type="number"
                step="1"
                placeholder="120.00"
                value={form.freeDeliveryThreshold || ''}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: parseFloat(e.target.value) || undefined })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Seção 2.5: Chave Pix Direta do Dono (Banco Central) */}
        <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <CreditCard className="w-4 h-4" />
            <span>Chave Pix do Dono da Loja (Recebimento Direto sem Taxas)</span>
          </div>

          <p className="text-xs text-zinc-400">
            Os pedidos pagos via Pix geram um QR Code oficial do Banco Central e o valor exato da compra cai direto na sua conta bancária.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Chave Pix</label>
              <input
                type="text"
                placeholder="CPF, CNPJ, Celular, E-mail ou Chave Aleatória"
                value={form.pixKey || ''}
                onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome do Titular da Conta</label>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={form.pixMerchantName || ''}
                  onChange={(e) => setForm({ ...form, pixMerchantName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Cidade do Titular</label>
                <input
                  type="text"
                  placeholder="São Paulo"
                  value={form.pixMerchantCity || ''}
                  onChange={(e) => setForm({ ...form, pixMerchantCity: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seção 3: Credenciais Mercado Pago */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>Integração Mercado Pago (Pix & Cartão)</span>
            </div>
            <a
              href="https://www.mercadopago.com.br/developers/panel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1"
            >
              <span>Painel de Desenvolvedores MP</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-zinc-400">
            Adicione suas credenciais do Mercado Pago para receber pagamentos reais diretamente na conta do cliente. Sem essas chaves, o sistema roda em modo demonstração automático para validação visual.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Public Key (Chave Pública)</label>
              <input
                type="text"
                placeholder="APP_USR-..."
                value={form.mercadoPagoPublicKey || ''}
                onChange={(e) => setForm({ ...form, mercadoPagoPublicKey: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Access Token (Token de Acesso)</label>
              <input
                type="password"
                placeholder="APP_USR-..."
                value={form.mercadoPagoAccessToken || ''}
                onChange={(e) => setForm({ ...form, mercadoPagoAccessToken: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Seção 4: Status do Banco de Dados / Supabase */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>Banco de Dados & Nuvem</span>
          </div>

          <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <div className="font-bold text-white">Status da Conexão Supabase</div>
              <div className="text-zinc-400">
                {isSupabaseConfigured
                  ? 'Conectado à nuvem Supabase com persistência remota.'
                  : 'Modo Local ativo (LocalStorage + Cache). Funciona imediatamente sem depender de setup externo.'}
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full font-bold ${
              isSupabaseConfigured
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-300'
            }`}>
              {isSupabaseConfigured ? 'Supabase Online' : 'Armazenamento Local'}
            </span>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm shadow-xl shadow-orange-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
}
