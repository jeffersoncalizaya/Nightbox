import { Product, StoreConfig, ComboItem, CommunityVideo } from './types';

export const INITIAL_STORE_CONFIG: StoreConfig = {
  name: "NIGHTBOX",
  tagline: "TUDO PARA SEU ROLÊ",
  phone: "(11) 98765-4321",
  whatsapp: "5511987654321",
  address: "Rua Augusta, 1200 - Consolação, São Paulo - SP",
  city: "São Paulo - SP",
  isOpen: true,
  openingHours: "Segunda a Domingo 24h",
  estimatedDeliveryTime: "3 - 6 dias úteis",
  defaultDeliveryFee: 7.90,
  freeDeliveryThreshold: 150.00,
  mercadoPagoPublicKey: "",
  mercadoPagoAccessToken: "",
  pixKey: process.env.NEXT_PUBLIC_PIX_KEY || "sua-chave-pix-aqui",
  pixMerchantName: process.env.NEXT_PUBLIC_PIX_MERCHANT_NAME || "Nightbox Delivery",
  pixMerchantCity: "Sao Paulo"
};

// Categorias visuais circulares da barra superior
export const CIRCULAR_CATEGORIES = [
  { id: 'bebidas', label: 'Bebidas', imageUrl: '/images/gin_eternity_900ml.webp' },
  { id: 'cervejas', label: 'Cervejas', imageUrl: '/images/cerveja_brahma_pack.jpg' },
  { id: 'whisky', label: 'Whiskys', imageUrl: '/images/whisky_red_label_1l.jpg' },
  { id: 'energeticos', label: 'Energéticos', imageUrl: '/images/energetico_vibe_2l.webp' },
  { id: 'narguile', label: 'Narguilé', imageUrl: '/images/narguile_completo_dourado.webp' },
  { id: 'pods', label: 'Pods', imageUrl: '/images/pod_elfbar_joinone_25k.webp' },
  { id: 'fim-de-ano', label: 'Promoção Fim de Ano', imageUrl: '/images/combo_fim_de_ano.jpg' }
];

export const NAV_CATEGORIES = [
  { id: 'todas', label: 'Todas as categorias' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'cervejas', label: 'Cervejas' },
  { id: 'whisky', label: 'Whiskys' },
  { id: 'energeticos', label: 'Energéticos' },
  { id: 'narguile', label: 'Narguilé' },
  { id: 'pods', label: 'Pods' },
  { id: 'fim-de-ano', label: '🎉 Promoção Fim de Ano' },
];

export const CATEGORIES_CONFIG = NAV_CATEGORIES;

export const INITIAL_PRODUCTS: Product[] = [
  // OFERTA DE FIM DE ANO (SUPER COMBO)
  {
    id: "combo-fim-de-ano-300",
    name: "Super Combo da Virada (Red Label + Fogos + Baly 2L + 6 Gelos de Coco + Narguilé Completo)",
    description: "1 Whisky Johnnie Walker Red Label 1L + 1 Caixa de Foguetão Chorão Colorido (6 un) + 1 Energético Baly Tropical 2L + 6 Gelos de Água de Coco Puro Coco + 1 Narguilé Completo (com fogareiro elétrico, abafador e kaloud).",
    price: 300.00,
    originalPrice: 490.00,
    discountPercent: 39,
    category: "fim-de-ano",
    imageUrl: "/images/combo_fim_de_ano.jpg",
    volume: "Kit Completo",
    inStock: true,
    isFlashSale: true,
    featured: true,
    rating: 5.0,
    reviewsCount: 489,
    isFastShipping: true
  },
  // PRODUTOS - CERVEJAS LATA 350ML (PACOTES)
  {
    id: "cerveja-skol-pack",
    name: "Cerveja Skol Pilsen 350ml (Pacote c/ 12 un)",
    description: "Pack com 12 latas de Cerveja Skol Pilsen 350ml trincando de gelada.",
    price: 29.99,
    originalPrice: 35.00,
    discountPercent: 14,
    category: "cervejas",
    imageUrl: "/images/cerveja_skol_pack.jpg",
    volume: "Pack 12x 350ml",
    alcoholContent: "4.7%",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.8,
    reviewsCount: 342,
    isFastShipping: true
  },
  {
    id: "cerveja-brahma-pack",
    name: "Cerveja Brahma Chopp 350ml (Pacote c/ 12 un)",
    description: "Pack com 12 latas de Cerveja Brahma Chopp 350ml estupidamente gelada.",
    price: 29.99,
    originalPrice: 35.00,
    discountPercent: 14,
    category: "cervejas",
    imageUrl: "/images/cerveja_brahma_pack.jpg",
    volume: "Pack 12x 350ml",
    alcoholContent: "4.8%",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.9,
    reviewsCount: 488,
    isFastShipping: true
  },
  {
    id: "cerveja-amstel-pack",
    name: "Cerveja Amstel Lager Puro Malte 350ml (Pacote c/ 12 un)",
    description: "Pack com 12 latas de Cerveja Amstel Lager Puro Malte 350ml trincando de gelada.",
    price: 29.99,
    originalPrice: 35.00,
    discountPercent: 14,
    category: "cervejas",
    imageUrl: "/images/cerveja_amstel_pack.webp",
    volume: "Pack 12x 350ml",
    alcoholContent: "4.6%",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.8,
    reviewsCount: 295,
    isFastShipping: true
  },
  // CERVEJAS LONG NECK 330ML (PACOTE 6 UNIDADES)
  {
    id: "cerveja-corona-pack6",
    name: "Cerveja Corona Extra Long Neck 330ml (Pack c/ 6 un)",
    description: "Pack com 6 garrafas de Cerveja Corona Extra 330ml trincando de geladas com limão.",
    price: 34.99,
    originalPrice: 42.00,
    discountPercent: 17,
    category: "cervejas",
    imageUrl: "/images/cerveja_corona_pack6.png",
    volume: "Pack 6x 330ml",
    alcoholContent: "4.5%",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.9,
    reviewsCount: 382,
    isFastShipping: true
  },
  {
    id: "cerveja-heineken-pack6",
    name: "Cerveja Heineken Long Neck 330ml (Pack c/ 6 un)",
    description: "Pack com 6 garrafas de Cerveja Heineken puro malte 330ml estupidamente geladas.",
    price: 34.99,
    originalPrice: 42.00,
    discountPercent: 17,
    category: "cervejas",
    imageUrl: "/images/cerveja_heineken_pack6.webp",
    volume: "Pack 6x 330ml",
    alcoholContent: "5.0%",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.9,
    reviewsCount: 512,
    isFastShipping: true
  },
  // WHISKYS
  {
    id: "whisky-red-label-1l",
    name: "Whisky Johnnie Walker Red Label 1L",
    description: "Blended Scotch Whisky original destilado na Escócia. Acompanha caixa original 1 Litro.",
    price: 59.99,
    originalPrice: 89.90,
    discountPercent: 33,
    category: "whisky",
    imageUrl: "/images/whisky_red_label_1l.jpg",
    volume: "1L",
    alcoholContent: "40.0%",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 412,
    isFastShipping: true
  },
  {
    id: "whisky-jack-daniels-1l",
    name: "Whisky Jack Daniel's Old No. 7 Tennessee 1L",
    description: "Autêntico Tennessee Whiskey maturado em barris de carvalho. Garrafa de 1 Litro com caixa.",
    price: 89.99,
    originalPrice: 129.90,
    discountPercent: 31,
    category: "whisky",
    imageUrl: "/images/whisky_jack_daniels_1l.jpg",
    volume: "1L",
    alcoholContent: "40.0%",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 534,
    isFastShipping: true
  },
  {
    id: "whisky-gold-label-750ml",
    name: "Whisky Johnnie Walker Gold Label Reserve 750ml",
    description: "Blended Scotch Whisky luxuoso, cremoso e com notas de mel. Garrafa 750ml com caixa dourada.",
    price: 179.99,
    originalPrice: 239.90,
    discountPercent: 25,
    category: "whisky",
    imageUrl: "/images/whisky_gold_label_750ml.jpg",
    volume: "750ml",
    alcoholContent: "40.0%",
    inStock: true,
    isFlashSale: true,
    rating: 5.0,
    reviewsCount: 289,
    isFastShipping: true
  },
  {
    id: "whisky-white-horse-700ml",
    name: "Whisky White Horse Fine Old Scotch 700ml",
    description: "Tradicional Blended Scotch Whisky escocês encorpado e marcante. Garrafa 700ml com caixa.",
    price: 59.99,
    originalPrice: 79.90,
    discountPercent: 25,
    category: "whisky",
    imageUrl: "/images/whisky_white_horse_700ml.jpg",
    volume: "700ml",
    alcoholContent: "40.0%",
    inStock: true,
    isFlashSale: true,
    rating: 4.8,
    reviewsCount: 318,
    isFastShipping: true
  },
  // BEBIDAS GERAIS (GIN ETERNITY)
  {
    id: "gin-eternity-900ml",
    name: "Gin Eternity 900ml (Escolha o Sabor ou Pack c/ 6 un)",
    description: "Gin Eternity 900ml disponível nos sabores Maçã Verde, Morango, Cereja, Frutas Tropicais, Tradicional e Laranja. Leve a unidade por R$ 24,99 ou o pacote fechado com 6 unidades (todos os sabores ou 1 sabor) por apenas R$ 99,99!",
    price: 24.99,
    originalPrice: 34.90,
    discountPercent: 28,
    category: "bebidas",
    imageUrl: "/images/gin_eternity_900ml.webp",
    volume: "900ml",
    alcoholContent: "38.5%",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.9,
    reviewsCount: 476,
    isFastShipping: true,
    flavors: [
      "Maçã Verde",
      "Morango",
      "Cereja",
      "Frutas Tropicais",
      "Tradicional",
      "Laranja"
    ],
    packOffer: {
      label: "Pacote c/ 6 un",
      price: 99.99,
      originalPrice: 149.94,
      units: 6
    }
  },
  {
    id: "askov-sabores-900ml",
    name: "Askov 900ml (Escolha o Sabor ou Pack c/ 6 un)",
    description: "Coquetel Alcoólico Askov 900ml disponível nos sabores Maracujá, Limão, Frutas Vermelhas e Blueberry. Leve a unidade por R$ 14,99 ou o pacote fechado com 6 unidades (todos os sabores ou 1 sabor) por apenas R$ 69,99!",
    price: 14.99,
    originalPrice: 19.90,
    discountPercent: 25,
    category: "bebidas",
    imageUrl: "/images/askov_900ml.jpg",
    volume: "900ml",
    alcoholContent: "13.5%",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.9,
    reviewsCount: 392,
    isFastShipping: true,
    flavors: [
      "Maracujá",
      "Limão",
      "Frutas Vermelhas",
      "Blueberry"
    ],
    packOffer: {
      label: "Pacote c/ 6 un",
      price: 69.99,
      originalPrice: 89.94,
      units: 6
    }
  },
  {
    id: "ballena-tequila-750ml",
    name: "Licor Fino de Morango com Tequila Ballena 750ml",
    description: "Licor fino cremoso de morango com Tequila Mexicana Ballena Original Cream 750ml. Beba bem gelado!",
    price: 74.99,
    originalPrice: 99.90,
    discountPercent: 25,
    category: "bebidas",
    imageUrl: "/images/ballena_tequila_750ml.webp",
    volume: "750ml",
    alcoholContent: "16.0%",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 5.0,
    reviewsCount: 518,
    isFastShipping: true
  },
  // ENERGÉTICOS
  {
    id: "energetico-vibe-2l",
    name: "Energético Vibe 2L (Escolha o Sabor ou Pack c/ 6 un)",
    description: "Energético Vibe 2 Litros trincando de gelado. Disponível nos sabores Original, Morango, Melancia, Maçã Verde, Lichia e Coco. Leve a unidade por R$ 7,99 ou o pacote fechado com 6 unidades (todos os sabores ou 1 sabor) por apenas R$ 39,99!",
    price: 7.99,
    originalPrice: 10.90,
    discountPercent: 27,
    category: "energeticos",
    imageUrl: "/images/energetico_vibe_2l.webp",
    volume: "2L",
    alcoholContent: "Não alcoólico",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.9,
    reviewsCount: 367,
    isFastShipping: true,
    flavors: [
      "Original",
      "Morango",
      "Melancia",
      "Maçã Verde",
      "Lichia",
      "Coco"
    ],
    packOffer: {
      label: "Pacote c/ 6 un",
      price: 39.99,
      originalPrice: 47.94,
      units: 6,
      allowMixedFlavors: false
    }
  },
  {
    id: "energetico-baly-2l",
    name: "Energético Baly 2L (Escolha o Sabor ou Pack c/ 6 un)",
    description: "Energético Baly 2 Litros trincando de gelado. Disponível nos sabores Tradicional, Tropical, Melancia, Maçã Verde, Coco e Açaí, Morango e Pêssego, Açaí e Abacaxi com Hortelã. Leve a unidade por R$ 11,99 ou o pacote fechado com 6 unidades por apenas R$ 59,99!",
    price: 11.99,
    originalPrice: 15.90,
    discountPercent: 25,
    category: "energeticos",
    imageUrl: "/images/energetico_baly_2l.jpg",
    volume: "2L",
    alcoholContent: "Não alcoólico",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 5.0,
    reviewsCount: 489,
    isFastShipping: true,
    flavors: [
      "Tradicional",
      "Tropical",
      "Melancia",
      "Maçã Verde",
      "Coco e Açaí",
      "Morango e Pêssego",
      "Açaí",
      "Abacaxi com Hortelã"
    ],
    packOffer: {
      label: "Pacote c/ 6 un",
      price: 59.99,
      originalPrice: 71.94,
      units: 6,
      allowMixedFlavors: false
    }
  },
  {
    id: "energetico-red-bull-250ml",
    name: "Energético Red Bull Lata (Escolha o Tamanho e Sabor)",
    description: "Energético Red Bull geladíssimo. Disponível nos tamanhos 250ml e 473ml nos sabores Original, Sem Açúcar, Cereja e Frutas Silvestres, Morango e Pêssego, Frutas Tropicais, Melancia, Açaí e Pitaya. Leve em unidade ou no pack fechado!",
    price: 7.99,
    originalPrice: 11.90,
    discountPercent: 33,
    category: "energeticos",
    imageUrl: "/images/energetico_red_bull_250ml.jpg",
    volume: "250ml",
    alcoholContent: "Não alcoólico",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 5.0,
    reviewsCount: 642,
    isFastShipping: true,
    flavors: [
      "Original",
      "Sem Açúcar",
      "Cereja e Frutas Silvestres",
      "Morango e Pêssego",
      "Frutas Tropicais",
      "Melancia",
      "Açaí",
      "Pitaya"
    ],
    sizeOptions: [
      {
        size: "250ml",
        price: 7.99,
        originalPrice: 11.90,
        volume: "250ml",
        packOffer: {
          label: "Pack c/ 8 un",
          price: 54.99,
          originalPrice: 63.92,
          units: 8,
          allowMixedFlavors: false
        }
      },
      {
        size: "473ml",
        price: 12.99,
        originalPrice: 18.90,
        volume: "473ml",
        packOffer: {
          label: "Pack c/ 12 un",
          price: 149.99,
          originalPrice: 155.88,
          units: 12,
          allowMixedFlavors: false
        }
      }
    ],
    packOffer: {
      label: "Pack c/ 8 un",
      price: 54.99,
      originalPrice: 63.92,
      units: 8,
      allowMixedFlavors: false
    }
  },
  {
    id: "energetico-baly-lata",
    name: "Energético Baly Lata (Escolha o Tamanho e Sabor)",
    description: "Energético Baly Lata estupidamente gelado. Disponível nos tamanhos 250ml e 473ml nos sabores Tropical, Maçã Verde, Melancia, Tradicional e Morango e Pêssego. Leve a unidade ou o pack fechado com 1 sabor só!",
    price: 7.99,
    originalPrice: 11.90,
    discountPercent: 33,
    category: "energeticos",
    imageUrl: "/images/energetico_baly_lata.png",
    volume: "250ml",
    alcoholContent: "Não alcoólico",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 5.0,
    reviewsCount: 524,
    isFastShipping: true,
    flavors: [
      "Tropical",
      "Maçã Verde",
      "Melancia",
      "Tradicional",
      "Morango e Pêssego"
    ],
    sizeOptions: [
      {
        size: "250ml",
        price: 7.99,
        originalPrice: 11.90,
        volume: "250ml",
        packOffer: {
          label: "Pack c/ 8 un",
          price: 54.99,
          originalPrice: 63.92,
          units: 8,
          allowMixedFlavors: false
        }
      },
      {
        size: "473ml",
        price: 12.99,
        originalPrice: 18.90,
        volume: "473ml",
        packOffer: {
          label: "Pack c/ 12 un",
          price: 149.99,
          originalPrice: 155.88,
          units: 12,
          allowMixedFlavors: false
        }
      }
    ],
    packOffer: {
      label: "Pack c/ 8 un",
      price: 54.99,
      originalPrice: 63.92,
      units: 8,
      allowMixedFlavors: false
    }
  },
  {
    id: "energetico-monster-473ml",
    name: "Energético Monster 473ml (Escolha o Sabor ou Pack c/ 6 un)",
    description: "Energético Monster Energy 473ml trincando de gelado. Disponível nos sabores Original, Mango Loco, Ultra Zero Açúcar, Guaraná, Limão, Ultra Violet e Juice Khaos. Leve a unidade por R$ 6,99 ou o pack fechado com 6 unidades por apenas R$ 29,99!",
    price: 6.99,
    originalPrice: 10.90,
    discountPercent: 36,
    category: "energeticos",
    imageUrl: "/images/energetico_monster_473ml.jpg",
    volume: "473ml",
    alcoholContent: "Não alcoólico",
    inStock: true,
    isFlashSale: true,
    isCold: true,
    rating: 4.9,
    reviewsCount: 588,
    isFastShipping: true,
    flavors: [
      "Original",
      "Mango Loco",
      "Ultra Zero Açúcar",
      "Guaraná",
      "Limão",
      "Ultra Violet",
      "Juice Khaos"
    ],
    packOffer: {
      label: "Pack c/ 6 un",
      price: 29.99,
      originalPrice: 41.94,
      units: 6,
      allowMixedFlavors: false
    }
  },
  // NARGUILÉS
  {
    id: "narguile-completo-dourado",
    name: "Narguilé Completo Dourado (Kit Completo)",
    description: "Kit Narguilé Completo na cor Dourada com stem dourado trabalhado, vaso com detalhes, rosh de cerâmica, mangueira lavável com piteira longa dourada, prato de proteção, fogareiro elétrico, abafador dourado e pegador de carvão. Pronto para a sua sessão!",
    price: 69.99,
    originalPrice: 89.90,
    discountPercent: 22,
    category: "narguile",
    imageUrl: "/images/narguile_completo_dourado.webp",
    volume: "Kit Completo",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 148,
    isFastShipping: true
  },
  {
    id: "narguile-completo-preto",
    name: "Narguilé Completo Preto (Kit Completo + Carvão de Brinde)",
    description: "Kit Narguilé Completo na cor Preta com stem preto com relevo de caveira, vaso em vidro fumê, rosh de cerâmica, mangueira corrugada com piteira preta, prato, abafador preto, papel alumínio para narguilé, pegador de carvão + Carvão de Brinde incluso!",
    price: 69.99,
    originalPrice: 89.90,
    discountPercent: 22,
    category: "narguile",
    imageUrl: "/images/narguile_completo_preto.webp",
    volume: "Kit Completo + Brinde",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 165,
    isFastShipping: true
  },
  {
    id: "narguile-simples-preto",
    name: "Narguilé Simples Preto (Vaso Redondo Texturizado)",
    description: "Narguilé Simples modelo compacto na cor preta. Acompanha stem em preto acetinado, vaso de vidro trabalhado texturizado de alta resistência, rosh de cerâmica preto, prato de proteção e mangueira corrugada com piteira. Excelente custo-benefício para a sua resenha!",
    price: 49.99,
    originalPrice: 69.90,
    discountPercent: 29,
    category: "narguile",
    imageUrl: "/images/narguile_simples.jpg",
    volume: "Modelo Simples",
    inStock: true,
    isFlashSale: true,
    rating: 4.8,
    reviewsCount: 112,
    isFastShipping: true
  },
  {
    id: "narguile-viper-vip",
    name: "Narguilé Viper - Edição VIP (Apenas 5 unidades)",
    description: "Narguilé Viper Edição VIP Limitada — Restam apenas 5 unidades! Acabamento premium de altíssima precisão em preto fosco, stem com detalhes exclusivos Viper, vaso reforçado em vidro fumê, prato especial, mangueira premium com piteira longa de alumínio, maleta/bolsa de transporte Viper acolchoada + Carvão de Brinde incluso!",
    price: 399.99,
    originalPrice: 599.90,
    discountPercent: 33,
    category: "narguile",
    imageUrl: "/images/narguile_viper_vip.jpg",
    volume: "Edição VIP Completo",
    inStock: true,
    stockCount: 5,
    isFlashSale: true,
    rating: 5.0,
    reviewsCount: 94,
    isFastShipping: true
  },
  {
    id: "narguile-black-viper-all-black",
    name: "Narguilé VIP Black Viper All Black (Apenas 5 unidades)",
    description: "Narguilé VIP Black Viper Limited Edition — All Black com Caixa Especial. Edição limitada para colecionadores, com caixa rígida de luxo Black Viper, stem premium em acabamento preto acetinado de alta precisão, vaso fumê reforçado, prato exclusivo, mangueira e piteira all black. Apenas 5 unidades disponíveis!",
    price: 349.99,
    originalPrice: 499.90,
    discountPercent: 30,
    category: "narguile",
    imageUrl: "/images/narguile_black_viper_all_black.jpg",
    volume: "Edição VIP All Black",
    inStock: true,
    stockCount: 5,
    isFlashSale: true,
    rating: 5.0,
    reviewsCount: 78,
    isFastShipping: true
  },
  {
    id: "narguile-volkano-anak",
    name: "Narguile Volkano Anak Fosco com Bag de Transporte (Escolha a Cor)",
    description: "Super Desconto de Fim de Ano! Narguile Volkano Anak com acabamento fosco anodizado premium, respiro eficiente, vaso de cristal transparente de alta resistência, rosh Zouk, mangueira lavável com piteira longa e Bag de Transporte acolchoada exclusiva Volkano. Disponível nas cores: Azul, Dourado, Preto, Rosé, Roxo e Vermelho.",
    price: 399.99,
    originalPrice: 649.90,
    discountPercent: 38,
    category: "narguile",
    imageUrl: "/images/narguile_volkano_anak.webp",
    volume: "Kit Completo + Bag",
    inStock: true,
    isFlashSale: true,
    rating: 5.0,
    reviewsCount: 128,
    isFastShipping: true,
    flavors: [
      "Azul",
      "Dourado",
      "Preto",
      "Rosé",
      "Roxo",
      "Vermelho"
    ]
  },
  // PODS & VAPES
  {
    id: "pod-elfbar-joinone-25k",
    name: "Pod Descartável Elfbar JoinOne Refil 25K Puffs (Escolha o Sabor)",
    description: "Pod Descartável Elfbar JoinOne Refil com até 25.000 Puffs de alta performance, vapor denso e sabor duradouro. Disponível nos sabores Kiwi, Manga e Uva. Leve a unidade por R$ 89,99 ou aproveite a oferta especial: levando 3 ou mais unidades, cada uma sai por apenas R$ 69,99!",
    price: 89.99,
    originalPrice: 119.90,
    discountPercent: 25,
    category: "pods",
    imageUrl: "/images/pod_elfbar_joinone_25k.webp",
    volume: "25.000 Puffs",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 234,
    isFastShipping: true,
    flavors: [
      "Kiwi",
      "Manga",
      "Uva"
    ],
    bulkDiscount: {
      minQuantity: 3,
      pricePerUnit: 69.99,
      label: "A partir de 3 un sai por R$ 69,99 cada"
    },
    packOffer: {
      label: "Combo 3 un (R$ 69,99 cada)",
      price: 209.97,
      originalPrice: 269.97,
      units: 3,
      allowMixedFlavors: true
    }
  },
  {
    id: "pod-ignite-v50-5000-puffs",
    name: "Pod Descartável IGNITE V50 – 5000 Puffs",
    description: "Pod Descartável IGNITE V50 com 5000 puffs. Design moderno all-black com a icônica logo Ignite, pegada ergonômica, bateria de longa duração e vapor suave com sabor intenso. Leve a unidade por R$ 69,99 ou aproveite a promoção: levando 3 ou mais unidades, cada uma sai por apenas R$ 59,99!",
    price: 69.99,
    originalPrice: 89.90,
    discountPercent: 22,
    category: "pods",
    imageUrl: "/images/pod_ignite_v50.webp",
    volume: "5.000 Puffs",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 318,
    isFastShipping: true,
    bulkDiscount: {
      minQuantity: 3,
      pricePerUnit: 59.99,
      label: "A partir de 3 un sai por R$ 59,99 cada"
    },
    packOffer: {
      label: "Pack c/ 3 un (R$ 59,99 cada)",
      price: 179.97,
      originalPrice: 209.97,
      units: 3
    }
  },
  {
    id: "pod-elfbar-fs18000",
    name: "Pod Descartável Elfbar FS18000 Puffs (Escolha o Sabor)",
    description: "Pod Descartável Elfbar FS18000 com até 18.000 Puffs e tela display digital indicadora. Disponível nos sabores Kiwi, Manga e Uva. Leve a unidade por R$ 99,99 ou aproveite a oferta especial: levando 3 ou mais unidades, cada uma sai por apenas R$ 89,99!",
    price: 99.99,
    originalPrice: 129.90,
    discountPercent: 23,
    category: "pods",
    imageUrl: "/images/pod_elfbar_fs18000.webp",
    volume: "18.000 Puffs",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 186,
    isFastShipping: true,
    flavors: [
      "Kiwi",
      "Manga",
      "Uva"
    ],
    bulkDiscount: {
      minQuantity: 3,
      pricePerUnit: 89.99,
      label: "A partir de 3 un sai por R$ 89,99 cada"
    },
    packOffer: {
      label: "Combo 3 un (R$ 89,99 cada)",
      price: 269.97,
      originalPrice: 299.97,
      units: 3,
      allowMixedFlavors: true
    }
  },
  {
    id: "pod-elfbar-te30k-black-gold",
    name: "Elfbar TE 30K Black Gold – Pod Descartável",
    description: "Pod Descartável Elfbar TE 30K Black Gold edição luxo com até 30.000 Puffs. Acabamento premium preto com grafismos dourados, display digital luminoso indicando bateria e líquido, alta capacidade de vaporização e sabor Watermelon Lemon Ice. Leve a unidade por R$ 99,99 ou aproveite: a partir de 3 unidades cada uma sai por apenas R$ 89,99!",
    price: 99.99,
    originalPrice: 139.90,
    discountPercent: 28,
    category: "pods",
    imageUrl: "/images/pod_elfbar_te30k_black_gold.webp",
    volume: "30.000 Puffs",
    inStock: true,
    isFlashSale: true,
    rating: 5.0,
    reviewsCount: 142,
    isFastShipping: true,
    bulkDiscount: {
      minQuantity: 3,
      pricePerUnit: 89.99,
      label: "A partir de 3 un sai por R$ 89,99 cada"
    },
    packOffer: {
      label: "Pack c/ 3 un (R$ 89,99 cada)",
      price: 269.97,
      originalPrice: 299.97,
      units: 3
    }
  },
  {
    id: "pod-icity-40k-pro-absolute-zero",
    name: "Pod Descartável iCITY 40K PRO: Absolute Zero",
    description: "Pod Descartável iCITY 40K PRO com incríveis 40.000 Puffs. Equipado com display digital inteligente completo (bateria, capacidade e modos ECO / BOOST) e sabor Absolute Zero extremamente refrescante com menta e gelo. Leve a unidade por R$ 79,99 ou aproveite a promoção: a partir de 3 unidades cada uma sai por apenas R$ 69,99!",
    price: 79.99,
    originalPrice: 109.90,
    discountPercent: 27,
    category: "pods",
    imageUrl: "/images/pod_icity_40k_pro_absolute_zero.jpg",
    volume: "40.000 Puffs",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 215,
    isFastShipping: true,
    bulkDiscount: {
      minQuantity: 3,
      pricePerUnit: 69.99,
      label: "A partir de 3 un sai por R$ 69,99 cada"
    },
    packOffer: {
      label: "Pack c/ 3 un (R$ 69,99 cada)",
      price: 209.97,
      originalPrice: 239.97,
      units: 3
    }
  },
  {
    id: "pod-ignite-v80-8000-puffs",
    name: "Pod Descartável Ignite V80 8000 Puffs — Recarregável e Sabor Duradouro",
    description: "Pod Descartável Ignite V80 Black Edition com 8000 Puffs. Design moderno com bateria recarregável Type-C, fluxo de ar suave e sabor Green Apple de longa duração com a logo luminosa da Ignite. Leve a unidade por R$ 84,99 ou aproveite a promoção: a partir de 3 unidades cada uma sai por apenas R$ 69,99!",
    price: 84.99,
    originalPrice: 119.90,
    discountPercent: 29,
    category: "pods",
    imageUrl: "/images/pod_ignite_v80.webp",
    volume: "8.000 Puffs",
    inStock: true,
    isFlashSale: true,
    rating: 4.9,
    reviewsCount: 256,
    isFastShipping: true,
    bulkDiscount: {
      minQuantity: 3,
      pricePerUnit: 69.99,
      label: "A partir de 3 un sai por R$ 69,99 cada"
    },
    packOffer: {
      label: "Pack c/ 3 un (R$ 69,99 cada)",
      price: 209.97,
      originalPrice: 254.97,
      units: 3
    }
  }
];

// KITS E COMBOS MAIS VENDIDOS (como no layout do screenshot)
export const BEST_SELLER_COMBOS: ComboItem[] = [
  {
    id: "combo-fim-de-ano-300",
    title: "Super Combo da Virada",
    subtitle: "Red Label + Fogos + Baly 2L + 6 Gelos de Coco + Narguilé Completo",
    price: 300.00,
    originalPrice: 490.00,
    imageUrl: "/images/combo_fim_de_ano.jpg",
    rating: 5.0,
    reviewsCount: 489
  }
];

// VÍDEOS DA COMUNIDADE (desativados)
export const COMMUNITY_VIDEOS: CommunityVideo[] = [];
