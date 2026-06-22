// Vercel Edge Middleware — password gate for the /clients/ area.
//
// Visitors are sent to a branded login page (/clients/login) where they enter
// a single password (no username). The password is verified HERE, on the edge,
// against the CLIENT_AREA_PASSWORD environment variable — it is never shipped
// to the browser or stored in this repo. On success we set an HttpOnly session
// cookie; protected pages (and their HTML) are never served without it.
//
// Runs before any static file is served, and covers /clients and everything
// beneath it, so future client pages are protected automatically.

export const config = {
  matcher: ['/clients', '/clients/:path*'],
};

const COOKIE = 'cdr_session';
const LOGIN_PATH = '/clients/login';
const DEFAULT_NEXT = '/clients/fernando-3f9a2/';
const SECRET = 'jlh-clients-v1'; // static salt; the real secret is the env password
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Derive a session token from the password. Not the password itself, so the
// cookie never carries the secret in the clear.
async function token(password) {
  const data = new TextEncoder().encode(password + '|' + SECRET);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isLogin(pathname) {
  return pathname === LOGIN_PATH || pathname === LOGIN_PATH + '/';
}

// Only allow internal redirects under /clients/, never back to the login page.
function safeNext(next) {
  if (typeof next === 'string' && next.startsWith('/clients/') && !isLogin(next.split('?')[0])) {
    return next;
  }
  return DEFAULT_NEXT;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const password = process.env.CLIENT_AREA_PASSWORD || '';
  const expected = await token(password);

  // 1) Login form submission — verify the password here on the edge.
  if (isLogin(url.pathname) && request.method === 'POST') {
    const form = await request.formData();
    const candidate = (form.get('password') || '').toString();
    const next = safeNext((form.get('next') || '').toString());

    if (password && candidate === password) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: new URL(next, url).toString(),
          'Set-Cookie': `${COOKIE}=${expected}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
        },
      });
    }

    const back = new URL(LOGIN_PATH, url);
    back.searchParams.set('error', '1');
    back.searchParams.set('next', next);
    return new Response(null, { status: 303, headers: { Location: back.toString() } });
  }

  // 2) The login page itself is public, so the password can be entered.
  if (isLogin(url.pathname)) {
    return;
  }

  // 3) Everything else under /clients needs a valid session cookie.
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)cdr_session=([^;]+)/);
  if (password && match && match[1] === expected) {
    return; // authorized — serve the requested page
  }

  // 4) Not authorized → send to the login page, remembering the destination.
  const login = new URL(LOGIN_PATH, url);
  login.searchParams.set('next', url.pathname + url.search);
  return new Response(null, { status: 302, headers: { Location: login.toString() } });
}
