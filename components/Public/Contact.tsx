
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Fale <span className="text-indigo-600">Conosco</span></h1>
        <p className="text-xl text-gray-600">Dúvidas, sugestões ou parcerias? Estamos a um clique de distância.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp</h3>
          <p className="text-gray-500 mb-6">Suporte rápido para suas dúvidas de compra.</p>
          <a 
            href="https://wa.me/5500000000000" 
            target="_blank" 
            rel="noopener"
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100"
          >
            Chamar no Whats
          </a>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Instagram</h3>
          <p className="text-gray-500 mb-6">Siga nosso perfil e não perca nenhum achadinho.</p>
          <a 
            href="https://instagram.com/seuperfil" 
            target="_blank" 
            rel="noopener"
            className="w-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-red-100"
          >
            Seguir no Insta
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
