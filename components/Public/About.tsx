
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Sobre a <span className="text-indigo-600">LunnyStore</span></h1>
        <p className="text-xl text-gray-600 leading-relaxed">Conectando você aos melhores produtos através de uma experiência visual única.</p>
      </div>

      <div className="prose prose-lg mx-auto text-gray-700 space-y-8">
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Nossa Missão</h2>
          <p>
            A LunnyStore nasceu da necessidade de organizar as melhores ofertas e produtos de diversos marketplaces 
            em um único lugar, com foco total em experiência do usuário e transparência.
          </p>
        </section>

        <section className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl">
          <h2 className="text-2xl font-extrabold mb-4">Por que confiar em nós?</h2>
          <ul className="space-y-4 font-medium">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
              <span>Seleção rigorosa de vendedores com boa reputação.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
              <span>Verificamos os preços periodicamente para garantir curadoria real.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
              <span>Não processamos pagamentos; redirecionamos você para os gigantes confiáveis do mercado.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Como funciona?</h2>
          <p>
            É simples: nós navegamos, testamos e selecionamos. Quando você encontra algo que gosta na LunnyStore, 
            clica no botão de marketplace da sua preferência e finaliza a compra com toda a segurança 
            que plataformas como Shopee, Mercado Livre e Amazon oferecem.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
