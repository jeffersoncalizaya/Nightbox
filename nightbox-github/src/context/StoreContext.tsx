'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, StoreConfig, ProductCategory } from '@/lib/types';
import { INITIAL_STORE_CONFIG, INITIAL_PRODUCTS } from '@/lib/data';
import { getProducts, getStoreConfig, saveStoreConfig, saveProducts } from '@/lib/storage';

interface StoreContextType {
  config: StoreConfig;
  updateConfig: (newConfig: Partial<StoreConfig>) => Promise<void>;
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProducts: Product[];
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StoreConfig>(INITIAL_STORE_CONFIG);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedProducts, loadedConfig] = await Promise.all([
          getProducts(),
          getStoreConfig()
        ]);
        setProducts(loadedProducts);
        setConfig(loadedConfig);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [INITIAL_PRODUCTS]);

  const updateConfig = async (newConfig: Partial<StoreConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    await saveStoreConfig(updated);
  };

  const addProduct = async (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    await saveProducts(updated);
  };

  const updateProduct = async (product: Product) => {
    const updated = products.map(p => p.id === product.id ? product : p);
    setProducts(updated);
    await saveProducts(updated);
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    await saveProducts(updated);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'todos' || selectedCategory === 'todas' ||
      (selectedCategory === 'bebidas' && (p.category === 'bebidas' || p.category === 'cervejas' || p.category === 'whisky' || p.category === 'energeticos')) ||
      (selectedCategory === 'ofertas' && Boolean(p.isFlashSale)) ||
      (selectedCategory === 'fim-de-ano' && (p.category === 'fim-de-ano' || p.category === 'kits' || p.id === 'combo-fim-de-ano-300')) ||
      p.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <StoreContext.Provider
      value={{
        config,
        updateConfig,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        isLoading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de StoreProvider');
  }
  return context;
}
