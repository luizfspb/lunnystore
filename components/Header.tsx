
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  user: any;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    try {
      // Fix: Cast supabase.auth to any to resolve property access error for signOut
      await (supabase.auth as any).signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const navLinks = [
    { label: 'Catálogo', path: '/' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Contato', path: '/contato' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tighter uppercase">
              LUNNY<span className="text-gray-900">STORE</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  location.pathname === link.path ? 'text-indigo-600' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin"
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                    isAdmin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Sair"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="Acesso Admin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="md:hidden flex justify-center space-x-6 py-2 border-t bg-gray-50">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-xs font-semibold ${
              location.pathname === link.path ? 'text-indigo-600' : 'text-gray-500'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
