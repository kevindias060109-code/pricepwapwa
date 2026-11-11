// Leitura central das variaveis publicas do Supabase.
// IMPORTANTE: as referencias a process.env.NEXT_PUBLIC_* precisam ser literais
// para o Next.js embuti-las no bundle do navegador.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Aceita a chave "publishable" (padrao do projeto) e, se ela faltar, a chave "anon" (legado do Supabase).
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Nomes (nunca valores) das variaveis que faltam.
export function missingSupabaseEnv() {
  const miss = [];
  if (!SUPABASE_URL) miss.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_KEY) miss.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  return miss;
}
