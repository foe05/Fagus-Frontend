// Server-only by virtue of reading process.env.LOGGING_API_KEY — never
// import this from a client component. (We skip the `server-only` package
// to avoid an extra dependency for a single guard.)

const LOGGING_URL = 'https://log.broetzens.de/api/log';
const TOOL = 'broetzens-website';
const INSTANCE = 'broetzens.de';
const TOOL_VERSION = '1.0.0';
const TIMEOUT_MS = 3000;

interface LogEventInput {
  event: string;
  payload?: Record<string, unknown>;
}

/**
 * Fire-and-forget log call to the central tool-logging API.
 * Never throws — logging is observational, it must not break user-facing
 * requests if the logging backend hiccups. Returns silently if
 * LOGGING_API_KEY is unset (e.g. local dev without secrets).
 */
export async function logEvent({ event, payload }: LogEventInput): Promise<void> {
  const apiKey = process.env.LOGGING_API_KEY;
  if (!apiKey) return;

  try {
    const response = await fetch(LOGGING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        tool: TOOL,
        tool_version: TOOL_VERSION,
        instance: INSTANCE,
        event,
        payload: payload ?? {},
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(
        `[logging] event=${event} backend returned ${response.status}`,
      );
    }
  } catch (err) {
    console.error(`[logging] event=${event} failed`, err);
  }
}
