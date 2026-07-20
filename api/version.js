// Vercel serverless function — which commit is actually deployed? (B70)
// Public and harmless (the repo is public; the SHA is already visible on
// GitHub). Exists so portal-publish.sh can VERIFY a push really deployed
// instead of trusting a 401-reachability placebo — Vercel's build-skip and
// auto-cancel races made "pushed" and "live" different facts twice.
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ sha: process.env.VERCEL_GIT_COMMIT_SHA || null });
};
