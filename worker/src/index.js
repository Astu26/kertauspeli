// Kertauspelin palvelinfunktio (Cloudflare Worker).
//   POST   /auth          – tarkistaa aikuisen PIN-koodin
//   POST   /generate      – kuvat → Claude → luonnospaketti (vastaus virtaa riveittäin, jotta yhteys ei katkea)
//   POST   /publish       – tallentaa tarkistetun paketin
//   GET    /packs         – kaikki julkaistut paketit (lapsen sovellus hakee nämä)
//   DELETE /packs/:id     – poistaa paketin
// Salaisuudet: ANTHROPIC_API_KEY, PARENT_PIN (wrangler secret put). Tallennus: KV-nimiavaruus PACKS.
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, SCHEMA, userText, MOCK_DRAFT } from './prompt.js';
import { toPack, slug } from './pack.js';

const MODEL = 'claude-opus-5-5';
const MAX_IMAGES = 40;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default {
  async fetch(req, env, ctx) {
    const h = corsHeaders(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    try {
      if (req.method === 'GET' && path === '/packs') return listPacks(env, h);
      if (req.method === 'GET' && path === '/') return json({ ok: true, service: 'kertauspeli' }, 200, h);
      // Kaikki muu vaatii aikuisen PIN-koodin
      const auth = await checkPin(req, env);
      if (auth) return json({ error: auth }, 401, h);
      if (req.method === 'POST' && path === '/auth') return json({ ok: true }, 200, h);
      if (req.method === 'POST' && path === '/generate') return generate(req, env, ctx, h);
      if (req.method === 'POST' && path === '/publish') return publish(req, env, h);
      const m = path.match(/^\/packs\/([a-z0-9-]+)$/);
      if (req.method === 'DELETE' && m) return removePack(m[1], env, h);
      return json({ error: 'Ei löytynyt.' }, 404, h);
    } catch (e) {
      return json({ error: 'Palvelinvirhe: ' + (e && e.message || e) }, 500, h);
    }
  }
};

// ---------- apurit ----------
function corsHeaders(req, env) {
  const origin = req.headers.get('Origin') || '';
  const allowed = String(env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
  const local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) || local ? origin : (allowed[0] || '*'),
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,X-PIN',
    'Vary': 'Origin'
  };
}
function json(data, status, h) {
  return new Response(JSON.stringify(data), { status, headers: { ...h, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
function same(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
// PIN-tarkistus ja arvaamisen esto: 10 väärää yritystä tunnissa samasta osoitteesta lukitsee tunniksi
async function checkPin(req, env) {
  if (!env.PARENT_PIN) return 'PIN-koodia ei ole asetettu palvelimelle.';
  const ip = req.headers.get('CF-Connecting-IP') || 'tuntematon';
  const key = 'fail:' + ip;
  const fails = +(await env.PACKS.get(key) || 0);
  if (fails >= 10) return 'Liian monta väärää PIN-koodia. Yritä tunnin päästä uudelleen.';
  if (same(req.headers.get('X-PIN') || '', String(env.PARENT_PIN))) return null;
  await env.PACKS.put(key, String(fails + 1), { expirationTtl: 3600 });
  return 'Väärä PIN-koodi.';
}
function apiError(e) {
  if (e instanceof Anthropic.AuthenticationError) return 'Clauden API-avain ei kelpaa. Tarkista avain.';
  if (e instanceof Anthropic.PermissionDeniedError) return 'API-avaimella ei ole oikeutta tähän malliin.';
  if (e instanceof Anthropic.RateLimitError) return 'Liikaa pyyntöjä juuri nyt. Odota hetki ja yritä uudelleen.';
  if (e instanceof Anthropic.BadRequestError) return 'Pyyntö hylättiin: ' + e.message + ' (Onko API-tilillä krediittejä?)';
  if (e instanceof Anthropic.APIError) return `Clauden API-virhe ${e.status}: ${e.message}`;
  return (e && e.message) || String(e);
}

// ---------- kuvat → luonnos ----------
async function generate(req, env, ctx, h) {
  const body = await req.json();
  const images = (Array.isArray(body.images) ? body.images : [])
    .filter(i => i && IMAGE_TYPES.includes(i.media_type) && typeof i.data === 'string' && i.data.length > 100)
    .slice(0, MAX_IMAGES);
  if (!images.length) return json({ error: 'Kuvia ei tullut perille.' }, 400, h);
  const meta = {
    subject: String(body.subject || '').slice(0, 60),
    title: String(body.title || '').slice(0, 80),
    notes: String(body.notes || '').slice(0, 500),
    count: images.length
  };

  // Vastaus virtaa NDJSON-riveinä: {ping}, {progress}, lopuksi {draft} tai {error}.
  // Näin yhteys pysyy auki koko generoinnin ajan (Cloudflare katkaisee hiljaisen yhteyden 100 sekunnissa).
  const { readable, writable } = new TransformStream();
  const w = writable.getWriter();
  const enc = new TextEncoder();
  const send = o => w.write(enc.encode(JSON.stringify(o) + '\n')).catch(() => {});

  const work = (async () => {
    let chars = 0;
    const tick = setInterval(() => send({ progress: chars }), 4000);
    try {
      let draft;
      if (env.MOCK === '1') {
        await new Promise(r => setTimeout(r, 2500));
        draft = MOCK_DRAFT;
      } else {
        const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
        const content = [];
        images.forEach((im, i) => {
          content.push({ type: 'text', text: `Kuva ${i + 1}:` });
          content.push({ type: 'image', source: { type: 'base64', media_type: im.media_type, data: im.data } });
        });
        content.push({ type: 'text', text: userText(meta) });
        const stream = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 64000,
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          output_config: { effort: 'high', format: { type: 'json_schema', schema: SCHEMA } },
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content }]
        });
        stream.on('text', delta => { chars += delta.length; });
        const msg = await stream.finalMessage();
        if (msg.stop_reason === 'refusal') throw new Error('Tekoäly ei suostunut käsittelemään kuvia.');
        if (msg.stop_reason === 'max_tokens') throw new Error('Vastaus katkesi kesken. Kokeile vähemmillä kuvilla kerrallaan.');
        const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
        draft = JSON.parse(text);
        await send({ usage: { input: msg.usage.input_tokens, output: msg.usage.output_tokens } });
      }
      await send({ draft });
    } catch (e) {
      await send({ error: apiError(e) });
    } finally {
      clearInterval(tick);
      await w.close().catch(() => {});
    }
  })();
  ctx.waitUntil(work);
  return new Response(readable, { headers: { ...h, 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' } });
}

async function publish(req, env, h) {
  const { draft } = await req.json();
  if (!draft || typeof draft !== 'object') return json({ error: 'Pakettia ei tullut perille.' }, 400, h);
  const id = slug(draft.title) + '-' + Date.now().toString(36);
  const pack = toPack(draft, id);
  if (!pack.chapters.length) return json({ error: 'Paketissa ei ole yhtään kysymystä.' }, 400, h);
  await env.PACKS.put('pack:' + id, JSON.stringify(pack));
  const index = JSON.parse(await env.PACKS.get('index') || '[]');
  index.unshift(id);
  await env.PACKS.put('index', JSON.stringify(index));
  return json({ ok: true, id }, 200, h);
}

async function listPacks(env, h) {
  const index = JSON.parse(await env.PACKS.get('index') || '[]');
  const packs = (await Promise.all(index.map(id => env.PACKS.get('pack:' + id, 'json')))).filter(Boolean);
  return json({ packs }, 200, h);
}

async function removePack(id, env, h) {
  const index = JSON.parse(await env.PACKS.get('index') || '[]');
  await env.PACKS.delete('pack:' + id);
  await env.PACKS.put('index', JSON.stringify(index.filter(x => x !== id)));
  return json({ ok: true }, 200, h);
}
