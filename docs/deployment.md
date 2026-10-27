# Deployment

Status: live
Updated: 2026-10-27

## Netlify build

Netlify builds with `npm install && npm run generate` and publishes `dist/`. `netlify.toml` also carries:

- Immutable caching for `/_nuxt/*`
- Security headers on every path: `Content-Security-Policy`, `Strict-Transport-Security`, `Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`. The comments above them explain why `script-src` still allows `'unsafe-inline'`
- A JSON content type for `/.well-known/apple-app-site-association`, required for iOS Universal Links

The deep-link rewrites (`/guardian/*`, `/course/*`, `/classroom/*`, `/open` to
`app-open.html`, status 200 so the original URL stays) are **not** in `netlify.toml`. On
Netlify, Nitro builds with its `netlify-static` preset, which writes its own
`dist/_redirects` ending in `/* /404.html 404` — and Netlify evaluates `_redirects` before
`netlify.toml`, so rules kept in the toml lost to that catch-all and every one of those
paths returned a 404. They live in `public/_redirects`, which the preset appends its
catch-all *after*. Order in that file is what makes them work.

`/og-image.png` also redirects there, to `/og/home.jpg`, for anything that scraped the old
card before the redesign.

## Managed TLS for form submissions

Builds use Node 22.23.4, which includes the eMudhra certificate-compromise fix. Netlify manages the deployed functions runtime separately. Form submissions rely on Netlify's managed runtime and its certificate trust store, with Node's normal HTTPS certificate and hostname verification enabled. The early-access and enquiry handlers do not block submissions based on the runtime's Node version. The patched build requirement in `package.json` remains in place; it does not attest to the functions runtime's patch level.

After deployment, send an `OPTIONS` request to `/api/early-access`, `/api/pilot`, and `/api/partner` (for example, `curl --include --request OPTIONS https://alexandria.ifftu.dev/api/early-access`). Each handler returns 204 with `Allow: POST, OPTIONS` and `Cache-Control: no-store`. These probes send no credentials, create no contacts, and send no email; they check route availability, not runtime patch level or Plunk delivery. Missing Plunk configuration still returns 503, and an upstream contact-request failure, including TLS validation failure, returns 502. `node --test tests/*.test.mjs` covers submissions on managed runtimes, upstream failures, and probes without side effects.
