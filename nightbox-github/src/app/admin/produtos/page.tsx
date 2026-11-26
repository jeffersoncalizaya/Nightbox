'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Snowflake, 
  Search,
  Package,
  AlertCircle
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product, ProductCategory } from '@/lib/types';
import { CATEGORIES_CONFIG } from '@/lib/data';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'cervejas' as ProductCategory,
    imageUrl: '',
    volume: '',
    alcoholContent: '',
    isCold: true,
    inStock: true,
  });

  const openNewModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'cervejas',
      imageUrl: 'https://images.unsplash.com/photo-1518542698889-ca82282f08d5?auto=format&fit=crop&w=600&q=80',
      volume: '350ml',
      alcoholContent: '5.0%',
      isCold: true,
      inStock: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      category: (product.category as ProductCategory) || 'cervejas',
      imageUrl: product.imageUrl,
      volume: product.volume || '',
      alcoholContent: product.alcoholContent || '',
      isCold: Boolean(product.isCold),
      inStock: product.inStock,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      await updateProduct({
        ...editingProduct,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        imageUrl: formData.imageUrl || editingProduct.imageUrl,
        volume: formData.volume || undefined,
        alcoholContent: formData.alcoholContent || undefined,
        isCold: formData.isCold,
        inStock: formData.inStock,
      });
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1518542698889-ca82282f08d5?auto=format&fit=crop&w=600&q=80',
        volume: formData.volume || undefined,
        alcoholContent: formData.alcoholContent || undefined,
        isCold: formData.isCold,
        inStock: formData.inStock,
        rating: 5.0,
      };
      await addProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  const toggleStock = async (product: Product) => {
    await updateProduct({ ...product, inStock: !product.inStock });
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black">
            Catálogo de Produtos ({products.length})
          </h1>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Busca */}
      <div className="mb-6 max-w-md relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar produto por nome ou categoria..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-zinc-800/40 transition">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-cover bg-zinc-950 flex-shrink-0"
                    />
                    <div>
                      <div className="font-bold text-white leading-tight">{prod.name}</div>
                      <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                        {prod.volume && <span>{prod.volume}</span>}
                        {prod.isCold && (
                          <span className="text-cyan-400 flex items-center gap-0.5">
                            <Snowflake className="w-3 h-3" /> Gelada
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-semibold capitalize">
                      {prod.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-bold text-white">
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                    {prod.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through block font-normal">
                        R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleStock(prod)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        prod.inStock
                          ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                          : 'bg-red-950/60 border border-red-500/30 text-red-400'
                      }`}
                    >
                      {prod.inStock ? 'Em Estoque' : 'Esgotado'}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-lg text-white">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cerveja Heineken Long Neck 330ml"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Puro malte servida trincando de gelada."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="9.50"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Preço Original (opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="12.00"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="cervejas">Cervejas</option>
                    <option value="destilados">Whiskies & Destilados</option>
                    <option value="combos">Combos & Kits</option>
                    <option value="vinhos">Vinhos & Espumantes</option>
                    <option value="sem-alcool">Sem Álcool & Refrigerantes</option>
                    <option value="gelo-carvao">Gelo & Carvão</option>
                    <option value="petiscos">Petiscos & Snacks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Volume / Tamanho</label>
                  <input
                    type="text"
                    placeholder="350ml, 750ml, 1L"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">URL da Foto</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.isCold}
                    onChange={(e) => setFormData({ ...formData, isCold: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0"
                  />
                  <span>Selo &quot;Estupidamente Gelada&quot;</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0"
                  />
                  <span>Disponível em Estoque</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
