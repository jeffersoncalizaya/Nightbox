'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Truck, 
  Store,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeItem, 
    updateQuantity, 
    clearCart,
    deliveryType,
    setDeliveryType,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
    subtotal,
    deliveryFee,
    total,
    isFreeDelivery
  } = useCart();
  
  const { config } = useStore();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

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
    setTimeout(() => setCouponFeedback(null), 3000);
  };

  const remainingForFreeDelivery = config.freeDeliveryThreshold 
    ? Math.max(0, config.freeDeliveryThreshold - subtotal)
    : 0;

  const freeDeliveryProgress = config.freeDeliveryThreshold
    ? Math.min(100, (subtotal / config.freeDeliveryThreshold) * 100)
    : 100;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h2 className="font-extrabold text-lg text-white">Meu Carrinho</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Mode Selector (100% Delivery) */}
          <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Truck className="w-4 h-4 text-red-500" />
              <span className="font-bold">Entrega Expressa no Endereço</span>
            </div>
            <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full font-bold">
              100% Delivery
            </span>
          </div>

          {/* Free Delivery Progress Bar (for delivery mode) */}
          {deliveryType === 'delivery' && config.freeDeliveryThreshold && (
            <div className="px-4 py-2.5 bg-red-950/20 border-b border-zinc-800 text-xs">
              {remainingForFreeDelivery > 0 ? (
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Falta <strong>R$ {remainingForFreeDelivery.toFixed(2).replace('.', ',')}</strong> para frete grátis!</span>
                    <span className="text-red-400 font-bold">{Math.round(freeDeliveryProgress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parabéns! Você ganhou Frete Grátis neste pedido.</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-white text-base mb-1">Seu carrinho está vazio</h3>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Navegue pelo catálogo e adicione suas bebidas favoritas para curtir a resenha!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition cursor-pointer"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.product.id}
                  className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-contain bg-white p-1 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-xs text-zinc-400 mb-2 flex items-center gap-1.5 flex-wrap">
                      <span>
                        R$ {(item.product.bulkDiscount && item.quantity >= item.product.bulkDiscount.minQuantity ? item.product.bulkDiscount.pricePerUnit : item.product.price).toFixed(2).replace('.', ',')} {item.product.volume ? `(${item.product.volume})` : ''}
                      </span>
                      {item.product.bulkDiscount && item.quantity >= item.product.bulkDiscount.minQuantity && (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded">
                          Promo 3+ (R$ 69,99 un)
                        </span>
                      )}
                    </div>

                    {/* Counter and Subtotal */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-xs text-white">
                          R$ {((item.product.bulkDiscount && item.quantity >= item.product.bulkDiscount.minQuantity ? item.product.bulkDiscount.pricePerUnit : item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                    title="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cupom (ex: PRIMEIRACOMPRA)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-zinc-700 transition cursor-pointer"
                >
                  Aplicar
                </button>
              </form>

              {couponFeedback && (
                <div className={`text-xs flex items-center gap-1.5 ${couponFeedback.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {couponFeedback.isError ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{couponFeedback.message}</span>
                </div>
              )}

              {couponCode && (
                <div className="flex items-center justify-between text-xs bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg text-emerald-300">
                  <span>Cupom <strong>{couponCode}</strong> aplicado!</span>
                  <button 
                    onClick={removeCoupon} 
                    className="text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Entrega ({deliveryType === 'delivery' ? 'Delivery' : 'Retirada'})</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-semibold' : 'text-white font-medium'}>
                    {deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="text-red-500 font-black">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="pt-2">
                {isLoggedIn ? (
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-950/50 transition transform active:scale-98 cursor-pointer"
                  >
                    <span>Finalizar Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      openAuthModal();
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 transition transform active:scale-98 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Entrar ou Criar Conta para Finalizar</span>
                  </button>
                )}

                <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-zinc-500">
                  <button
                    onClick={clearCart}
                    className="hover:text-red-400 transition cursor-pointer"
                  >
                    Esvaziar carrinho
                  </button>
                  <span>Pagamento seguro via Pix & Cartão</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
