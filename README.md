# Alexandria Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/60198459-38b1-418d-8443-8d430aee6008/deploy-status)](https://app.netlify.com/projects/alexandria-ifftu/deploys)

Marketing website for [Alexandria](https://github.com/ifftu-dev/alexandria) — the free, open-source learning app where you study offline and own the credentials you earn.

**Live at [alexandria.ifftu.dev](https://alexandria.ifftu.dev)**

> **The site collects waiting-list signups instead of offering downloads.**
> When the alpha opens to everyone, the CTA becomes a platform-detected download
> button — `usePlatform` and `useDownload` are already here for it.

## Getting started

Node 22.23.4 (`.nvmrc`); Node 24.22.1+ and 26.12.1+ also work.

```sh
npm install
npm run dev          # http://localhost:3000
netlify dev          # also runs the waiting-list and enquiry functions
```

## Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Dev server |
| `npm run generate` | Static site into `dist/` (what Netlify deploys) |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `node --test tests/*.test.mjs` | Unit tests (CI) |
| `npx nuxi typecheck` | Strict `vue-tsc` typecheck (CI) |
| `npm run test:e2e` | Playwright tests against `BASE_URL` (default: the live site; safe to repeat) |

## Stack

- [Nuxt 4.6](https://nuxt.com) (Vue 3), prerendered to static HTML; no server at runtime
- [Tailwind CSS v4](https://tailwindcss.com) alongside hand-written tokens in `assets/css/main.css`
- TypeScript, strict
- Self-hosted Newsreader, Public Sans and IBM Plex Mono (Latin subsets)
- Netlify hosting; two Netlify functions forward forms to Plunk
- Plausible analytics (cookieless)

## Deployment

Netlify runs `npm install && npm run generate` and publishes `dist/`. Headers
live in `netlify.toml`; redirects and deep-link rewrites live in
`public/_redirects`, where their order matters. Details and post-deploy checks:
[docs/deployment.md](docs/deployment.md).

## Documentation

| Doc | Contents |
| :--- | :--- |
| [docs/design-system.md](docs/design-system.md) | Typography, layout values, pages, components, social cards |
| [docs/waiting-list.md](docs/waiting-list.md) | Operator runbook: signups, enquiries, Plunk, mail auth, unsubscribes |
| [docs/content-policy.md](docs/content-policy.md) | Claims, sources and projections (`content/evidence.ts`) |
| [docs/analytics.md](docs/analytics.md) | Plausible goals and how to tag them |
| [docs/qa.md](docs/qa.md) | Responsive layout audit |
| [docs/deployment.md](docs/deployment.md) | Netlify build, redirects, form runtime checks |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Commit messages and pull requests |

## License

See [LICENSE](./LICENSE) for terms.

This website repository is MIT-licensed. The Alexandria application is licensed under GNU AGPL v3 or later; its credential verification library (`crates/alexandria-verify`) is licensed MIT OR Apache-2.0. See the [application's license](https://github.com/ifftu-dev/alexandria/blob/main/LICENSE.md) for component-specific terms. The website's license does not change the application's license.
