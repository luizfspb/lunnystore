
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={product.capa_url || 'https://picsum.photos/400/500?grayscale'} 
          alt={product.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.preco_apartir && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow-sm">
            <span className="text-xs font-medium text-gray-500">A partir de</span>
            <div className="text-sm font-bold text-indigo-600">
              {product.preco_apartir.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end pointer-events-none">
          <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md shadow-sm">
            {product.categoria}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {product.titulo}
        </h3>
        
        <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow">
          {product.descricao}
        </p>

        <div className="mt-4 flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="text-gray-400 text-[10px] py-0.5">+{product.tags.length - 3}</span>
          )}
        </div>

        <button className="mt-4 w-full bg-gray-50 text-indigo-600 text-xs font-bold py-2 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
