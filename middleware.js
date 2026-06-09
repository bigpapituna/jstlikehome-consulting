// Vercel Edge Middleware — HTTP Basic Auth for the /clients/ area.
//
// Runs on Vercel's edge BEFORE any static file is served, so protected
// pages (and their HTML) are never sent to the browser unless the visitor
// supplies the correct password. The password is read from the
// CLIENT_AREA_PASSWORD environment variable — it is never stored in this
// repository or exposed to the client.
//
// Applies to /clients and everything beneath it, so future client pages
// are protected automatically.

export const config = {
  matcher: ['/clients', '/clients/:path*'],
};

export default function middleware(request) {
  const expected = process.env.CLIENT_AREA_PASSWORD;
  const auth = request.headers.get('authorization');

  if (expected && auth && auth.startsWith('Basic ')) {
    try {
      // Decode "Basic base64(username:password)" and compare only the password.
      const decoded = atob(auth.slice(6));
      const password = decoded.slice(decoded.indexOf(':') + 1);
      if (password === expected) {
        return; // Authenticated — continue and serve the requested page.
      }
    } catch (_) {
      // fall through to the 401 below
    }
  }

  // Not authenticated: ask the browser to show its native sign-in dialog.
  // The page content is NOT included in this response.
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected client area", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
