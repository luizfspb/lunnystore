
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getActiveProducts } from '../../services/supabaseService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import ProductModal from '../ProductModal';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alpha'>('recent');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const data = await getActiveProducts();
        setProducts(data);
        
        const pSlug = searchParams.get('p');
        if (pSlug) {
          const found = data.find(p => p.slug === pSlug);
          if (found) setSelectedProduct(found);
        }
      } catch (error: any) {
        console.error("Erro ao carregar produtos:", error);
        setErrorMessage("Ocorreu um problema ao conectar com o catálogo. Tente atualizar a página.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const categories = useMemo(() => {
    const cats = products.map(p => p.categoria);
    return ['Todas', ...Array.from(new Set(cats))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products].filter(p => {
      const matchesSearch = p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesCategory = selectedCategory === 'Todas' || p.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'recent') {
      result.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.stats?.totalClicks || 0) - (a.stats?.totalClicks || 0));
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => a.titulo.localeCompare(b.titulo));
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchParams({ p: product.slug });
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Indicador de Modo Demo */}
      {!isSupabaseConfigured && (
        <div className="mb-6 bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Modo Demo Ativado</p>
          </div>
          <p className="text-[10px] text-indigo-400 hidden sm:block">Conecte seu Supabase em <code>lib/supabase.ts</code> para usar dados reais.</p>
        </div>
      )}

      <section className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Descubra o Melhor da <span className="text-indigo-600">Tecnologia & Design</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Curadoria exclusiva de achadinhos e produtos premium. Qualidade garantida e os menores preços em um só lugar.
        </p>
      </section>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input 
            type="text" 
            placeholder="Buscar por nome ou tag..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select 
            className="px-4 py-3 rounded-xl bg-gray-50 border-transparent text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 transition-all cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            className="px-4 py-3 rounded-xl bg-gray-50 border-transparent text-sm font-medium outline-none focus:bg-white focus:border-indigo-600 transition-all cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="recent">Mais Recentes</option>
            <option value="popular">Mais Clicados</option>
            <option value="alpha">Ordem A-Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-xl border p-4 animate-pulse">
              <div className="aspect-[4/5] bg-gray-100 rounded-lg mb-4" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={handleOpenProduct} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="mb-4 text-gray-300">
             <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Nenhum produto encontrado</h3>
          <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou busca.</p>
        </div>
      )}

      {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseProduct} />}
    </div>
  );
};

export default Home;
