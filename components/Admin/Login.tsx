
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Fix: Cast supabase.auth to any to resolve property access error for signInWithPassword
      const { error } = await (supabase.auth as any).signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setError("Credenciais inválidas ou erro de conexão com Supabase.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900">Acesso Restrito</h2>
          <p className="text-gray-500 text-sm">Painel Administrativo Supabase</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 px-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-indigo-600 outline-none transition-all"
              placeholder="admin@exemplo.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 px-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-indigo-600 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="text-red-500 text-xs font-bold text-center py-2">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
