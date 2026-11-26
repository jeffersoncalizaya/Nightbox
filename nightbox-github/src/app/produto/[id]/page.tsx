'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Snowflake, 
  Flame, 
  ShieldCheck, 
  ShoppingBag, 
  Check, 
  Star 
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { products } = useStore();
  const { addItem, setIsCartOpen } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const product = products.find(p => p.id === productId);

  const [purchaseMode, setPurchaseMode] = useState<'unit' | 'pack'>('unit');
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizeOptions?.[0]?.size || ''
  );
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedPackOption, setSelectedPackOption] = useState<string>('');

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-white">
        <h2 className="text-xl font-bold mb-3">Produto não encontrado</h2>
        <Link href="/" className="px-4 py-2 bg-zinc-800 rounded-xl text-xs font-semibold">
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const activeSizeConfig = product.sizeOptions?.find(s => s.size === selectedSize) || null;
  const currentPackOffer = activeSizeConfig?.packOffer || product.packOffer;
  const currentUnitPrice = activeSizeConfig ? activeSizeConfig.price : product.price;
  const currentOriginalPrice = activeSizeConfig ? activeSizeConfig.originalPrice : product.originalPrice;
  const currentVolume = activeSizeConfig?.volume || (activeSizeConfig ? activeSizeConfig.size : product.volume);

  const hasFlavors = Boolean(product.flavors && product.flavors.length > 0);
  const hasPackOffer = Boolean(currentPackOffer);
  const allowMixed = currentPackOffer?.allowMixedFlavors ?? true;
  const currentFlavor = selectedFlavor || product.flavors?.[0] || '';

  const isBulkDiscountActive = Boolean(
    purchaseMode === 'unit' &&
    product.bulkDiscount &&
    quantity >= product.bulkDiscount.minQuantity
  );

  const effectiveUnitPrice = isBulkDiscountActive && product.bulkDiscount
    ? product.bulkDiscount.pricePerUnit
    : currentUnitPrice;

  const activePrice =
    purchaseMode === 'pack' && currentPackOffer
      ? currentPackOffer.price
      : effectiveUnitPrice;

  const activeOriginalPrice =
    purchaseMode === 'pack' && currentPackOffer
      ? currentPackOffer.originalPrice
      : (isBulkDiscountActive ? currentUnitPrice : currentOriginalPrice);

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    const sizeLabel = selectedSize ? ` ${selectedSize}` : '';

    if (hasFlavors || hasPackOffer) {
      if (purchaseMode === 'pack' && currentPackOffer) {
        const packFlavorChoice =
          selectedPackOption || (product.flavors?.[0] ? `${currentPackOffer.units}x ${product.flavors[0]}` : '');
        addItem(
          {
            ...product,
            id: `${product.id}__${selectedSize || 'std'}__pack__${packFlavorChoice}`,
            name: `${product.name}${sizeLabel} - ${currentPackOffer.label} (${packFlavorChoice})`,
            price: currentPackOffer.price,
            originalPrice: currentPackOffer.originalPrice,
            volume: `${currentPackOffer.units}x ${currentVolume || 'un'}`
          },
          quantity
        );
      } else {
        addItem(
          {
            ...product,
            id: `${product.id}__${selectedSize || 'std'}__unit__${currentFlavor}${isBulkDiscountActive ? '__bulk' : ''}`,
            name: `${product.name}${sizeLabel} - ${product.category === 'narguile' ? 'Cor' : 'Sabor'}: ${currentFlavor}${isBulkDiscountActive ? ' (Desconto 3+ un)' : ''}`,
            price: effectiveUnitPrice,
            originalPrice: isBulkDiscountActive ? currentUnitPrice : currentOriginalPrice,
            volume: currentVolume
          },
          quantity
        );
      }
    } else {
      addItem(product, quantity);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-white">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Cardápio
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-12">
        {/* Foto do Produto */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-zinc-800 p-4 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isCold && (
              <span className="inline-flex items-center gap-1 bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                Estupidamente Gelada
              </span>
            )}
            {product.originalPrice && (
              <span className="inline-flex items-center gap-1 bg-red-950/90 border border-red-500/40 text-red-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                Promoção Especial
              </span>
            )}
            {product.stockCount && product.stockCount <= 10 && (
              <span className="inline-flex items-center gap-1.5 bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg shadow-amber-950/50">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                Apenas {product.stockCount} unidades restantes!
              </span>
            )}
          </div>
        </div>

        {/* Informações e Compra */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating || '4.9'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
              {product.name}
            </h1>

            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Abas de Sabor e Oferta de Pacote */}
            {(hasFlavors || hasPackOffer) && (
              <div className="mb-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                {/* Seletor de Tamanhos (ex: 250ml vs 473ml) */}
                {product.sizeOptions && product.sizeOptions.length > 0 && (
                  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-2">
                    <span className="text-xs font-bold text-zinc-300">Escolha o Tamanho:</span>
                    <div className="flex gap-2">
                      {product.sizeOptions.map(opt => (
                        <button
                          key={opt.size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(opt.size);
                            if (opt.packOffer && !opt.packOffer.allowMixedFlavors && product.flavors?.[0]) {
                              setSelectedPackOption(`${opt.packOffer.units}x ${product.flavors[0]}`);
                            }
                          }}
                          className={`py-1.5 px-3 rounded-lg text-xs font-black transition cursor-pointer ${
                            selectedSize === opt.size
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800'
                          }`}
                        >
                          {opt.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasPackOffer && currentPackOffer && (
                  <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setPurchaseMode('unit')}
                      className={`py-2.5 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                        purchaseMode === 'unit'
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      1 Unid. (R$ {currentUnitPrice.toFixed(2).replace('.', ',')})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPurchaseMode('pack');
                        if (!allowMixed && product.flavors?.[0]) {
                          setSelectedPackOption(`${currentPackOffer.units}x ${product.flavors[0]}`);
                        }
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                        purchaseMode === 'pack'
                          ? 'bg-amber-500 text-zinc-950 shadow-lg'
                          : 'text-amber-400 hover:text-amber-300'
                      }`}
                    >
                      Oferta Pack {currentPackOffer.units} un (R$ {currentPackOffer.price.toFixed(2).replace('.', ',')})
                    </button>
                  </div>
                )}

                {purchaseMode === 'unit' && hasFlavors && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-2">
                      {product.category === 'narguile' ? 'Escolha a cor do seu narguilé:' : 'Escolha o sabor:'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.flavors!.map((flavor) => (
                        <button
                          key={flavor}
                          type="button"
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            currentFlavor === flavor
                              ? 'bg-red-600/20 border-red-500 text-white'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {purchaseMode === 'pack' && hasPackOffer && currentPackOffer && (
                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-2">
                      Escolha o sabor do seu {currentPackOffer.label} por R$ {currentPackOffer.price.toFixed(2).replace('.', ',')}:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allowMixed && (
                        <button
                          type="button"
                          onClick={() => setSelectedPackOption('Todos os sabores (Sortido)')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-left ${
                            selectedPackOption === 'Todos os sabores (Sortido)'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          🔥 Todos os sabores (Sortido)
                        </button>
                      )}
                      {product.flavors?.map((flavor) => {
                        const opt = `${currentPackOffer.units}x ${flavor}`;
                        const isSelected = selectedPackOption === opt || (!selectedPackOption && !allowMixed && flavor === product.flavors?.[0]);
                        return (
                          <button
                            key={flavor}
                            type="button"
                            onClick={() => setSelectedPackOption(opt)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-left ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            Só {flavor} ({currentPackOffer.units} unidades)
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ficha técnica rápida */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
              <div>
                <span className="text-zinc-500 block">Volume / Medida:</span>
                <span className="font-bold text-zinc-200">{product.volume || 'Padrão'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Graduação Alcoólica:</span>
                <span className="font-bold text-zinc-200">{product.alcoholContent || 'Não alcoólico'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Temperatura de Entrega:</span>
                <span className="font-bold text-cyan-400">{product.isCold ? 'Trincando (0° a 4°C)' : 'Ambiente'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Disponibilidade:</span>
                <span className={`font-bold ${product.inStock ? (product.stockCount ? 'text-amber-400' : 'text-emerald-400') : 'text-red-400'}`}>
                  {product.inStock 
                    ? (product.stockCount ? `Apenas ${product.stockCount} un em estoque!` : 'Pronta Entrega') 
                    : 'Esgotado'}
                </span>
              </div>
            </div>
          </div>

          {/* Preço e Botão */}
          <div className="pt-6 border-t border-zinc-800">
            {/* Aviso de Desconto Progressivo */}
            {product.bulkDiscount && (
              <div className={`mb-3 p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                isBulkDiscountActive
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400'
              }`}>
                <span>🏷️</span>
                <span>
                  {isBulkDiscountActive
                    ? `Promoção Ativada! Comprando ${quantity} unidades, cada uma sai por R$ ${product.bulkDiscount.pricePerUnit.toFixed(2).replace('.', ',')}!`
                    : `Leve 3 ou mais unidades e pague apenas R$ ${product.bulkDiscount.pricePerUnit.toFixed(2).replace('.', ',')} cada! (Adicione ${Math.max(1, product.bulkDiscount.minQuantity - quantity)} un para ativar)`}
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-black text-white">
                R$ {activePrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs text-zinc-400">
                {purchaseMode === 'unit' ? '/ unidade' : ''}
              </span>
              {activeOriginalPrice && (
                <span className="text-sm text-zinc-500 line-through">
                  R$ {activeOriginalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Seletor de quantidade */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount || 99, quantity + 1))}
                  className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Botão Adicionar */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-orange-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado ao Carrinho!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar ao Carrinho</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Você também pode gostar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
