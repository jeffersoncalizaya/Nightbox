'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  QrCode, 
  Truck, 
  Store, 
  ChevronRight, 
  ShieldCheck,
  Mail,
  Send
} from 'lucide-react';
import { getOrders } from '@/lib/storage';
import { Order } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { config } = useStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#10b981', '#ffffff']
      });
    } catch (e) {}

    async function loadOrder() {
      if (orderId) {
        const orders = await getOrders();
        const found = orders.find(o => o.id === orderId);
        if (found) {
          setOrder(found);
        }
      }
      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  const handleCopyPix = () => {
    if (order?.pixCopiaECola) {
      navigator.clipboard.writeText(order.pixCopiaECola);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  const getWhatsAppMessage = () => {
    if (!order) return '';
    const itemsText = order.items.map(i => `• ${i.quantity}x ${i.product.name}`).join('%0A');
    const addressText = order.address 
      ? `Endereço: ${order.address.street}, ${order.address.number} - ${order.address.neighborhood}` 
      : 'Retirada na Adega';

    return `*Novo Pedido: ${order.id}*%0A` +
      `Cliente: ${order.customer.name}%0A` +
      `Telefone: ${order.customer.phone}%0A%0A` +
      `*Itens:*%0A${itemsText}%0A%0A` +
      `*Total:* R$ ${order.total.toFixed(2).replace('.', ',')}%0A` +
      `*Pagamento:* ${order.paymentMethod.toUpperCase()}%0A` +
      `*Entrega:* ${addressText}`;
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-white">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-sm">Carregando detalhes do seu pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Pedido Recebido!</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Seu pedido foi registrado com sucesso em nosso sistema.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-sm transition"
        >
          Voltar ao Início
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-white">
      {/* Top Banner de Sucesso */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
          Pedido Confirmado!
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Número do pedido: <strong className="text-amber-400">{order.id}</strong>
        </p>

        {/* Notificação de Confirmação por Gmail */}
        {order.customer.email && (
          <div className="mt-4 mx-auto max-w-md p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>
              Enviamos a confirmação dos detalhes para seu Gmail: <strong className="text-white">{order.customer.email}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Caixa de Ação do Pix (se Pix) */}
      {order.paymentMethod === 'pix' && (order.pixCopiaECola || order.pixQrCode) && (
        <div className="bg-zinc-900 border border-emerald-500/40 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />
          
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <QrCode className="w-5 h-5" />
            <span>Pague com Pix para liberação imediata</span>
          </div>

          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            Aponte a câmera do aplicativo do seu banco para o <strong>QR Code</strong> abaixo ou copie o código <strong>Pix Copia e Cola</strong> para efetuar o pagamento.
          </p>

          {/* Imagem do QR Code Dinâmico */}
          {order.pixQrCode && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl w-fit mx-auto mb-5 shadow-2xl border-4 border-emerald-500/30">
              <img
                src={order.pixQrCode}
                alt="QR Code Pix do Pedido"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
              />
              <span className="text-[11px] font-black text-zinc-800 uppercase tracking-wider mt-2">
                Escaneie com o app do seu Banco
              </span>
            </div>
          )}

          {/* Caixa com Pix Copia e Cola */}
          {order.pixCopiaECola && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={order.pixCopiaECola}
                className="bg-transparent text-xs text-zinc-300 w-full focus:outline-none font-mono truncate"
              />
              <button
                onClick={handleCopyPix}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap transition cursor-pointer shadow-lg active:scale-95"
              >
                {copiedPix ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Código Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Código Pix</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Resumo e Instruções */}
          <div className="text-[11px] text-zinc-300 space-y-1.5 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
              <span className="text-zinc-400">Valor Total:</span>
              <span className="font-black text-emerald-400 text-sm">R$ {order.total.toFixed(2).replace('.', ',')}</span>
            </div>
            <p className="text-zinc-400">1. Abra o app do seu banco preferido (Nubank, Itaú, Bradesco, Inter, etc.)</p>
            <p className="text-zinc-400">2. Escolha <strong>Ler QR Code</strong> ou <strong>Pix Copia e Cola</strong></p>
            <p className="text-zinc-400">3. Confirme o pagamento para iniciar o envio dos produtos!</p>
            {order.customer.email && (
              <p className="text-emerald-400 font-semibold pt-1 border-t border-zinc-800/60 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Assim que o pagamento for concluído, você receberá a confirmação no seu Gmail ({order.customer.email}).</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Card de Detalhes do Pedido */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6 space-y-4">
        <h3 className="font-bold text-sm text-zinc-200 border-b border-zinc-800 pb-3">
          Status da Entrega
        </h3>

        <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            {order.deliveryType === 'delivery' ? <Truck className="w-5 h-5" /> : <Store className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-bold text-sm text-white">
              {order.deliveryType === 'delivery' ? 'Entrega em Domicílio' : 'Retirada no Balcão'}
            </div>
            <div className="text-xs text-zinc-400">
              Tempo estimado: <strong className="text-amber-400">{config.estimatedDeliveryTime}</strong>
            </div>
          </div>
        </div>

        {order.address && (
          <div className="text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300">Endereço de entrega:</span><br />
            {order.address.street}, {order.address.number} - {order.address.neighborhood}
            {order.address.complement && ` (${order.address.complement})`}
          </div>
        )}

        {/* Lista de Itens */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2">
          <div className="text-xs font-semibold text-zinc-400">Itens Comprados:</div>
          {order.items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-xs text-zinc-300">
              <span>{item.quantity}x {item.product.name}</span>
              <span className="font-medium text-white">
                R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}

          <div className="pt-3 border-t border-zinc-800 flex justify-between font-black text-sm text-white">
            <span>Total:</span>
            <span className="text-amber-400">R$ {order.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      {/* Acompanhamento do Pedido */}
      <div className="space-y-3">
        <Link
          href={`/pedidos/${order.id}`}
          className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition cursor-pointer"
        >
          <span>Acompanhar Status do Pedido em Tempo Real</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-white">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-sm">Carregando detalhes do seu pedido...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
