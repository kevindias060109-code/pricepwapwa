import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { SUPABASE_URL, SUPABASE_KEY, missingSupabaseEnv } from '@/lib/env';

const PUBLIC = ['/login', '/definir-senha', '/offline.html', '/manifest.webmanifest', '/sw.js'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC.some((p) => pathname === p) || pathname.startsWith('/icons/');
  let res = NextResponse.next({ request: req });

  // Sem variaveis do Supabase o createServerClient lanca excecao e derruba TUDO
  // (MIDDLEWARE_INVOCATION_FAILED). Aqui respondemos com um aviso claro.
  const missing = missingSupabaseEnv();
  if (missing.length) {
    if (isPublic) return res;
    return new NextResponse(
      `Configuracao incompleta: defina na Vercel as variaveis ${missing.join(', ')} e faca um novo deploy.`,
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    );
  }

  let user = null;
  try {
    const sb = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll(list) {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    });
    const { data } = await sb.auth.getUser(); // renova a sessao
    user = data?.user ?? null;
  } catch (e) {
    // Falha de rede/Supabase: trata como sem sessao, nunca como erro 500.
    console.error('middleware auth:', e?.message);
  }

  if (!user && !isPublic && !pathname.startsWith('/api/')) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
