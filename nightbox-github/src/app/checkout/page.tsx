'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  Truck, 
  Store, 
  Lock,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  Tag,
  Check,
  Percent
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Order, PaymentMethod } from '@/lib/types';
import { saveOrder } from '@/lib/storage';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const { 
    items, 
    subtotal, 
    deliveryFee, 
    discount, 
    total, 
    deliveryType, 
    setDeliveryType,
    address, 
    setAddress, 
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart 
  } = useCart();
  const { config } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      setCouponFeedback({ message: 'Cupom de 10% aplicado com sucesso!', isError: false });
      setCouponInput('');
    } else {
      setCouponFeedback({ message: 'Cupom inválido. Tente primeiraCompra10', isError: true });
    }
    setTimeout(() => setCouponFeedback(null), 3500);
  };

  const [customer, setCustomer] = useState({
    name: user ? user.name : '',
    phone: '',
    cpf: '',
  });

  // Atualiza automaticamente o nome se o usuário fizer login durante a sessão
  React.useEffect(() => {
    if (user && !customer.name) {
      setCustomer(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cartão de crédito formulário
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1',
  });

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Seu carrinho está vazio</h2>
        <p className="text-zinc-400 mb-6 text-sm">Adicione alguns produtos antes de prosseguir para o checkout.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm shadow-lg hover:from-amber-600 hover:to-orange-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLoggedIn) {
      setErrorMessage('Você precisa entrar ou criar uma conta antes de finalizar o pedido.');
      openAuthModal();
      return;
    }

    if (!customer.name.trim() || !customer.phone.trim()) {
      setErrorMessage('Por favor, preencha seu nome e telefone.');
      return;
    }

    if (deliveryType === 'delivery') {
      if (!address.street.trim() || !address.number.trim() || !address.neighborhood.trim()) {
        setErrorMessage('Por favor, preencha o endereço completo para entrega.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderId = `PED-${Date.now().toString().slice(-6)}`;
      
      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
          ...customer,
          email: user?.email,
        },
        deliveryType,
        address: deliveryType === 'delivery' ? address : undefined,
        items,
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'pix' ? 'pending' : (paymentMethod === 'credit_card' ? 'approved' : 'pending'),
        orderStatus: 'pending',
        notes,
        changeFor: paymentMethod === 'cash' && changeFor ? Number(changeFor) : undefined,
      };

      // Tenta processar via API do Mercado Pago
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: newOrder,
            accessToken: config.mercadoPagoAccessToken,
            storeConfig: {
              pixKey: config.pixKey,
              pixMerchantName: config.pixMerchantName,
              pixMerchantCity: config.pixMerchantCity,
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.pixCopiaECola) {
            newOrder.pixCopiaECola = data.pixCopiaECola;
          }
          if (data.pixQrCode) {
            newOrder.pixQrCode = data.pixQrCode;
          }
        }
      } catch (err) {
        console.warn('Fallback local para checkout:', err);
      }

      // Salva o pedido localmente e/ou no Supabase
      await saveOrder(newOrder);

      // Limpa carrinho
      clearCart();

      // Redireciona para tela de confirmação/sucesso
      router.push(`/checkout/sucesso?orderId=${orderId}`);
    } catch (err: any) {
      setErrorMessage('Ocorreu um erro ao processar seu pedido. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-white">
      {/* Botão Voltar */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuar Comprando
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black mb-8 tracking-tight">
        Finalizar Pedido
      </h1>

      {/* Alerta / Banner se não estiver logado */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Faça login para finalizar seu pedido</div>
              <div className="text-xs text-amber-300/80">
                É necessário estar conectado com seu nome e senha para confirmar a entrega.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={openAuthModal}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer whitespace-nowrap"
          >
            Entrar ou Criar Conta
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Principal: Formulários */}
        <div className="lg:col-span-7 space-y-6">
          {/* Seção 1: Dados do Cliente */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-4">
              <User className="w-4 h-4" />
              <span>1. Seus Dados de Contato</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    CPF (opcional para nota fiscal)
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={customer.cpf}
                    onChange={(e) => setCustomer({ ...customer, cpf: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Tipo de Entrega & Endereço */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>2. Modalidade de Entrega</span>
            </div>

            {/* Modalidade 100% Delivery */}
            <div className="mb-5 p-3.5 bg-red-950/20 border border-red-900/40 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Atendimento Exclusivo por Entrega (Delivery)</span>
                <span className="text-zinc-400">Não possuímos loja física para retirada. Entregamos direto no endereço abaixo:</span>
              </div>
            </div>

            {deliveryType === 'delivery' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Rua / Avenida *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rua das Flores"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Centro"
                      value={address.neighborhood}
                      onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Complemento (Apto, Bloco)
                    </label>
                    <input
                      type="text"
                      placeholder="Apto 42"
                      value={address.complement || ''}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Ponto de Referência
                  </label>
                  <input
                    type="text"
                    placeholder="Próximo à padaria / portão preto"
                    value={address.reference || ''}
                    onChange={(e) => setAddress({ ...address, reference: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1">
                <div className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-amber-500" />
                  <span>Endereço de Retirada:</span>
                </div>
                <p className="text-zinc-400">{config.address}</p>
                <p className="text-amber-400 font-semibold pt-1">Retirada grátis em até 15 minutos após aprovação!</p>
              </div>
            )}
          </div>

          {/* Seção 3: Forma de Pagamento */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
              <QrCode className="w-4 h-4" />
              <span>3. Forma de Pagamento (Exclusivo via Pix)</span>
            </div>

            <div className="mb-4">
              <div className="p-4 rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/25 flex items-center gap-3.5 shadow-lg shadow-emerald-950/40">
                <div className="w-11 h-11 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black text-xl shadow-md">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm sm:text-base text-white">Pix Online Instantâneo</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Ativo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Aprovação em segundos • Pagamento via QR Code ou Copia e Cola
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Pix */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-white">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Como funciona o pagamento:</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Ao clicar no botão de finalizar, você receberá a chave <strong>Copia e Cola</strong> e o <strong>QR Code Pix</strong>. Assim que você pagar no app do seu banco, o sistema reconhece o pagamento na hora e seu pedido é separado imediatamente para envio!
              </p>
            </div>

            {/* Observações do Pedido */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Observações do Pedido (opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Não tocar a campainha, chamar no WhatsApp quando chegar, enviar gelo bem firme."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Coluna Lateral: Cupom + Resumo do Pedido */}
        <div className="lg:col-span-5 space-y-4">
          {/* Aba / Card de Cupom de Desconto */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider mb-2.5">
              <Tag className="w-4 h-4" />
              <span>Cupom de Desconto</span>
            </div>

            {couponCode ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Cupom <strong>{couponCode}</strong> aplicado!</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Remover
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Digite seu cupom"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-red-600 transition font-mono tracking-wider"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md shadow-red-600/30 whitespace-nowrap active:scale-95"
                  >
                    Aplicar
                  </button>
                </div>

                {couponFeedback && (
                  <p className={`text-[11px] font-semibold ${couponFeedback.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Área Resumo dos Itens */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 sticky top-24">
            <h3 className="font-extrabold text-base text-white mb-4 flex items-center justify-between">
              <span>Resumo dos Itens</span>
              <span className="text-xs font-normal text-zinc-400">({items.length} produtos)</span>
            </h3>

            {/* Itens */}
            <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-bold text-amber-500">{item.quantity}x</span>
                    <span className="truncate">{item.product.name}</span>
                  </div>
                  <span className="font-semibold text-white whitespace-nowrap">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotais */}
            <div className="space-y-2 text-xs text-zinc-400 pt-4 border-t border-zinc-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxa de Entrega</span>
                <span className={deliveryFee === 0 ? 'text-emerald-400 font-semibold' : 'text-white font-medium'}>
                  {deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Desconto ({couponCode})</span>
                  <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-black text-white pt-3 border-t border-zinc-800">
                <span>Total a Pagar</span>
                <span className="text-red-500 font-black">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Botão de Finalização */}
            {isLoggedIn ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide shadow-xl shadow-red-950/40 transition transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gerando Pedido...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Confirmar e Gerar Chave Pix</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="w-full mt-6 py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm tracking-wide shadow-xl shadow-red-950/40 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-5 h-5 text-white" />
                <span>Entrar para Finalizar Pedido</span>
              </button>
            )}

            <div className="mt-4 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-center gap-1.5 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compra 100% protegida • Pagamento Exclusivo via Pix</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
