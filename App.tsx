
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

import Header from './components/Header';
import Home from './components/Public/Home';
import About from './components/Public/About';
import Contact from './components/Public/Contact';
import Login from './components/Admin/Login';
import Dashboard from './components/Admin/Dashboard';
import ProductEditor from './components/Admin/ProductEditor';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    // Fix: Cast supabase.auth to any to resolve property access errors on SupabaseAuthClient
    (supabase.auth as any).getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    // Fix: Cast supabase.auth to any to resolve property access errors on SupabaseAuthClient
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const user = session?.user || null;

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />

            <Route path="/admin/login" element={user ? <Navigate to="/admin" /> : <Login />} />
            <Route 
              path="/admin" 
              element={user ? <Dashboard /> : <Navigate to="/admin/login" />} 
            />
            <Route 
              path="/admin/produtos/novo" 
              element={user ? <ProductEditor /> : <Navigate to="/admin/login" />} 
            />
            <Route 
              path="/admin/produtos/editar/:id" 
              element={user ? <ProductEditor /> : <Navigate to="/admin/login" />} 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="bg-white border-t py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} LunnyStore. Todos os direitos reservados.</p>
            <p className="mt-2 italic">Infraestrutura segura via Supabase.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
