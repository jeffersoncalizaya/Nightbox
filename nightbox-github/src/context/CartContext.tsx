'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, DeliveryAddress } from '@/lib/types';
import { INITIAL_STORE_CONFIG } from '@/lib/data';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  address: DeliveryAddress;
  setAddress: (addr: DeliveryAddress) => void;
  couponCode: string;
  discount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isFreeDelivery: boolean;
  notes: string;
  setNotes: (notes: string) => void;
}

const DEFAULT_ADDRESS: DeliveryAddress = {
  street: '',
  number: '',
  neighborhood: '',
  city: 'São Paulo',
  complement: '',
  reference: '',
  cep: ''
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState<DeliveryAddress>(DEFAULT_ADDRESS);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  // Carrega carrinho do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('adega_cart_v1');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedAddress = localStorage.getItem('adega_address_v1');
      if (savedAddress) {
        setAddress(JSON.parse(savedAddress));
      }
    } catch (e) {
      console.error('Falha ao restaurar carrinho:', e);
    }
  }, []);

  // Salva no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('adega_cart_v1', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('adega_address_v1', JSON.stringify(address));
    } catch (e) {}
  }, [address]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          let updatedProduct = { ...item.product };
          if (updatedProduct.bulkDiscount) {
            if (quantity >= updatedProduct.bulkDiscount.minQuantity) {
              updatedProduct.price = updatedProduct.bulkDiscount.pricePerUnit;
            } else if (updatedProduct.originalPrice) {
              updatedProduct.price = updatedProduct.originalPrice;
            }
          }
          return { ...item, product: updatedProduct, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscount(0);
    setNotes('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adega_cart_v1');
    }
  };

  const applyCoupon = (code: string): boolean => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'PRIMEIRACOMPRA10') {
      setCouponCode('primeiraCompra10');
      // 10% de desconto sobre o subtotal dos produtos
      setDiscount(subtotal * 0.10);
      return true;
    } else if (cleaned === 'PRIMEIRACOMPRA' || cleaned === 'SEXTOU') {
      setCouponCode(cleaned);
      setDiscount(10); // R$ 10 de desconto
      return true;
    } else if (cleaned === 'FRETEGRATIS') {
      setCouponCode(cleaned);
      setDiscount(INITIAL_STORE_CONFIG.defaultDeliveryFee);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const unitPrice =
      item.product.bulkDiscount && item.quantity >= item.product.bulkDiscount.minQuantity
        ? item.product.bulkDiscount.pricePerUnit
        : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const isFreeDelivery = 
    deliveryType === 'pickup' || 
    (INITIAL_STORE_CONFIG.freeDeliveryThreshold !== undefined && subtotal >= INITIAL_STORE_CONFIG.freeDeliveryThreshold);

  const deliveryFee = deliveryType === 'pickup' ? 0 : (isFreeDelivery ? 0 : INITIAL_STORE_CONFIG.defaultDeliveryFee);
  
  // Recalcula desconto percentual caso o subtotal mude
  const calculatedDiscount = couponCode.toUpperCase() === 'PRIMEIRACOMPRA10'
    ? subtotal * 0.10
    : discount;

  const total = Math.max(0, subtotal + deliveryFee - calculatedDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        deliveryType,
        setDeliveryType,
        address,
        setAddress,
        couponCode,
        discount: calculatedDiscount,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        isFreeDelivery,
        notes,
        setNotes
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}
