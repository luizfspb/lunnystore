
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProductsAdmin, deleteProduct, saveProduct } from '../../services/supabaseService';
import { Product } from '../../types';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto do Supabase?")) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await saveProduct({ ativo: !product.ativo }, product.id);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ativo: !p.ativo } : p));
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Supabase</h1>
          <p className="text-gray-500">Métricas de conversão em tempo real.</p>
        </div>
        <Link to="/admin/produtos/novo" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg">Novo Produto</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm font-bold text-gray-400 uppercase mb-1">Total de Produtos</div>
          <div className="text-4xl font-black text-gray-900">{products.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm font-bold text-gray-400 uppercase mb-1">Cliques Totais</div>
          <div className="text-4xl font-black text-indigo-600">{products.reduce((acc, p) => acc + (p.stats?.totalClicks || 0), 0)}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Cliques</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Carregando...</td></tr>
              ) : products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border">
                        <img src={product.capa_url} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">{product.titulo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleActive(product)} className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${product.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.ativo ? 'Ativo' : 'Inativo'}</button>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-indigo-600">{product.stats?.totalClicks || 0}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => navigate(`/admin/produtos/editar/${product.id}`)} className="p-2 text-gray-400 hover:text-indigo-600">Editar</button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
