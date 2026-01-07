
import { createClient } from '@supabase/supabase-js';

/**
 * Em aplicações modernas (React, Next.js, Vite), as credenciais são 
 * injetadas via variáveis de ambiente para segurança e portabilidade.
 * 
 * NEXT_PUBLIC_SUPABASE_URL: URL do seu projeto Supabase
 * NEXT_PUBLIC_SUPABASE_ANON_KEY: Chave pública anônima (safe for client-side)
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificamos se as chaves básicas de conexão estão presentes
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'));

if (!isSupabaseConfigured) {
  console.info(
    "%c[Catálogo Pro] O site está operando em 'Modo Demo'. Para conectar ao seu banco de dados real, configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    "color: #4f46e5; font-weight: bold;"
  );
}

// Inicializamos o cliente. Se não houver URL, passamos um placeholder 
// apenas para evitar erro de inicialização do SDK antes da checagem do isSupabaseConfigured.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-to-avoid-crash.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
