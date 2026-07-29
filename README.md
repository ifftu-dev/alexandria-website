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

The form posts JSON to `/api/early-access` — a Netlify function (`netlify/functions/early-access.ts`) that forwards to [Kit](https://kit.com). The API key stays server-side: Kit's v3 endpoint accepts a public key from the browser, but a key in the bundle is a key anyone can use to add subscribers.

Set these in **Netlify → Site settings → Environment variables**:

| Variable | Purpose |
| :--- | :--- |
| `KIT_API_KEY` | Kit v3 API key |
| `KIT_FORM_ID` | Numeric id of the Kit form subscribers are added to |
| `KIT_API_BASE` | Optional; defaults to `https://api.convertkit.com/v3` |

Until both required variables are set the endpoint answers `503` with a message that blames the configuration rather than the visitor's address.

The detected platform is sent as a Kit custom field named `platform`, so "how many people are waiting on Windows" is answerable — create that field in Kit or the value is discarded. Addresses are trimmed and lower-cased before sending, so casing variants don't become separate subscribers. An off-screen honeypot field is answered with a silent success rather than an error, so bots don't simply retry.

**Kit settings worth checking:** open and click tracking are on by default and sit badly beside what `/privacy` claims; decide separately whether you want double opt-in.

**The function does not run under `npm run dev`.** Use `netlify dev` to exercise the whole path locally, or the form will report that it could not reach the list.

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
