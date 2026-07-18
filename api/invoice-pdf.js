// Vercel serverless function — stream a published invoice PDF to a signed-in
// portal visitor. Reads the repo file live via GitHub (no deploy needed when
// new PDFs are committed).
const REPO = process.env.GITHUB_REPO || 'bigpapituna/jstlikehome-consulting';
const SECRET = 'jlh-clients-v1'; // must match middleware.js

function passwords() {
  let map = {};
  try { if (process.env.CLIENT_PASSWORDS) map = JSON.parse(process.env.CLIENT_PASSWORDS); } catch (e) {}
  const legacy = process.env.CLIENT_AREA_PASSWORD;
  if (legacy) map[legacy] = map[legacy] || '/clients/fernando-3f9a2/';
  return Object.keys(map);
}

async function token(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw + '|' + SECRET));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function authorized(req) {
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/(?:^|;\s*)cdr_session=([^;]+)/);
  if (!m) return false;
  for (const pw of passwords()) {
    if (m[1] === (await token(pw))) return true;
  }
  return false;
}

export default async function handler(req, res) {
  if (!(await authorized(req))) return res.status(401).json({ ok: false, error: 'sign in to the portal first' });
  if (!process.env.GITHUB_TOKEN) return res.status(503).json({ ok: false, error: 'not configured' });
  const month = String(req.query.month || '');
  if (!/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ ok: false, error: 'month must be YYYY-MM' });
  try {
    const FILE = `clients/fernando-3f9a2/invoices/files/invoice-${month}.pdf`;
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'jlh-portal' },
    });
    if (r.status === 404) return res.status(404).json({ ok: false, error: 'PDF not available' });
    if (!r.ok) throw new Error(`github ${r.status}`);
    const j = await r.json();
    const buf = Buffer.from(j.content, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${month}.pdf"`);
    return res.status(200).send(buf);
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e.message || e).slice(0, 200) });
  }
}
