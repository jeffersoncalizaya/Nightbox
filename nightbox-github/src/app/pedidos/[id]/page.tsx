'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Bike, 
  CheckCheck, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { getOrders } from '@/lib/storage';
import { Order, OrderStatus } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'pending', label: 'Pedido Recebido', desc: 'Aguardando confirmação do pagamento' },
  { key: 'paid', label: 'Pagamento Aprovado', desc: 'Confirmado pelo sistema' },
  { key: 'preparing', label: 'Separando Bebidas', desc: 'Separando e embalando seus produtos gelados' },
  { key: 'delivering', label: 'A Caminho', desc: 'O motoboy está indo até o seu endereço' },
  { key: 'completed', label: 'Entregue', desc: 'Pedido entregue com sucesso. Boa resenha!' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { config } = useStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const orders = await getOrders();
      const found = orders.find(o => o.id === orderId);
      if (found) {
        setOrder(found);
      }
      setLoading(false);
    }
    fetchOrder();

    // Polling a cada 6 segundos para acompanhar em tempo real
    const interval = setInterval(fetchOrder, 6000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-white">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-sm">Consultando status do pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-white">
        <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-2">Pedido não encontrado</h2>
        <p className="text-zinc-400 text-xs mb-6">Verifique se o código informado está correto.</p>
        <Link href="/" className="px-4 py-2 bg-zinc-800 rounded-xl text-xs font-semibold">
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.orderStatus);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-white">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à Loja
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-6">
          <div>
            <span className="text-xs text-zinc-400">Status em Tempo Real:</span>
            <h1 className="text-xl sm:text-2xl font-black text-amber-400">
              Pedido {order.id}
            </h1>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-xs text-zinc-400">Estimativa de Chegada:</span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 justify-start sm:justify-end">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{config.estimatedDeliveryTime}</span>
            </div>
          </div>
        </div>

        {/* Stepper Vertical */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
          {STATUS_STEPS.map((step, idx) => {
            const isDone = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="relative flex items-start gap-4">
                <div 
                  className={`absolute -left-6 w-4 h-4 rounded-full border-2 transition ${
                    isDone 
                      ? 'bg-amber-500 border-amber-500 shadow-md shadow-amber-500/40' 
                      : 'bg-zinc-900 border-zinc-700'
                  }`}
                />
                <div>
                  <div className={`text-sm font-bold ${isCurrent ? 'text-amber-400' : isDone ? 'text-white' : 'text-zinc-500'}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalhes do Cliente e Endereço */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-xs text-zinc-300 space-y-3">
        <h3 className="font-bold text-sm text-white border-b border-zinc-800 pb-2">
          Dados da Entrega
        </h3>
        
        {order.address ? (
          <div>
            <strong>Endereço:</strong> {order.address.street}, {order.address.number} - {order.address.neighborhood}
            {order.address.reference && <div><strong>Referência:</strong> {order.address.reference}</div>}
          </div>
        ) : (
          <div>Retirada no Balcão da Adega: {config.address}</div>
        )}

        <div>
          <strong>Cliente:</strong> {order.customer.name} ({order.customer.phone})
        </div>

        <div>
          <strong>Forma de Pagamento:</strong> {order.paymentMethod.toUpperCase()} (R$ {order.total.toFixed(2).replace('.', ',')})
        </div>

        <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
          <span>Dúvidas com seu pedido?</span>
          <a
            href={`https://wa.me/${config.whatsapp}?text=Ol%C3%A1,%20gostaria%20de%20saber%20sobre%20meu%20pedido%20${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Falar com o Suporte</span>
          </a>
        </div>
      </div>
    </div>
  );
}
