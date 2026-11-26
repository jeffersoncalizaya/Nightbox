'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Star, Truck, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);

  // 'unit' = 1 unidade (escolhe sabor), 'pack' = oferta pacote fechado
  const [purchaseMode, setPurchaseMode] = useState<'unit' | 'pack'>('unit');
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeOptions?.[0]?.size || ''
  );

  const activeSizeConfig = product.sizeOptions?.find(s => s.size === selectedSize) || null;
  const currentPackOffer = activeSizeConfig?.packOffer || product.packOffer;
  const currentUnitPrice = activeSizeConfig ? activeSizeConfig.price : product.price;
  const currentOriginalPrice = activeSizeConfig ? activeSizeConfig.originalPrice : product.originalPrice;
  const currentVolume = activeSizeConfig?.volume || (activeSizeConfig ? activeSizeConfig.size : product.volume);

  const hasFlavors = Boolean(product.flavors && product.flavors.length > 0);
  const hasPackOffer = Boolean(currentPackOffer);
  const allowMixed = currentPackOffer?.allowMixedFlavors ?? true;

  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product.flavors?.[0] || ''
  );
  const [selectedPackOption, setSelectedPackOption] = useState<string>(
    allowMixed ? 'Todos os sabores (Sortido)' : (product.flavors?.[0] ? `${currentPackOffer?.units || 6}x ${product.flavors[0]}` : '')
  );

  const favorited = isFavorite(product.id);

  const activePrice =
    purchaseMode === 'pack' && currentPackOffer
      ? currentPackOffer.price
      : currentUnitPrice;

  const activeOriginalPrice =
    purchaseMode === 'pack' && currentPackOffer
      ? currentPackOffer.originalPrice
      : currentOriginalPrice;

  const discount = activeOriginalPrice
    ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
    : product.discountPercent || null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const sizeLabel = selectedSize ? ` ${selectedSize}` : '';

    if (hasFlavors || hasPackOffer) {
      if (purchaseMode === 'pack' && currentPackOffer) {
        const packFlavorChoice =
          selectedPackOption || (product.flavors?.[0] ? `${currentPackOffer.units}x ${product.flavors[0]}` : '');
        const variantProduct: Product = {
          ...product,
          id: `${product.id}__${selectedSize || 'std'}__pack__${packFlavorChoice}`,
          name: `${product.name}${sizeLabel} - ${currentPackOffer.label} (${packFlavorChoice})`,
          price: currentPackOffer.price,
          originalPrice: currentPackOffer.originalPrice,
          volume: `${currentPackOffer.units}x ${currentVolume || 'un'}`
        };
        addItem(variantProduct, 1);
      } else {
        const variantProduct: Product = {
          ...product,
          id: `${product.id}__${selectedSize || 'std'}__unit__${selectedFlavor}`,
          name: `${product.name}${sizeLabel} - ${product.category === 'narguile' ? 'Cor' : 'Sabor'}: ${selectedFlavor}`,
          price: currentUnitPrice,
          originalPrice: currentOriginalPrice,
          volume: currentVolume
        };
        addItem(variantProduct, 1);
      }
    } else {
      addItem(product, 1);
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group bg-[#141419] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20">
      {/* Imagem + Badges */}
      <div className="relative aspect-square w-full bg-white overflow-hidden p-1 flex items-center justify-center">
        {/* Badges do Topo (Desconto e Estoque) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {discount && (
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow-md shadow-red-950/60">
              -{discount}%
            </span>
          )}
          {product.stockCount && product.stockCount <= 10 && (
            <span className="bg-amber-500 text-black text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-md shadow-amber-950/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
              Restam {product.stockCount} un!
            </span>
          )}
        </div>

        {/* Botão de Favorito (Coração) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center transition cursor-pointer"
          title="Salvar nos favoritos"
        >
          <Heart 
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition ${
              favorited 
                ? 'fill-red-600 text-red-600' 
                : 'text-white'
            }`} 
          />
        </button>

        {/* Foto com link para detalhe */}
        <Link href={`/produto/${product.id}`} className="w-full h-full flex items-center justify-center bg-white">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Conteúdo Informativo */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Título */}
          <Link href={`/produto/${product.id}`}>
            <h3 className="font-bold text-xs sm:text-sm text-zinc-100 hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating de estrelas */}
          <div className="flex items-center gap-1.5 text-xs mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-zinc-200">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-zinc-500">
              ({product.reviewsCount || 120})
            </span>
          </div>

          {/* Seletor de Tamanhos (ex: 250ml vs 473ml) */}
          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div className="mb-2 flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              <span className="text-[10px] font-bold text-zinc-400 pl-1">Tamanho:</span>
              <div className="flex gap-1">
                {product.sizeOptions.map(opt => (
                  <button
                    key={opt.size}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(opt.size);
                      if (opt.packOffer && !opt.packOffer.allowMixedFlavors && product.flavors?.[0]) {
                        setSelectedPackOption(`${opt.packOffer.units}x ${product.flavors[0]}`);
                      }
                    }}
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded transition cursor-pointer ${
                      selectedSize === opt.size
                        ? 'bg-red-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white bg-zinc-950'
                    }`}
                  >
                    {opt.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Abas de Sabor e Oferta de Pacote (quando o produto possui sabores/pacote) */}
          {(hasFlavors || hasPackOffer) && (
            <div
              className="mb-2.5 space-y-2 bg-zinc-900/90 border border-zinc-800 rounded-xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Abas: 1 Unidade vs Pacote */}
              {hasPackOffer && currentPackOffer && (
                <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setPurchaseMode('unit')}
                    className={`text-[10px] font-extrabold py-1.5 px-1.5 rounded-md transition cursor-pointer leading-tight ${
                      purchaseMode === 'unit'
                        ? 'bg-red-600 text-white shadow'
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
                    className={`text-[10px] font-extrabold py-1.5 px-1.5 rounded-md transition cursor-pointer leading-tight ${
                      purchaseMode === 'pack'
                        ? 'bg-amber-500 text-zinc-950 shadow'
                        : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    Pack {currentPackOffer.units} un (R$ {currentPackOffer.price.toFixed(2).replace('.', ',')})
                  </button>
                </div>
              )}

              {/* Seletor de sabor na Aba Unidade */}
              {purchaseMode === 'unit' && hasFlavors && (
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">
                    {product.category === 'narguile' ? 'Escolha a cor:' : 'Escolha o sabor:'}
                  </label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 rounded-lg px-2 py-1.5 text-[11px] font-bold text-white outline-none cursor-pointer"
                  >
                    {product.flavors!.map((flavor) => (
                      <option key={flavor} value={flavor}>
                        {flavor}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Seletor na Aba Oferta Pacote */}
              {purchaseMode === 'pack' && hasPackOffer && currentPackOffer && (
                <div>
                  <label className="block text-[10px] font-bold text-amber-400 mb-1">
                    Escolha o sabor do {currentPackOffer.label} (R$ {currentPackOffer.price.toFixed(2).replace('.', ',')}):
                  </label>
                  <select
                    value={selectedPackOption}
                    onChange={(e) => setSelectedPackOption(e.target.value)}
                    className="w-full bg-zinc-950 border border-amber-500/50 focus:border-amber-400 rounded-lg px-2 py-1.5 text-[11px] font-bold text-white outline-none cursor-pointer"
                  >
                    {allowMixed && (
                      <option value="Todos os sabores (Sortido)">
                        Todos os sabores (Sortido)
                      </option>
                    )}
                    {product.flavors?.map((flavor) => (
                      <option key={flavor} value={`${currentPackOffer.units}x ${flavor}`}>
                        Só {flavor} ({currentPackOffer.units} unidades)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Alerta de Poucas Unidades */}
          {product.stockCount && product.stockCount <= 10 && (
            <div className="mb-2 flex items-center gap-1.5 text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/25 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
              <span>Apenas {product.stockCount} unidades restantes!</span>
            </div>
          )}

          {/* Promoção Progressiva / Desconto por Quantidade */}
          {product.bulkDiscount && (
            <div className="mb-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-2 py-1 rounded-md">
              <span>🏷️ {product.bulkDiscount.label || `Leve ${product.bulkDiscount.minQuantity}+ por R$ ${product.bulkDiscount.pricePerUnit.toFixed(2).replace('.', ',')} cada`}</span>
            </div>
          )}

          {/* Preço em destaque vermelho */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base sm:text-lg font-black text-red-500">
              R$ {activePrice.toFixed(2).replace('.', ',')}
            </span>
            {activeOriginalPrice && (
              <span className="text-xs text-zinc-500 line-through">
                R$ {activeOriginalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>

        {/* Rodapé do Card: Frete Rápido & Botão Vermelho de Adicionar */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          {/* Badge Frete Rápido */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-400">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Frete rápido</span>
          </div>

          {/* Botão Vermelho "+" */}
          <button
            onClick={handleAdd}
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition shadow-md cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-950/50 active:scale-95'
            }`}
            title="Adicionar ao carrinho"
          >
            {justAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
