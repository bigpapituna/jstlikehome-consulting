// Vercel serverless function — deliverables list for the client portal.
// GET  -> { ok, tasks }
// POST -> { action: "add"|"complete"|"reopen"|"eta", ... , by: "<name>" }
//
// Auth: requires the SAME session cookie the portal's edge middleware sets
// (cdr_session = sha256(password + salt)) — validated here against the same
// env passwords, so the API is exactly as protected as the portal pages.
//
// Persistence: the JSON file in this repo (clients/.../deliverables/data.json)
// via the GitHub Contents API — every change is a commit (built-in audit
// trail; the operator's tooling syncs through git). Requires env:
//   GITHUB_TOKEN  fine-grained PAT, this repo only, Contents read/write
//   GITHUB_REPO   optional, defaults to "bigpapituna/jstlikehome-consulting"

const FILE = 'clients/fernando-3f9a2/deliverables/data.json';
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

async function ghGet() {
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'jlh-portal' },
  });
  if (!r.ok) throw new Error(`github read ${r.status}`);
  const j = await r.json();
  return { sha: j.sha, data: JSON.parse(Buffer.from(j.content, 'base64').toString('utf-8')) };
}

async function ghPut(data, sha, message) {
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'jlh-portal', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha, content: Buffer.from(JSON.stringify(data, null, 1)).toString('base64') }),
  });
  if (r.status === 409) return false; // sha race — caller retries
  if (!r.ok) throw new Error(`github write ${r.status}`);
  return true;
}

const clean = (s, n) => String(s == null ? '' : s).trim().slice(0, n);
const isDate = (s) => s === '' || /^\d{4}-\d{2}-\d{2}$/.test(s);
const WEEK = 7 * 24 * 60 * 60 * 1000;

// Drop archived (deleted) tasks older than 7 days. Runs on every read and write
// — no cron needed. Unparseable timestamps are kept, never silently dropped.
function purge(data) {
  const arch = data.archive || (data.archive = []);
  const cutoff = Date.now() - WEEK;
  data.archive = arch.filter((t) => {
    const ts = Date.parse((t.deleted_at || '').replace(' ', 'T'));
    return isNaN(ts) || ts >= cutoff;
  });
  return data;
}

function mutate(data, body) {
  const tasks = data.tasks || (data.tasks = []);
  purge(data);
  const arch = data.archive;
  const by = clean(body.by, 40) || 'someone';
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  if (body.action === 'add') {
    const title = clean(body.title, 140);
    if (!title) return 'title required';
    if (tasks.length >= 200) return 'too many tasks';
    tasks.unshift({ id: 't' + Date.now().toString(36), title, desc: clean(body.desc, 500),
      assignee: clean(body.assignee, 40) || 'Alondra',
      due: isDate(clean(body.due, 10)) ? clean(body.due, 10) : '', eta: '',
      status: 'open', created: now, created_by: by, completed_at: '', completed_by: '' });
    return null;
  }
  if (body.action === 'restore') {
    const i = arch.findIndex((x) => x.id === body.id);
    if (i < 0) return 'not in archive';
    const t = arch.splice(i, 1)[0];
    delete t.deleted_at; delete t.deleted_by;
    tasks.unshift(t);
    return null;
  }
  if (body.action === 'delete') {
    const i = tasks.findIndex((x) => x.id === body.id);
    if (i < 0) return 'task not found';
    const t = tasks.splice(i, 1)[0];
    t.deleted_at = now; t.deleted_by = by;
    arch.unshift(t);
    return null;
  }
  const t = tasks.find((x) => x.id === body.id);
  if (!t) return 'task not found';
  if (body.action === 'complete') { t.status = 'done'; t.completed_at = now; t.completed_by = by; return null; }
  if (body.action === 'reopen') { t.status = 'open'; t.completed_at = ''; t.completed_by = ''; return null; }
  if (body.action === 'eta') {
    const eta = clean(body.eta, 10);
    if (!isDate(eta)) return 'eta must be YYYY-MM-DD';
    t.eta = eta; t.eta_by = by; return null;
  }
  if (body.action === 'edit') {
    const title = clean(body.title, 140);
    if (!title) return 'title required';
    const due = clean(body.due, 10);
    if (!isDate(due)) return 'due must be YYYY-MM-DD';
    t.title = title; t.desc = clean(body.desc, 500);
    t.assignee = clean(body.assignee, 40) || t.assignee || 'Alondra';
    t.due = due;
    return null;
  }
  return 'unknown action';
}

export default async function handler(req, res) {
  if (!(await authorized(req))) return res.status(401).json({ ok: false, error: 'sign in to the portal first' });
  if (!process.env.GITHUB_TOKEN) return res.status(503).json({ ok: false, error: 'not configured yet (GITHUB_TOKEN missing)' });
  try {
    if (req.method === 'GET') {
      const { data } = await ghGet();
      purge(data);
      return res.status(200).json({ ok: true, tasks: data.tasks || [], archive: data.archive || [] });
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'object' && req.body ? req.body : JSON.parse(req.body || '{}');
      // Vercel geolocates the request — stamp the country onto the commit so the
      // Hermes watcher can flag actions from outside the team's countries.
      const country = String(req.headers['x-vercel-ip-country'] || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
      for (let attempt = 0; attempt < 3; attempt++) {
        const { sha, data } = await ghGet();
        const err = mutate(data, body);
        if (err) return res.status(400).json({ ok: false, error: err });
        const msg = `Deliverables: ${body.action} by ${clean(body.by, 40) || 'portal'}${country ? ' @' + country : ''}`;
        if (await ghPut(data, sha, msg)) return res.status(200).json({ ok: true, tasks: data.tasks, archive: data.archive });
      }
      return res.status(409).json({ ok: false, error: 'busy — try again' });
    }
    return res.status(405).json({ ok: false, error: 'method not allowed' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e.message || e).slice(0, 200) });
  }
}
