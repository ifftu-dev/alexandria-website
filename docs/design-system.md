# Design system

Status: live
Updated: 2026-10-27

Type, layout values, pages and components of the marketing site. The code is the reference; this explains the choices behind it.

## Typography

Three families, all vendored through `@fontsource` and declared by hand at the Latin
subset in `assets/css/main.css`. They are **not** loaded from Google Fonts: the site tells
visitors it embeds nothing from another origin, and a font CDN is a third-party request on
every page load.

| Role | Face | Notes |
| :--- | :--- | :--- |
| Display — h1, section headings, stat figures | Newsreader, weight 300 | At 700 a display-size serif reads as a masthead rather than an argument |
| Body, UI | Public Sans | 21 KB lighter than the Inter it replaced |
| Eyebrows, footnotes, code, data values | IBM Plex Mono | The eyebrow is the one place the mono carries meaning: it marks a label so it stops competing with the serif heading under it |

Both new faces have metric-matched local fallbacks (Georgia for Newsreader, Arial for
Public Sans) so the swap does not reflow. Measured CLS is 0.008, against the 0.024 that
prompted the original fallback when the site used one face.

`app.vue` preloads only the display face — it is what the LCP element is set in. The other
two have fallbacks good enough that preloading them would take bandwidth from the one that
matters.

The italic is a separate 63 KB file serving the hero emphasis and the pull quote on
`/why-recognition`. That is the obvious thing to cut if the font budget ever matters.

### The design values live in one place

Section headings, sub-headings and cards are defined once in `assets/css/main.css`. Pages
had drifted to nine `.p-sub` variants and section headings ranging from 24px to 46px, which
is invisible on any single page and obvious the moment you move between two.

```
section heading   clamp(30px, 4vw, 46px), weight 300, display serif
sub-heading       15px / 1.7 / 68ch
card              14px radius, 20px padding   (.card-compact for label-and-value cards)
card heading      15.5px
card body         14px / 1.65
```

Override the measure when a column genuinely differs. Do not re-declare the rest.

## Pages

The site is built around one thesis — **learning became free, recognition did not** — and
every page is a facet of it. It used to lead with mechanism (offline, on-device, own your
credentials), which answers a question the reader has not been asked yet.

| Route | What it is |
| :--- | :--- |
| **/** | The thesis, the app replica, the evidence band, the problem, how it works, the free-forever structure, who pays, and what is *not* built yet |
| **/why-recognition** | The evidence page. Sections `01`–`06` plus a sources appendix. Section 06, "What we do not know", names the two claims that could sink the project |
| **/technology** | How identity, sync, integrity, plugins, the skill map and platforms work — named precisely enough to argue with |
| **/learners** | Free, portable, offline; what it costs and what it does not |
| **/employers** | Evidence, the problem they already have, the four-step mechanism, packaging, then "nobody has hired through this yet" |
| **/institutions** | Self-host tier, what you get, who it fits, how you run it, then "no institution has deployed this yet" |
| **/verify** | A **working** verifier. Paste or drop a credential and it checks the Ed25519 signature in your browser — no upload, no account |
| **/pilots** | Pilot shapes for an institution or an employer, with the enquiry form |
| **/partners** | Deployment partnerships — governments, NGOs, funders |
| **/trust** | Security and compliance posture, dated |
| **/privacy** | Plain-language policy. **Not reviewed by a lawyer** |
| **/blog**, **/blog/[slug]** | Posts from `content/blog/*.md`, inlined at build time |
| **error.vue** | Root-level error page; fires a `404` goal on 404 responses |

`/recruiter` 301s to `/employers` and `/developers` 301s to `/technology`; both redirects
live in `public/_redirects`, which must stay ahead of the catch-all Nitro appends to it.

Every page states what is not built. That is a positioning choice, not placeholder copy —
"Built, shipped, and unproven", "Nobody has hired through this yet" and "No institution has
deployed this yet" are meant to be there.

## Components

| Component | What it is |
| :--- | :--- |
| `AppReplica.vue` | Interactive recreation of the Alexandria desktop shell, built from the app's own tokens and component CSS. Navigates, searches (`/` or `⌘K`), verifies a credential, casts a vote. Collapses to the app's four-tab mobile layout via a container query on the window itself. The learner it is signed in as cycles through twenty-two names — rural Indian, Bengali and Odia ones among them, since that is who the app is for — so no one place reads as the default; reduced motion keeps the rotation and cuts the slide |
| `SkillGraph.vue` | The app's sidebar skill graph — force-directed canvas, same status colors and Bloom-scaled radii as `SidebarSkillGraph.vue` |
| `MeshGradient.vue` | Animated gradient behind every hero and CTA band. Time-based, so drift is identical at 60 Hz and 120 Hz; pauses off-screen; static under `prefers-reduced-motion` |
| `StatusChip.vue` | One label for how real a thing is — `alpha` / `building` / `planned` / `sample`. Used wherever a capability, price or demo is described, because mixing shipped features with roadmap items makes the credible parts inherit the doubt of the speculative ones |
| `EnquiryForm.vue` | Pilot and partnership enquiries. Posts to `/api/pilot` or `/api/partner` — deliberately *not* the learner waitlist, so a hiring lead never lands in a campaign written for someone waiting on a build |
| `EarlyAccessForm.vue` | Waiting-list form — address, role, platforms. Role and platform controls stay collapsed until the email field is touched, so the fast path is unchanged |
| `WaitlistModal.vue` | The form in a native `<dialog>`. Rendered once from the layout; the nav, drawer, footer, hero and CTA band all open this one instance through `useWaitlist` |
| `ui/ThemeToggle.vue` | Light / dark / system |

`usePlatform` answers "which OS and CPU is this?" from the user agent alone. `useDownload`
shares it rather than duplicating the detection, and the waiting-list form uses it
directly — pulling in `useDownload` there meant fetching every GitHub release (25 KB of
third-party JSON, plus DNS and TLS) to render one string.

## Social cards and icons

`python3 scripts/generate-og.py` renders one card per route with headless Chrome
and writes JPEGs to `public/og/` — run it after changing headline copy or the
palette. It reuses the site's own values rather than approximating them: the base
color and blob palettes come from `MeshGradient.vue`, the positions are its
`SEEDS`, the mark is the nav's SVG, and the type is the same self-hosted
Newsreader and Public Sans.

JPEG rather than PNG on purpose: these are flat gradients, which PNG stores
badly, and WhatsApp declines to fetch previews much beyond 300 KB.

### Light and dark, and what that actually means

The generator produces **two sets** — `home.jpg` and `home-light.jpg`, and so on
for every route with a card (thirteen today). It is worth being exact about what the pair buys, because
it is easy to assume more:

> **Open Graph has no mechanism for color scheme.** Slack, LinkedIn, X, iMessage
> and every other unfurler fetches one image on the server, with no browser and
> no `prefers-color-scheme` to consult. There is no media query, no `<picture>`,
> and no second URL it will consider.

So `og:image` points at the **dark** card, which matches the site's hero. The
light set exists for the places a theme-aware asset genuinely works — a
light-background deck, a README, documentation — and so the pair stays in step
when the copy changes.

The asset that *does* follow the reader's setting is **`public/icon.svg`**, which
carries its own `prefers-color-scheme` media query and is declared ahead of the
raster icons in `nuxt.config.ts`. A browser takes the first favicon format it
understands, so the theme-aware mark wins wherever SVG icons are supported and
the PNG/ICO files remain the fallback. `theme-color` is likewise declared per
scheme.

Every route sets its own `og:image`; before this they silently inherited the
homepage card.
