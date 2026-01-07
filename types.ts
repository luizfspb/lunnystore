
export enum VideoType {
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  MP4 = 'mp4'
}

export interface ProductVideo {
  id: string;
  tipo: VideoType;
  url: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface BuyOption {
  id: string;
  marketplace: string;
  label: string;
  url: string;
  logo_url?: string;
  prioridade: number;
}

export interface ProductStats {
  totalClicks: number;
  clicksByMarketplace: Record<string, number>;
}

export interface Product {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  tags: string[];
  preco_apartir: number | null;
  ativo: boolean;
  capa_url: string;
  imagens: ProductImage[];
  videos: ProductVideo[];
  onde_comprar: BuyOption[];
  created_at?: string;
  updated_at?: string;
  stats?: ProductStats;
}

export interface ClickEvent {
  id?: string;
  product_id: string;
  marketplace: string;
  created_at: string;
  user_agent: string;
}
