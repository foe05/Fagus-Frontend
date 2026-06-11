import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';
import { logEvent } from '@/lib/logging';

// Campaign tracking: any request carrying a `?tele=<CODE>` query param is
// recorded in the central logging service as a `campaign_landing` event with
// the code in the payload. A marketing link like broetzens.de/?tele=EINS thus
// shows up under tool=broetzens-website / instance=broetzens.de in the log.
//
// Runs as middleware (not a per-page server component) because campaign links
// can land on ANY route, and almost all pages are statically prerendered — so
// per-page server code does not execute per visit. Middleware runs on every
// real HTTP request, before the cache.

// The tele value comes straight off the URL, so it is attacker-controllable.
// Constrain it to a short, safe charset so nobody can inject arbitrary event
// data. Anything that does not match is silently ignored.
const TELE_PATTERN = /^[A-Z0-9_-]{1,32}$/;

// Skip link-preview scanners and prefetchers so they don't inflate campaign
// counts (WhatsApp/Slack/Facebook unfurl links, email security scanners, etc.).
const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|slackbot|telegrambot|twitterbot|discordbot|linkedinbot|pinterest|preview|monitor|headless|lighthouse|google-?(read|safety|inspectiontool)/i;

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const raw = req.nextUrl.searchParams.get('tele');

  // 99.9% of requests have no tele param — bail immediately, zero overhead.
  if (!raw) return NextResponse.next();

  const tele = raw.toUpperCase();
  if (!TELE_PATTERN.test(tele)) return NextResponse.next();

  // Honour prefetch hints and filter obvious bots.
  const secPurpose =
    req.headers.get('sec-purpose') ?? req.headers.get('purpose') ?? '';
  const userAgent = req.headers.get('user-agent') ?? '';
  const isPrefetch = secPurpose.includes('prefetch');
  const isBot = BOT_UA_PATTERN.test(userAgent);

  if (!isPrefetch && !isBot) {
    // Pull along any UTM params so the central log carries full campaign
    // attribution, not just the tele code.
    const utm: Record<string, string> = {};
    for (const [key, value] of req.nextUrl.searchParams) {
      if (key.startsWith('utm_')) utm[key] = value;
    }

    // Fire-and-forget: logEvent never throws and has its own 3s timeout, so
    // waitUntil adds no latency to the user's response.
    event.waitUntil(
      logEvent({
        event: 'campaign_landing',
        payload: {
          tele,
          path: req.nextUrl.pathname,
          referer: req.headers.get('referer') ?? '',
          user_agent: userAgent,
          ...utm,
        },
      }),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Run on page requests only — exclude Next internals, the API routes (which
  // do their own logging), and static asset extensions.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)',
  ],
};
