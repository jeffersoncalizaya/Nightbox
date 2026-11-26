export type ProductCategory = 
  | 'todas'
  | 'bebidas'
  | 'cervejas'
  | 'whisky'
  | 'energeticos'
  | 'narguile'
  | 'pods'
  | 'festa'
  | 'churrasco'
  | 'kits'
  | 'presentes'
  | 'fim-de-ano';

export interface ProductPackOffer {
  label: string;
  price: number;
  originalPrice?: number;
  units: number;
  allowMixedFlavors?: boolean;
}

export interface ProductSizeOption {
  size: string;
  price: number;
  originalPrice?: number;
  volume?: string;
  packOffer?: ProductPackOffer;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: ProductCategory | string;
  imageUrl: string;
  volume?: string;
  alcoholContent?: string;
  inStock: boolean;
  featured?: boolean;
  isFlashSale?: boolean;
  isCold?: boolean;
  rating: number;
  reviewsCount?: number;
  isFastShipping?: boolean; // "Frete rápido"
  stockCount?: number; // Ex: Apenas 5 unidades disponíveis
  bulkDiscount?: {
    minQuantity: number;
    pricePerUnit: number;
    label?: string;
  };
  flavors?: string[];
  packOffer?: ProductPackOffer;
  sizeOptions?: ProductSizeOption[];
}

export interface ComboItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
}

export interface CommunityVideo {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'pix' | 'credit_card' | 'cash' | 'card_on_delivery';

export interface DeliveryAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  complement?: string;
  reference?: string;
  cep?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  deliveryType: 'delivery' | 'pickup';
  address?: DeliveryAddress;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  orderStatus: OrderStatus;
  notes?: string;
  changeFor?: number;
  pixQrCode?: string;
  pixCopiaECola?: string;
}

export interface StoreConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  city?: string;
  isOpen: boolean;
  openingHours: string;
  estimatedDeliveryTime: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold?: number;
  mercadoPagoPublicKey?: string;
  mercadoPagoAccessToken?: string;
  pixKey?: string;
  pixMerchantName?: string;
  pixMerchantCity?: string;
}
