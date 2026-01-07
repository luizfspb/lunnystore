
import React, { useState, useEffect } from 'react';
import { Product, VideoType } from '../types';
import { trackClick } from '../services/supabaseService';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [selectedMedia, setSelectedMedia] = useState<string>(product.capa_url);
  const [isMediaVideo, setIsMediaVideo] = useState(false);
  const [videoType, setVideoType] = useState<VideoType | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleBuyClick = (marketplace: string, url: string) => {
    trackClick(product.id, marketplace);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderVideoEmbed = (url: string, type: VideoType) => {
    if (type === VideoType.YOUTUBE) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return (
        <iframe 
          className="w-full aspect-video rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return <video src={url} controls className="w-full rounded-xl" />;
  };

  const allMedia: Array<{ type: string; url: string; alt: string; videoType?: VideoType }> = [
    { type: 'image', url: product.capa_url, alt: 'Capa' },
    ...(product.imagens || []).map(img => ({ type: 'image', url: img.url, alt: img.alt })),
    ...(product.videos || []).map(v => ({ type: 'video', url: v.url, alt: 'Vídeo', videoType: v.tipo }))
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-gray-500 hover:text-red-500 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="md:w-3/5 bg-gray-50 flex flex-col p-4 md:p-6 overflow-y-auto">
          <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm bg-white min-h-[300px] flex items-center justify-center">
            {isMediaVideo ? renderVideoEmbed(selectedMedia, videoType!) : (
              <img src={selectedMedia} alt={product.titulo} className="w-full h-full object-contain max-h-[500px]" />
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allMedia.map((media, idx) => (
              <button key={idx} onClick={() => { setSelectedMedia(media.url); setIsMediaVideo(media.type === 'video'); setVideoType(media.videoType || null); }} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedMedia === media.url ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                {media.type === 'image' ? <img src={media.url} alt={media.alt} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-800 flex items-center justify-center"><svg className="text-white w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="md:w-2/5 p-6 md:p-10 overflow-y-auto flex flex-col">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{product.categoria}</span>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">{product.titulo}</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag, idx) => <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">#{tag}</span>)}
          </div>
          <p className="text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">{product.descricao}</p>
          <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">ONDE COMPRAR</h4>
            <div className="grid gap-3">
              {(product.onde_comprar || []).sort((a, b) => a.prioridade - b.prioridade).map((option) => (
                <button key={option.id} onClick={() => handleBuyClick(option.marketplace, option.url)} className="flex items-center justify-between w-full p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs text-gray-600">{option.marketplace.substring(0, 2).toUpperCase()}</span>
                    <div className="text-left">
                      <div className="text-sm font-bold text-gray-900">{option.label}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">{option.marketplace}</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
