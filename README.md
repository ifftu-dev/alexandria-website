# Alexandria Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/60198459-38b1-418d-8443-8d430aee6008/deploy-status)](https://app.netlify.com/projects/alexandria-ifftu/deploys)

Marketing website for [Alexandria](https://github.com/ifftu-dev/alexandria) — the free, open-source, decentralized learning platform.

**Live at [alexandria.ifftu.dev](https://alexandria.ifftu.dev)**

## Stack

- [Nuxt 4](https://nuxt.com) (Vue 3, SSR)
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
- Deployed on [Netlify](https://www.netlify.com)

## Pages

- **/** — Landing page with parallax starfield hero and platform-aware download button
- **/recruiter** — For recruiters: skill-based hiring, evidence chains, blockchain verification
- **/institutions** — For institutions: LMS features, competitor comparison, pricing, FAQ
- **/privacy** — Privacy policy (analytics disclosure, third parties)
- **error.vue** — Root-level error page; fires a `404` goal on 404 responses

## Analytics

The site uses [Plausible Analytics](https://plausible.io) — privacy-first, cookieless, GDPR-compliant by default. The script is loaded from `nuxt.config.ts` (`app.head.script[]`) with `data-domain="alexandria.ifftu.dev"` and tracks:

- Pageviews, referrers, outbound link clicks, file downloads (automatic)
- Custom goals via the `plausible-event-name=<Goal>` class convention:
  - `Nav-Recruiter` / `Nav-Institutions` — nav + footer clicks
  - `CTA-GitHub` — all "View on GitHub" / "Request a Demo" / "Get Started" buttons
  - `Download` — footer Download link to GitHub releases
  - `404` — fired from `error.vue` when `error.statusCode === 404`

No cookies, no cross-site tracking, no personal identifiers. See `/privacy` on the live site for the user-facing policy.

## Getting Started

```sh
npm install
npm run dev
```

Dev server starts at `http://localhost:3000`.

## Commands

| Command           | Description                          |
| :---------------- | :----------------------------------- |
| `npm run dev`     | Start dev server                     |
| `npm run build`   | Build for production                 |
| `npm run generate`| Generate static site                 |
| `npm run preview` | Preview the production build locally |

## License

All rights reserved. See LICENSE for details.
