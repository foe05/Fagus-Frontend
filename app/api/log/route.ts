import { NextResponse, type NextRequest } from 'next/server';
import { logEvent } from '@/lib/logging';

// Allowlist of event names the public-facing proxy will forward. Anyone can
// reach POST /api/log, so we don't want arbitrary attacker-controlled events
// polluting the central log. Add new entries here when a new client beacon
// needs to fire.
const ALLOWED_EVENTS = new Set<string>(['rostock_pageview']);

interface IncomingBody {
  event?: unknown;
  payload?: unknown;
}

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: IncomingBody;
  try {
    body = (await req.json()) as IncomingBody;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = typeof body?.event === 'string' ? body.event : null;
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const clientPayload =
    body?.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
      ? (body.payload as Record<string, unknown>)
      : {};

  // Server-side enrichment: the browser cannot spoof these because we read
  // them off the HTTP request headers Next.js receives, not the JSON body.
  const userAgent = req.headers.get('user-agent') ?? '';
  const referer = req.headers.get('referer') ?? '';

  await logEvent({
    event,
    payload: {
      ...clientPayload,
      user_agent: userAgent,
      referer,
    },
  });

  return NextResponse.json({ ok: true });
}
