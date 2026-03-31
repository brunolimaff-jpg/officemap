import { NextRequest, NextResponse } from 'next/server';

// Proxy seguro para o Habbo Imaging — evita CORS no browser
// Cacheia por 10 min no edge e 1h no CDN
export const runtime = 'edge';

const HABBO_BASE = 'https://www.habbo.com/habbo-imaging/avatarimage';
const MAX_RETRIES = 2;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const params = req.nextUrl.searchParams;

  // Valida que tem ao menos o param figure
  const figure = params.get('figure');
  if (!figure) {
    return new NextResponse('Missing figure param', { status: 400 });
  }

  const upstream = `${HABBO_BASE}?${params.toString()}`;

  let res: Response | null = null;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      res = await fetch(upstream, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SeniorScout/1.0)' },
        // edge runtime nao suporta AbortController timeout nativo — omitido
      });
      // Retry apenas em 5xx
      if (res.ok || res.status < 500) break;
    } catch {
      // Network error — tenta de novo
    }
    attempt++;
    if (attempt <= MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 150 * attempt));
    }
  }

  if (!res || !res.ok) {
    return new NextResponse('Avatar unavailable', { status: 502 });
  }

  const body = await res.arrayBuffer();
  const ct   = res.headers.get('content-type') ?? 'image/png';

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': ct,
      'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
