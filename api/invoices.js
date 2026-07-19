// Vercel serverless function — client-facing invoice list (sent/paid only).
// Same session-cookie gate as the portal pages. Reads the registry data.json
// the operator's bridge publishes (drafts never leave the operator's box).
const FILE = 'clients/fernando-3f9a2/invoices/data.json';
const REPO = process.env.GITHUB_REPO || 'bigpapituna/jstlikehome-consulting';
const SECRET = 'jlh-clients-v1'; // must match middleware.js

function passwordMap() {
  let map = {};
  try { if (process.env.CLIENT_PASSWORDS) map = JSON.parse(process.env.CLIENT_PASSWORDS); } catch (e) {}
  const legacy = process.env.CLIENT_AREA_PASSWORD;
  if (legacy) map[legacy] = map[legacy] || '/clients/fernando-3f9a2/';
  return map;
}
const OWNER = '/clients/fernando-3f9a2/';   // this endpoint only serves Fernando

async function token(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw + '|' + SECRET));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function authorized(req) {
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/(?:^|;\s*)cdr_session=([^;]+)/);
  if (!m) return false;
  const map = passwordMap();
  for (const pw of Object.keys(map)) {
    // authorize only when this password's own client area is Fernando's — a
    // different client's valid session must NOT read/write Fernando's data
    if (m[1] === (await token(pw))) return (map[pw] || OWNER) === OWNER;
  }
  return false;
}

export default async function handler(req, res) {
  if (!(await authorized(req))) return res.status(401).json({ ok: false, error: 'sign in to the portal first' });
  if (!process.env.GITHUB_TOKEN) return res.status(503).json({ ok: false, error: 'not configured' });
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method not allowed' });
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'jlh-portal' },
    });
    if (r.status === 404) return res.status(200).json({ ok: true, invoices: [] });
    if (!r.ok) throw new Error(`github ${r.status}`);
    const j = await r.json();
    const data = JSON.parse(Buffer.from(j.content, 'base64').toString('utf-8'));
    return res.status(200).json({ ok: true, invoices: data.invoices || [] });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e.message || e).slice(0, 200) });
  }
}
