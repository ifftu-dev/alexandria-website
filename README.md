# Alexandria Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/60198459-38b1-418d-8443-8d430aee6008/deploy-status)](https://app.netlify.com/projects/alexandria-ifftu/deploys)

Marketing website for [Alexandria](https://github.com/ifftu-dev/alexandria) — the free, open-source learning app where you study offline and own the credentials you earn.

**Live at [alexandria.ifftu.dev](https://alexandria.ifftu.dev)**

> **This branch collects early-access signups instead of offering downloads.**
> `feat/site-redesign` is the same site with platform-detected download buttons,
> for when the alpha opens to everyone. The two differ only in what the CTA asks for.

## Stack

- [Nuxt 4.5](https://nuxt.com) (Vue 3) — prerendered to static HTML, no server at runtime
- [Tailwind CSS v4](https://tailwindcss.com) alongside a hand-written token system in `assets/css/main.css`
- TypeScript, strict; `vue-tsc -b --noEmit` must pass
- Self-hosted Inter and JetBrains Mono, Latin subsets only
- Node 22 (see `.nvmrc`)
- Deployed on [Netlify](https://www.netlify.com) — `npm run generate` to `dist/`

## Pages

- **/** — Landing page: mesh-gradient hero, an interactive replica of the real app shell, the full feature grid, how it works, platform support, and the credential-verification section
- **/recruiter** — For recruiters: an interactive composite skill query, problem/answer split, features, hiring pipeline
- **/institutions** — For institutions: interactive curriculum mapper, tabbed capabilities, competitor comparison, pricing, FAQ
- **/privacy** — Privacy policy: the early-access list, analytics, third parties
- **error.vue** — Root-level error page; fires a `404` goal on 404 responses

Both audience pages carry a visible "not built yet" notice — those features are described, not shipped.

## Components

| Component | What it is |
| :--- | :--- |
| `AppReplica.vue` | Interactive recreation of the Alexandria desktop shell, built from the app's own tokens and component CSS. Navigates, searches (`/` or `⌘K`), verifies a credential, casts a vote. Collapses to the app's four-tab mobile layout via a container query on the window itself |
| `SkillGraph.vue` | The app's sidebar skill graph — force-directed canvas, same status colours and Bloom-scaled radii as `SidebarSkillGraph.vue` |
| `MeshGradient.vue` | Animated gradient behind every hero and CTA band. Time-based, so drift is identical at 60 Hz and 120 Hz; pauses off-screen; static under `prefers-reduced-motion` |
| `SkillQuery.vue` | Recruiter hero: composite skill query with Bloom levels and confidence thresholds |
| `CurriculumMap.vue` | Institutions hero: which skills a module develops, at which level |
| `EarlyAccessForm.vue` | Email capture, posting to the function below |
| `ui/ThemeToggle.vue` | Light / dark / system |

## Early-access signups

The form posts JSON to `/api/early-access` — a Netlify function
(`netlify/functions/early-access.ts`) that forwards to [Plunk](https://www.useplunk.com).
The secret key stays server-side, and the function drops honeypot hits and malformed
addresses before they reach the account.

Two calls per signup:

1. `POST /contacts` — upsert the address with `data.platform`, the platform their browser reported. Plunk answers with `_meta.isNew` at the **top level** of the response: the dashboard endpoints return the resource directly, with no `success`/`data` wrapper. (The public endpoints like `/v1/send` do wrap, which is why the function accepts both shapes.)
2. `POST /v1/send` — a confirmation email, **only when the contact is new**, so re-submitting an address does not send a second one. The payload must carry `from`, or Plunk answers `422 VALIDATION_ERROR — "Sender email is required either in request or template"`.

A failed confirmation does not fail the signup. They are on the list either way, and
telling someone to retry would enter them twice. The trade-off is that a broken send
path is invisible from the browser — the visitor is told to check an inbox that never
receives anything — so send failures are logged and worth watching in the function log
after any change here.

Set these in **Netlify → Site settings → Environment variables**:

| Variable | Purpose |
| :--- | :--- |
| `PLUNK_API_KEY` | Secret key (`sk_…`). The public `pk_…` key only works for `/v1/track` and is not enough here |
| `PLUNK_API_BASE` | Optional; defaults to `https://next-api.useplunk.com` |
| `PLUNK_FROM` | Optional sender address; defaults to `admin@alexandria.ifftu.dev`. Must be on a domain verified in the Plunk account |
| `PLUNK_FROM_NAME` | Optional display name; defaults to `Alexandria` |

Until the key is set the endpoint answers `503` with a message that blames the
configuration rather than the visitor's address.

Addresses are trimmed and lower-cased before sending, so casing variants do not become
separate contacts. `data.platform` takes arbitrary keys — no field needs declaring in
Plunk first.

**Before this sends anything real:** verify `alexandria.ifftu.dev` as a sending domain in
Plunk and set SPF, DKIM and DMARC on it. DNS lives in Netlify DNS (NS1). One trap: that
subdomain already carries `MX → smtp.google.com`, so its SPF record has to authorise
Google Workspace *and* Plunk — a single TXT record with both includes, since a domain
with two SPF records has none that validate. Deliverability is yours to own on a self-serve sender in a way it
would not be on a managed marketing platform, and the launch announcement is the one
email that must not land in spam. A `200` from `/v1/send` means accepted, not delivered —
an unverified sender is the likeliest reason a `200` still produces nothing in the inbox.
The confirmation copy lives in `confirmationBody()` in the function.

**The function does not run under `npm run dev`.** Use `netlify dev` to exercise the
whole path locally, or the form will report that it could not reach the list. Note that
`netlify dev` proxies Vite and breaks its HMR websocket, so expect console noise there.

Local runs read `PLUNK_API_KEY` from a `.env` at the repo root. That file is gitignored
and must stay that way: Netlify's secrets scanner fails the build outright — exit code
`2` at the "building site" stage — if it finds the value of one of its own environment
variables committed to the repo, which is the friendlier of the two consequences.

## Analytics

[Plausible](https://plausible.io) — cookieless, no personal identifiers. Loaded from `nuxt.config.ts` (`app.head.script[]`) with `data-domain="alexandria.ifftu.dev"`. Pageviews, referrers, outbound clicks and file downloads are automatic; custom goals use the `plausible-event-name=<Goal>` class convention:

| Goal | Fired by |
| :--- | :--- |
| `EarlyAccess` | Signup button, plus the nav, drawer and footer links to it |
| `Nav-Recruiter` / `Nav-Institutions` | Nav, drawer, footer and cross-page links |
| `CTA-GitHub` | Every "view the source" / "request a demo" / GitHub link |
| `Announcement` | The dismissible banner link |
| `404` | `error.vue`, when `error.statusCode === 404` |

Goal names are load-bearing — renaming a class silently breaks a funnel that has already collected history.

## Deployment

Netlify builds with `npm install && npm run generate` and publishes `dist/`. `netlify.toml` also carries:

- Immutable caching for `/_nuxt/*`, plus `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy`
- A JSON content type for `/.well-known/apple-app-site-association`, required for iOS Universal Links
- Rewrites for `/guardian/*`, `/course/*`, `/classroom/*` and `/open` to `app-open.html` — the interstitial the OS falls back to when a deep link is not handed to an installed app. Status 200 keeps the original URL

## Getting Started

```sh
npm install
npm run dev          # http://localhost:3000
netlify dev          # also runs the early-access function
```

## Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run generate` | Generate the static site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npx vue-tsc -b --noEmit` | Typecheck — CI enforces this |

## Licence

Copyright © 2025-2026 IFFTU Pvt. Ltd. See [LICENSE](./LICENSE) for terms.

The Alexandria product is owned by Alexandria Pvt. Ltd.; the app's core is MIT-licensed with enterprise modules under the IFFTU Enterprise License, which is what the site footer states.
