
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { saveProduct, uploadImage } from '../../services/supabaseService';
import { Product, VideoType, ProductImage, ProductVideo, BuyOption } from '../../types';

const INITIAL_STATE: any = {
  slug: '',
  titulo: '',
  descricao: '',
  categoria: 'Tecnologia',
  tags: [],
  preco_apartir: null,
  ativo: true,
  capa_url: '',
  imagens: [],
  videos: [],
  onde_comprar: [],
};

const ProductEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (data) setFormData(data);
      };
      fetchProduct();
    }
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'capa' | 'galeria') => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files) as File[]) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      if (target === 'capa') {
        setFormData((prev: any) => ({ ...prev, capa_url: uploadedUrls[0] }));
      } else {
        const newImgs: ProductImage[] = uploadedUrls.map(url => ({ id: Math.random().toString(36).substring(7), url, alt: formData.titulo }));
        setFormData((prev: any) => ({ ...prev, imagens: [...(prev.imagens || []), ...newImgs] }));
      }
    } catch (error) {
      alert("Erro no upload para Supabase Storage.");
    }
  };

  const addBuyOption = () => {
    const newOption: BuyOption = {
      id: Math.random().toString(36).substring(7),
      marketplace: 'Shopee',
      label: 'Comprar na Shopee',
      url: '',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Shopee_logo.svg',
      prioridade: (formData.onde_comprar?.length || 0) + 1
    };
    setFormData((prev: any) => ({ ...prev, onde_comprar: [...(prev.onde_comprar || []), newOption] }));
  };

  const addVideo = () => {
    const newVideo: ProductVideo = { id: Math.random().toString(36).substring(7), tipo: VideoType.YOUTUBE, url: '' };
    setFormData((prev: any) => ({ ...prev, videos: [...(prev.videos || []), newVideo] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Remover campos gerados automaticamente para evitar erros de escrita
      const { id: _, created_at: __, updated_at: ___, ...dataToSave } = formData;
      await saveProduct(dataToSave, id);
      navigate('/admin');
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => navigate('/admin')} className="text-gray-500 font-semibold">Voltar</button>
        <h1 className="text-2xl font-black text-gray-900">{id ? 'Editar no Supabase' : 'Novo via Supabase'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Título</label>
              <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Slug</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Preço "A partir de"</label>
              <input type="number" step="0.01" value={formData.preco_apartir || ''} onChange={e => setFormData({...formData, preco_apartir: parseFloat(e.target.value) || null})} className="w-full p-3 bg-gray-50 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Categoria</label>
              <input type="text" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Descrição</label>
            <textarea rows={4} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Tags (Vírgula para separar)</label>
            <input type="text" value={formData.tags?.join(', ')} onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} className="w-full p-3 bg-gray-50 rounded-xl" placeholder="tech, apple, setup" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Mídia (Buckets)</h2>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <p className="text-xs font-bold mb-2">Capa Principal</p>
               <input type="file" onChange={e => handleFileUpload(e, 'capa')} className="text-xs" />
               {formData.capa_url && <img src={formData.capa_url} className="mt-2 w-20 h-20 object-cover rounded" />}
             </div>
             <div>
               <p className="text-xs font-bold mb-2">Galeria</p>
               <input type="file" multiple onChange={e => handleFileUpload(e, 'galeria')} className="text-xs" />
               <div className="flex gap-2 mt-2 flex-wrap">
                 {formData.imagens?.map((img: any) => <img key={img.id} src={img.url} className="w-10 h-10 object-cover rounded" />)}
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Links de Compra</h2>
            <button type="button" onClick={addBuyOption} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold">+ Adicionar Link</button>
          </div>
          <div className="space-y-3">
            {(formData.onde_comprar || []).map((opt: any, idx: number) => (
              <div key={opt.id} className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl">
                <input type="text" placeholder="Marketplace" value={opt.marketplace} onChange={e => {
                  const copy = [...formData.onde_comprar];
                  copy[idx].marketplace = e.target.value;
                  setFormData({...formData, onde_comprar: copy});
                }} className="p-2 rounded bg-white text-sm" />
                <input type="text" placeholder="Label" value={opt.label} onChange={e => {
                  const copy = [...formData.onde_comprar];
                  copy[idx].label = e.target.value;
                  setFormData({...formData, onde_comprar: copy});
                }} className="p-2 rounded bg-white text-sm" />
                <input type="text" placeholder="URL" value={opt.url} onChange={e => {
                  const copy = [...formData.onde_comprar];
                  copy[idx].url = e.target.value;
                  setFormData({...formData, onde_comprar: copy});
                }} className="p-2 rounded bg-white text-sm" />
                <input type="text" placeholder="Logo URL (opcional)" value={opt.logo_url || ''} onChange={e => {
                  const copy = [...formData.onde_comprar];
                  copy[idx].logo_url = e.target.value;
                  setFormData({...formData, onde_comprar: copy});
                }} className="p-2 rounded bg-white text-sm" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700">
          {isSubmitting ? 'Salvando...' : 'Salvar no Supabase'}
        </button>
      </form>
    </div>
  );
};

export default ProductEditor;
