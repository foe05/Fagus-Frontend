#!/usr/bin/env node
/**
 * Importiert LinkedIn-Posts aus einer JSON-Datei als Blogbeiträge in WordPress
 * über die REST API (POST /wp-json/wp/v2/posts).
 *
 * - Standardmäßig werden alle Beiträge als ENTWURF (draft) angelegt.
 * - Keine externen Dependencies: nutzt das in Node 18+ eingebaute fetch().
 * - Idempotent: bereits importierte Posts (erkannt an der LinkedIn-URN-ID im
 *   Beitragstext) werden übersprungen, ein erneuter Lauf erzeugt keine Duplikate.
 *
 * Zugangsdaten kommen aus Umgebungsvariablen (oder einer lokalen .env):
 *   WP_BASE_URL       z. B. https://broetzens.de
 *   WP_USER           WordPress-Benutzername
 *   WP_APP_PASSWORD   Anwendungspasswort (WP-Admin → Profil → Anwendungspasswörter)
 *
 * Aufruf:
 *   node scripts/import-linkedin-posts.mjs
 *   node scripts/import-linkedin-posts.mjs --file data/linkedin-posts.json
 *   node scripts/import-linkedin-posts.mjs --dry-run
 *   node scripts/import-linkedin-posts.mjs --publish        # statt Entwurf direkt veröffentlichen
 *   node scripts/import-linkedin-posts.mjs --category "LinkedIn"
 *   node scripts/import-linkedin-posts.mjs --limit 3
 */

import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// ── Minimaler .env-Loader (keine Dependency) ──────────────────────────────
function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

// ── CLI-Argumente ─────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { dryRun: false, publish: false, file: 'data/linkedin-posts.json', category: 'LinkedIn', limit: Infinity };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--publish') args.publish = true;
    else if (a === '--file') args.file = argv[++i];
    else if (a === '--category') args.category = argv[++i];
    else if (a === '--limit') args.limit = parseInt(argv[++i], 10);
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

// ── Text-Aufbereitung ─────────────────────────────────────────────────────

/** Bereinigt CSV-Export-Artefakte (\" und leere ""-Zeilen) und gibt saubere Zeilen zurück. */
function cleanLines(rawText) {
  return rawText
    .split('\n')
    .map((line) => {
      let l = line.trim();
      // führende/abschließende Anführungszeichen aus dem Export entfernen
      l = l.replace(/^"+/, '').replace(/"+$/, '').trim();
      return l;
    })
    .filter((l) => l.length > 0);
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Erzeugt einen Beitragstitel aus der ersten sinnvollen Textzeile. */
function deriveTitle(lines) {
  const first = lines[0] || 'LinkedIn-Beitrag';
  // reine Hashtag-Zeile als Titel vermeiden, falls eine bessere Zeile existiert
  let candidate = first;
  if (/^#/.test(first) && lines.length > 1) candidate = lines.find((l) => !/^#/.test(l)) || first;

  const MAX = 70;
  if (candidate.length <= MAX) return candidate;
  // an Wortgrenze kürzen
  const slice = candidate.slice(0, MAX);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 30 ? slice.slice(0, lastSpace) : slice).trim() + ' …';
}

/** Extrahiert Hashtags (inkl. Umlauten) als Tag-Namen ohne führendes #. */
function extractHashtags(text) {
  const matches = text.match(/#[A-Za-z0-9ÄÖÜäöüß_]+/g) || [];
  const seen = new Set();
  const tags = [];
  for (const m of matches) {
    const name = m.slice(1);
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      tags.push(name);
    }
  }
  return tags;
}

/** Baut den HTML-Inhalt aus den bereinigten Zeilen + Quellenangabe. */
function buildContent(lines, postUrl) {
  const paragraphs = lines.map((l) => `<p>${escapeHtml(l)}</p>`).join('\n');
  const source = postUrl
    ? `\n<hr />\n<p><em>Ursprünglich veröffentlicht auf LinkedIn: <a href="${escapeHtml(postUrl)}" target="_blank" rel="noopener noreferrer">Originalbeitrag ansehen</a></em></p>`
    : '';
  return paragraphs + source;
}

/** Extrahiert die eindeutige LinkedIn-URN-ID (lange Zahl) aus der post_url. */
function extractUrnId(postUrl) {
  const matches = (postUrl || '').match(/\d{10,}/g);
  return matches ? matches[matches.length - 1] : null;
}

/** "2026-05-07 17:43" → "2026-05-07T17:43:00" (lokale Zeit, wie von WP erwartet). */
function toWpDate(datetime, date) {
  if (datetime && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(datetime)) {
    return datetime.replace(' ', 'T') + (datetime.length === 16 ? ':00' : '');
  }
  if (date) return `${date}T09:00:00`;
  return undefined;
}

// ── WordPress REST API ────────────────────────────────────────────────────
class WordPressClient {
  constructor(baseUrl, user, appPassword) {
    this.base = baseUrl.replace(/\/+$/, '') + '/wp-json/wp/v2';
    const token = Buffer.from(`${user}:${appPassword.replace(/\s+/g, '')}`).toString('base64');
    this.authHeader = `Basic ${token}`;
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.base}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const text = await res.text();
    let body;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    if (!res.ok) {
      const msg = body && body.message ? body.message : res.statusText;
      throw new Error(`WP API ${res.status} (${endpoint}): ${msg}`);
    }
    return body;
  }

  /** Holt oder erstellt eine Kategorie und gibt deren ID zurück. */
  async ensureCategory(name) {
    const found = await this.request(`/categories?search=${encodeURIComponent(name)}&per_page=100`);
    const exact = found.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exact) return exact.id;
    const created = await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return created.id;
  }

  /** Holt oder erstellt einen Tag und gibt dessen ID zurück. */
  async ensureTag(name) {
    const found = await this.request(`/tags?search=${encodeURIComponent(name)}&per_page=100`);
    const exact = found.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (exact) return exact.id;
    const created = await this.request('/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    return created.id;
  }

  /** Prüft anhand der URN-ID im Beitragstext, ob der Post bereits existiert. */
  async findExistingByUrn(urnId) {
    if (!urnId) return null;
    const statuses = 'publish,draft,pending,future,private';
    const found = await this.request(
      `/posts?search=${encodeURIComponent(urnId)}&status=${statuses}&per_page=5`
    );
    return Array.isArray(found) && found.length > 0 ? found[0] : null;
  }

  async createPost(payload) {
    return this.request('/posts', { method: 'POST', body: JSON.stringify(payload) });
  }
}

// ── Hauptablauf ───────────────────────────────────────────────────────────
async function main() {
  loadDotEnv();
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`LinkedIn → WordPress Import

  node scripts/import-linkedin-posts.mjs [Optionen]

Optionen:
  --file <pfad>       JSON-Datei (Standard: data/linkedin-posts.json)
  --category <name>   Kategorie für alle Beiträge (Standard: LinkedIn)
  --publish           Direkt veröffentlichen statt als Entwurf
  --dry-run           Nichts schreiben, nur anzeigen, was passieren würde
  --limit <n>         Nur die ersten n Beiträge importieren
  -h, --help          Diese Hilfe

Benötigte Umgebungsvariablen (oder .env):
  WP_BASE_URL, WP_USER, WP_APP_PASSWORD`);
    return;
  }

  const status = args.publish ? 'publish' : 'draft';
  const { WP_BASE_URL, WP_USER, WP_APP_PASSWORD } = process.env;

  if (!args.dryRun) {
    const missing = ['WP_BASE_URL', 'WP_USER', 'WP_APP_PASSWORD'].filter((k) => !process.env[k]);
    if (missing.length) {
      console.error(`❌ Fehlende Umgebungsvariablen: ${missing.join(', ')}`);
      console.error('   Lege sie in einer lokalen .env an (siehe .env.example) oder exportiere sie.');
      process.exit(1);
    }
  }

  const filePath = path.resolve(process.cwd(), args.file);
  const posts = JSON.parse(await readFile(filePath, 'utf8'));
  console.log(`📄 ${posts.length} Beiträge aus ${args.file} geladen.`);
  console.log(`⚙️  Status: ${status}${args.dryRun ? ' (DRY RUN – es wird nichts geschrieben)' : ''}, Kategorie: "${args.category}"\n`);

  const wp = args.dryRun ? null : new WordPressClient(WP_BASE_URL, WP_USER, WP_APP_PASSWORD);

  let categoryId = null;
  if (!args.dryRun) {
    categoryId = await wp.ensureCategory(args.category);
  }

  const tagCache = new Map();
  let created = 0;
  let skipped = 0;
  let failed = 0;
  const limit = Number.isFinite(args.limit) ? args.limit : posts.length;

  for (let i = 0; i < Math.min(posts.length, limit); i++) {
    const post = posts[i];
    const lines = cleanLines(post.text || '');
    if (lines.length === 0) {
      console.log(`⏭️  [${i + 1}] Leerer Text – übersprungen.`);
      skipped++;
      continue;
    }

    const title = deriveTitle(lines);
    const urnId = extractUrnId(post.post_url);
    const content = buildContent(lines, post.post_url);
    const hashtags = extractHashtags(post.text || '');
    const date = toWpDate(post.datetime, post.date);

    if (args.dryRun) {
      console.log(`📝 [${i + 1}] "${title}"`);
      console.log(`      Datum: ${date || '—'} | Tags: ${hashtags.join(', ') || '—'} | URN: ${urnId || '—'}`);
      created++;
      continue;
    }

    try {
      const existing = await wp.findExistingByUrn(urnId);
      if (existing) {
        console.log(`⏭️  [${i + 1}] Bereits vorhanden (#${existing.id}) – übersprungen: "${title}"`);
        skipped++;
        continue;
      }

      const tagIds = [];
      for (const name of hashtags) {
        const key = name.toLowerCase();
        if (!tagCache.has(key)) tagCache.set(key, await wp.ensureTag(name));
        tagIds.push(tagCache.get(key));
      }

      const payload = {
        title,
        content,
        status,
        categories: [categoryId],
        tags: tagIds,
      };
      if (date) payload.date = date;

      const result = await wp.createPost(payload);
      console.log(`✅ [${i + 1}] Angelegt (#${result.id}, ${status}): "${title}"`);
      created++;
    } catch (err) {
      console.error(`❌ [${i + 1}] Fehler bei "${title}": ${err.message}`);
      failed++;
    }
  }

  console.log(`\n── Zusammenfassung ──`);
  console.log(`   Angelegt:       ${created}`);
  console.log(`   Übersprungen:   ${skipped}`);
  console.log(`   Fehlgeschlagen: ${failed}`);
  if (args.dryRun) console.log(`\n   ℹ️  Dry Run – es wurde nichts in WordPress geschrieben.`);
}

main().catch((err) => {
  console.error(`\n💥 Abbruch: ${err.message}`);
  process.exit(1);
});
