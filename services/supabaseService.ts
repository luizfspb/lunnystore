
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, VideoType } from '../types';

// Dados Mock para o Modo Demo
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    slug: 'iphone-15-pro-max',
    titulo: 'iPhone 15 Pro Max - Titanium',
    descricao: 'O chip A17 Pro é uma fera. A câmera teleobjetiva de 5x é impressionante. O design em titânio é leve e resistente.',
    categoria: 'Tecnologia',
    tags: ['apple', 'iphone', 'setup'],
    preco_apartir: 9499.00,
    ativo: true,
    capa_url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    imagens: [],
    videos: [],
    onde_comprar: [
      { id: 'b1', marketplace: 'Amazon', label: 'Ver na Amazon', url: 'https://amazon.com.br', prioridade: 1 },
      { id: 'b2', marketplace: 'Mercado Livre', label: 'Melhor Preço ML', url: 'https://mercadolivre.com.br', prioridade: 2 }
    ],
    stats: { totalClicks: 154, clicksByMarketplace: { 'Amazon': 90, 'Mercado Livre': 64 } },
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-2',
    slug: 'mechanical-keyboard-rgb',
    titulo: 'Teclado Mecânico Custom RGB',
    descricao: 'Switches Gateron Yellow pré-lubrificados, Keycaps PBT Double-shot e conexão Tri-mode (Wireless/BT/Cabo).',
    categoria: 'Periféricos',
    tags: ['keyboard', 'rgb', 'gaming'],
    preco_apartir: 450.00,
    ativo: true,
    capa_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
    imagens: [],
    videos: [],
    onde_comprar: [
      { id: 'b3', marketplace: 'Shopee', label: 'Comprar na Shopee', url: 'https://shopee.com.br', prioridade: 1 }
    ],
    stats: { totalClicks: 89, clicksByMarketplace: { 'Shopee': 89 } },
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-3',
    slug: 'monitor-ultrawide-34',
    titulo: 'Monitor Ultrawide 34" Curvo 144Hz',
    descricao: 'Produtividade e imersão total com resolução WQHD e 99% sRGB.',
    categoria: 'Tecnologia',
    tags: ['monitor', 'productivity', 'setup'],
    preco_apartir: 2890.00,
    ativo: true,
    capa_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    imagens: [],
    videos: [],
    onde_comprar: [
      { id: 'b4', marketplace: 'Amazon', label: 'Oferta Amazon', url: 'https://amazon.com.br', prioridade: 1 }
    ],
    stats: { totalClicks: 42, clicksByMarketplace: { 'Amazon': 42 } },
    created_at: new Date().toISOString()
  }
];

const handleError = (error: any) => {
  let message = "Erro desconhecido";
  if (typeof error === 'string') message = error;
  else if (error?.message) message = error.message;
  else if (typeof error === 'object') {
    try {
      message = JSON.stringify(error);
    } catch {
      message = "Objeto de erro não serializável";
    }
  }

  console.error(`[Supabase Error]`, message);
  throw new Error(message);
};

export const getActiveProducts = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return MOCK_PRODUCTS;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) return handleError(error);
    return data as Product[];
  } catch (err) {
    // Fallback silencioso para mock se houver erro de rede no fetch
    if (!isSupabaseConfigured || String(err).includes('fetch')) return MOCK_PRODUCTS;
    return handleError(err);
  }
};

export const getAllProductsAdmin = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return MOCK_PRODUCTS;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return handleError(error);
    return data as Product[];
  } catch (err) {
    return handleError(err);
  }
};

export const saveProduct = async (productData: Partial<Product>, id?: string): Promise<string> => {
  if (!isSupabaseConfigured) {
    console.warn("Modo Demo: Alterações não são salvas no banco real.");
    return id || 'new-id';
  }
  
  try {
    if (id) {
      const { data, error } = await supabase.from('products').update(productData).eq('id', id).select().single();
      if (error) return handleError(error);
      return data.id;
    } else {
      const { data, error } = await supabase.from('products').insert([productData]).select().single();
      if (error) return handleError(error);
      return data.id;
    }
  } catch (err) {
    return handleError(err);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return handleError(error);
  } catch (err) {
    handleError(err);
  }
};

export const trackClick = async (productId: string, marketplace: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    console.info(`[Demo Click] Produto: ${productId}, Canal: ${marketplace}`);
    return;
  }
  
  try {
    await supabase.from('clicks').insert([{ product_id: productId, marketplace, user_agent: navigator.userAgent }]);
    // Incremento de stats opcional aqui se necessário
  } catch (err) {
    console.warn("Erro ao rastrear clique (silencioso):", err);
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  if (!isSupabaseConfigured) return URL.createObjectURL(file);
  
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('products').upload(`images/${fileName}`, file);
    if (error) return handleError(error);
    const { data } = supabase.storage.from('products').getPublicUrl(`images/${fileName}`);
    return data.publicUrl;
  } catch (err) {
    return handleError(err);
  }
};
