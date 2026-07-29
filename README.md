# Alexandria Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/60198459-38b1-418d-8443-8d430aee6008/deploy-status)](https://app.netlify.com/projects/alexandria-ifftu/deploys)

Marketing website for [Alexandria](https://github.com/ifftu-dev/alexandria) — the free, open-source learning app where you study offline and own the credentials you earn.

**Live at [alexandria.ifftu.dev](https://alexandria.ifftu.dev)**

> **This branch offers downloads.** `feat/early-access` is the same site with the
> download CTA replaced by an email waitlist, for while the alpha is still
> closed. The two differ only in what the CTA asks for.

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
- **/privacy** — Privacy policy (analytics disclosure, third parties)
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
| `ui/ThemeToggle.vue` | Light / dark / system |

## The download button

`composables/useDownload.ts` resolves what the visitor should actually get, at runtime, from the GitHub releases API.

- **Platform and architecture** are detected client-side. macOS never admits to Apple Silicon in its user-agent, so architecture comes from `getHighEntropyValues()` where available, then the WebGL renderer string, and failing both is assumed to be Apple Silicon — the button names the requirement, so an Intel holdout sees it before clicking.
- **Assets are matched loosely on naming and strictly on file type** (`ASSET_MATCHERS`), so a build is picked up the day CI starts publishing it without this file changing. Intel macOS deliberately has no generic `.dmg` fallback: the only unqualified build is Apple Silicon and it would not run.
- **Releases are walked newest-first.** When the latest release skips a platform, the visitor gets the most recent release that has it, with the version named in the button rather than quietly serving something older.
- **Never offered:** `.aab` (Play Store bundle), `.ipa` (needs TestFlight), and the updater's `.app.tar.gz`, `.sig` and `latest.json`.
- **When the API is unreachable** the button reads "Download" and points at the releases page. It only claims a build is *missing* once the release list has actually come back.

If a platform's button says there is no build, check CI before checking this file — at time of writing the newest releases had stopped publishing Windows and Linux artefacts that earlier ones carried.

## Analytics

[Plausible](https://plausible.io) — cookieless, no personal identifiers. Loaded from `nuxt.config.ts` (`app.head.script[]`) with `data-domain="alexandria.ifftu.dev"`. Pageviews, referrers, outbound clicks and file downloads are automatic; custom goals use the `plausible-event-name=<Goal>` class convention:

| Goal | Fired by |
| :--- | :--- |
| `CTA-Download` | The hero and closing download buttons |
| `Download` | Drawer and footer links to the releases page |
| `CTA-GitHub` | Every "view the source" / "request a demo" / GitHub link |
| `CTA-Follow` | "Follow for updates" |
| `Nav-Recruiter` / `Nav-Institutions` | Nav, drawer, footer and cross-page links |
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
