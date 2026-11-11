import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_KEY } from './env';
// Cliente do servidor COM a sessao do usuario: o RLS vale normalmente.
export function supabaseServer() {
  const store = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {}
      },
    },
  });
}
