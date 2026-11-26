import { Product, Order, StoreConfig } from './types';
import { INITIAL_PRODUCTS, INITIAL_STORE_CONFIG } from './data';
import { supabase, isSupabaseConfigured } from './supabase';

const PRODUCTS_KEY = 'nightbox_products_v42';
const ORDERS_KEY = 'nightbox_orders_v2';
const CONFIG_KEY = 'nightbox_config_v3';

// PRODUTOS
export async function getProducts(): Promise<Product[]> {
  if (typeof window === 'undefined') {
    return INITIAL_PRODUCTS;
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          category: item.category,
          imageUrl: item.image_url,
          volume: item.volume,
          alcoholContent: item.alcohol_content,
          inStock: item.in_stock,
          featured: item.featured,
          isCold: item.is_cold,
          rating: Number(item.rating || 5)
        }));
      }
    }

    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      const parsed: Product[] = JSON.parse(saved);
      const initialIds = new Set(INITIAL_PRODUCTS.map(p => p.id));
      const customAdminProducts = parsed.filter(
        p => !initialIds.has(p.id) && !p.id.startsWith('nb-')
      );
      const merged = [...INITIAL_PRODUCTS, ...customAdminProducts];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
  }

  // Inicializa local se vazio
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  return INITIAL_PRODUCTS;
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        original_price: p.originalPrice,
        category: p.category,
        image_url: p.imageUrl,
        volume: p.volume,
        alcohol_content: p.alcoholContent,
        in_stock: p.inStock,
        featured: p.featured,
        is_cold: p.isCold,
        rating: p.rating
      }));
      await supabase.from('products').upsert(payload);
    } catch (err) {
      console.error('Erro ao sincronizar com Supabase:', err);
    }
  }
}

// PEDIDOS
export async function getOrders(): Promise<Order[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((o: any) => ({
          id: o.id,
          createdAt: o.created_at,
          customer: o.customer,
          deliveryType: o.delivery_type,
          address: o.address,
          items: o.items,
          subtotal: Number(o.subtotal),
          deliveryFee: Number(o.delivery_fee),
          discount: Number(o.discount || 0),
          total: Number(o.total),
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          orderStatus: o.order_status,
          notes: o.notes,
          changeFor: o.change_for ? Number(o.change_for) : undefined,
          pixQrCode: o.pix_qr_code,
          pixCopiaECola: o.pix_copia_e_cola
        }));
      }
    }

    const saved = localStorage.getItem(ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    return [];
  }
}

export async function saveOrder(order: Order): Promise<void> {
  if (typeof window !== 'undefined') {
    const existing = await getOrders();
    const updated = [order, ...existing.filter(o => o.id !== order.id)];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').upsert({
        id: order.id,
        created_at: order.createdAt,
        customer: order.customer,
        delivery_type: order.deliveryType,
        address: order.address,
        items: order.items,
        subtotal: order.subtotal,
        delivery_fee: order.deliveryFee,
        discount: order.discount,
        total: order.total,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        notes: order.notes,
        change_for: order.changeFor,
        pix_qr_code: order.pixQrCode,
        pix_copia_e_cola: order.pixCopiaECola
      });
    } catch (err) {
      console.error('Erro ao salvar pedido no Supabase:', err);
    }
  }
}

export async function updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<void> {
  if (typeof window !== 'undefined') {
    const orders = await getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: status } : o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    } catch (err) {
      console.error('Erro ao atualizar status no Supabase:', err);
    }
  }
}

// CONFIGURAÇÃO DA LOJA
export async function getStoreConfig(): Promise<StoreConfig> {
  if (typeof window === 'undefined') {
    return INITIAL_STORE_CONFIG;
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('store_config').select('*').eq('id', 'default').single();
      if (!error && data) {
        return {
          name: data.name,
          tagline: data.tagline,
          phone: data.phone,
          whatsapp: data.whatsapp,
          address: data.address,
          isOpen: data.is_open,
          openingHours: data.opening_hours,
          estimatedDeliveryTime: data.estimated_delivery_time,
          defaultDeliveryFee: Number(data.default_delivery_fee),
          freeDeliveryThreshold: data.free_delivery_threshold ? Number(data.free_delivery_threshold) : undefined,
          mercadoPagoPublicKey: data.mercado_pago_public_key,
          mercadoPagoAccessToken: data.mercado_pago_access_token,
          pixKey: data.pix_key || INITIAL_STORE_CONFIG.pixKey,
          pixMerchantName: data.pix_merchant_name || INITIAL_STORE_CONFIG.pixMerchantName,
          pixMerchantCity: data.pix_merchant_city || INITIAL_STORE_CONFIG.pixMerchantCity
        };
      }
    }

    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_STORE_CONFIG,
        ...parsed,
        pixKey: parsed.pixKey || INITIAL_STORE_CONFIG.pixKey,
        pixMerchantName: parsed.pixMerchantName || INITIAL_STORE_CONFIG.pixMerchantName,
        pixMerchantCity: parsed.pixMerchantCity || INITIAL_STORE_CONFIG.pixMerchantCity,
      };
    }
    return INITIAL_STORE_CONFIG;
  } catch (err) {
    console.error('Erro ao buscar configurações:', err);
    return INITIAL_STORE_CONFIG;
  }
}

export async function saveStoreConfig(config: StoreConfig): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('store_config').upsert({
        id: 'default',
        name: config.name,
        tagline: config.tagline,
        phone: config.phone,
        whatsapp: config.whatsapp,
        address: config.address,
        is_open: config.isOpen,
        opening_hours: config.openingHours,
        estimated_delivery_time: config.estimatedDeliveryTime,
        default_delivery_fee: config.defaultDeliveryFee,
        free_delivery_threshold: config.freeDeliveryThreshold,
        mercado_pago_public_key: config.mercadoPagoPublicKey,
        mercado_pago_access_token: config.mercadoPagoAccessToken
      });
    } catch (err) {
      console.error('Erro ao salvar config no Supabase:', err);
    }
  }
}
