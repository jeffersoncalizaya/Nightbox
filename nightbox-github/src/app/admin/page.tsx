'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Bike, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  Store, 
  Package, 
  Settings, 
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/lib/storage';
import { Order, OrderStatus } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

export default function AdminDashboard() {
  const { config, updateConfig } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: nextStatus } : o));
  };

  const handleToggleStoreOpen = async () => {
    await updateConfig({ isOpen: !config.isOpen });
  };

  // Estatísticas
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders
    .filter(o => ['pending', 'paid', 'preparing', 'delivering'].includes(o.orderStatus))
    .length;

  const averageTicket = orders.length > 0 ? totalRevenue / orders.length : 0;

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'todos' || o.orderStatus === filterStatus;
    const matchesSearch = searchQuery === '' || 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-semibold">Pendente</span>;
      case 'paid':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">Pago</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">Em Preparo</span>;
      case 'delivering':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">A Caminho</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold">Entregue</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">Cancelado</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-white">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Painel do Gerente / Lojista</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Gestão da Adega
          </h1>
        </div>

        {/* Navigation & Store Switch */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Botão Aberto/Fechado */}
          <button
            onClick={handleToggleStoreOpen}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition cursor-pointer ${
              config.isOpen
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/60'
                : 'bg-red-950/40 border-red-500/40 text-red-400 hover:bg-red-950/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${config.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span>{config.isOpen ? 'Loja Aberta' : 'Loja Fechada'} (Alternar)</span>
          </button>

          <Link
            href="/admin/produtos"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs flex items-center gap-2 transition"
          >
            <Package className="w-4 h-4 text-amber-500" />
            <span>Produtos</span>
          </Link>

          <Link
            href="/admin/configuracoes"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs flex items-center gap-2 transition"
          >
            <Settings className="w-4 h-4 text-amber-500" />
            <span>Configurações</span>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Faturamento Bruto</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Total de pedidos aprovados</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Pedidos Ativos</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {activeOrdersCount}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Necessitam de atenção ou entrega</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Ticket Médio</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            R$ {averageTicket.toFixed(2).replace('.', ',')}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Média gasta por cliente</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span>Total de Pedidos</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {orders.length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Registrados no sistema</div>
        </div>
      </div>

      {/* Tabela / Lista de Pedidos em Tempo Real */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-white">
              Pedidos Recebidos
            </h2>
            <button
              onClick={loadData}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Atualizar pedidos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Filtros e Busca */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por cliente ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              {['todos', 'pending', 'preparing', 'delivering', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-medium ${
                    filterStatus === status ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : status === 'pending' ? 'Pendentes' : status === 'preparing' ? 'Preparo' : status === 'delivering' ? 'A Caminho' : 'Entregues'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            Nenhum pedido encontrado para esse filtro.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-zinc-700 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      #{order.id}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                    <span className="text-zinc-500 text-xs">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{order.customer.name}</span>
                    <a
                      href={`https://wa.me/55${order.customer.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(order.customer.name)}!%20Estamos%20falando%20da%20Adega%20sobre%20seu%20pedido%20${order.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 font-normal"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{order.customer.phone}</span>
                    </a>
                  </div>

                  <div className="text-xs text-zinc-400">
                    {order.deliveryType === 'delivery' && order.address ? (
                      <span>📍 {order.address.street}, {order.address.number} - {order.address.neighborhood}</span>
                    ) : (
                      <span>🏪 Retirada no balcão</span>
                    )}
                  </div>

                  {/* Resumo de itens */}
                  <div className="text-xs text-zinc-300 pt-1">
                    {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(' • ')}
                  </div>

                  {order.notes && (
                    <div className="text-xs text-amber-400/90 bg-amber-950/20 p-2 rounded-lg border border-amber-900/30">
                      <strong>Obs do cliente:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Preço e Botões de Ação de Status */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 uppercase font-medium">
                      Pagamento: <strong className="text-white">{order.paymentMethod}</strong>
                    </div>
                    <div className="text-lg font-black text-amber-400">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  {/* Botões de avanço de status */}
                  <div className="flex flex-wrap items-center gap-2">
                    {order.orderStatus === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Iniciar Preparo
                      </button>
                    )}

                    {order.orderStatus === 'preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivering')}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Despachar (A Caminho)</span>
                      </button>
                    )}

                    {order.orderStatus === 'delivering' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluir Entrega</span>
                      </button>
                    )}

                    {order.orderStatus !== 'cancelled' && order.orderStatus !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 text-xs transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}

                    <Link
                      href={`/pedidos/${order.id}`}
                      target="_blank"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
                    >
                      Ver Rastreio
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
