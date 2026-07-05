// Vercel Edge Middleware — password gate + per-client routing for /clients/.
//
// Visitors go to a branded login page (/clients/login), enter their password
// (no username), and are routed to THEIR portal. Passwords are verified HERE,
// on the edge, against environment variables — never shipped to the browser or
// stored in this repo. On success we set an HttpOnly session cookie; protected
// pages (and their HTML) are never served without it.
//
// Passwords live in env vars (either or both):
//   CLIENT_PASSWORDS      JSON map of password -> landing path, e.g.
//                         {"Dominican":"/clients/fernando-3f9a2/","acme9":"/clients/acme-x1/"}
//   CLIENT_AREA_PASSWORD  legacy single password, mapped to the default portal.
// To add a client: add one entry to CLIENT_PASSWORDS in Vercel. Any valid
// password unlocks /clients; login sends each client to their own page.

export const config = {
  matcher: ['/clients', '/clients/:path*'],
};

const COOKIE = 'cdr_session';
const LOGIN_PATH = '/clients/login';
const DEFAULT_NEXT = '/clients/fernando-3f9a2/';
const SECRET = 'jlh-clients-v1'; // static salt; the real secret is the env password
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// password -> landing path. Merges the JSON map and the legacy single password.
function passwordMap() {
  let map = {};
  try {
    if (process.env.CLIENT_PASSWORDS) map = JSON.parse(process.env.CLIENT_PASSWORDS);
  } catch (e) {
    map = {};
  }
  const legacy = process.env.CLIENT_AREA_PASSWORD;
  if (legacy && !Object.prototype.hasOwnProperty.call(map, legacy)) map[legacy] = DEFAULT_NEXT;
  return map;
}

// Session token derived from the password, so the cookie never carries the
// secret in the clear.
async function token(password) {
  const data = new TextEncoder().encode(password + '|' + SECRET);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function isLogin(pathname) {
  return pathname === LOGIN_PATH || pathname === LOGIN_PATH + '/';
}

// Only allow internal redirects under /clients/, never the login page itself.
function cleanNext(next) {
  if (typeof next === 'string' && next.startsWith('/clients/') && !isLogin(next.split('?')[0])) {
    return next;
  }
  return null;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const map = passwordMap();

  // 1) Login form submission — verify the password here on the edge.
  if (isLogin(url.pathname) && request.method === 'POST') {
    const form = await request.formData();
    const candidate = (form.get('password') || '').toString();
    const nextRaw = (form.get('next') || '').toString();

    if (candidate && Object.prototype.hasOwnProperty.call(map, candidate)) {
      const dest = cleanNext(nextRaw) || map[candidate] || DEFAULT_NEXT;
      const tok = await token(candidate);
      return new Response(null, {
        status: 303,
        headers: {
          Location: new URL(dest, url).toString(),
          'Set-Cookie': `${COOKIE}=${tok}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
        },
      });
    }

    const back = new URL(LOGIN_PATH, url);
    back.searchParams.set('error', '1');
    const kept = cleanNext(nextRaw);
    if (kept) back.searchParams.set('next', kept);
    return new Response(null, { status: 303, headers: { Location: back.toString() } });
  }

  // 2) The login page itself is public, so the password can be entered.
  if (isLogin(url.pathname)) {
    return;
  }

  // 3) Everything else under /clients needs a session cookie matching any
  //    current client password.
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)cdr_session=([^;]+)/);
  if (m) {
    for (const pw of Object.keys(map)) {
      if (m[1] === (await token(pw))) return; // authorized — serve the requested page
    }
  }

  // 4) Not authorized → send to the login page, remembering the destination.
  const login = new URL(LOGIN_PATH, url);
  login.searchParams.set('next', url.pathname + url.search);
  return new Response(null, { status: 302, headers: { Location: login.toString() } });
}
