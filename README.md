# Alexandria Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/60198459-38b1-418d-8443-8d430aee6008/deploy-status)](https://app.netlify.com/projects/alexandria-ifftu/deploys)

Marketing website for [Alexandria](https://github.com/ifftu-dev/alexandria) — the free, open-source learning app where you study offline and own the credentials you earn.

**Live at [alexandria.ifftu.dev](https://alexandria.ifftu.dev)**

> **This branch collects waiting-list signups instead of offering downloads.**
> `feat/site-redesign` is the same site with platform-detected download buttons,
> for when the alpha opens to everyone. The two differ only in what the CTA asks for.

## Stack

- [Nuxt 4.5](https://nuxt.com) (Vue 3) — prerendered to static HTML, no server at runtime
- [Tailwind CSS v4](https://tailwindcss.com) alongside a hand-written token system in `assets/css/main.css`
- TypeScript, strict; `vue-tsc -b --noEmit` must pass
- Self-hosted Newsreader, Public Sans and IBM Plex Mono, Latin subsets only
- Node 22 (see `.nvmrc`)
- Deployed on [Netlify](https://www.netlify.com) — `npm run generate` to `dist/`

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
| **error.vue** | Root-level error page; fires a `404` goal on 404 responses |

`/recruiter` 301s to `/employers` and `/developers` 301s to `/technology`; both redirects
live in `public/_redirects`, which must stay ahead of the catch-all Nitro appends to it.

Every page states what is not built. That is a positioning choice, not placeholder copy —
"Built, shipped, and unproven", "Nobody has hired through this yet" and "No institution has
deployed this yet" are meant to be there.

## Components

| Component | What it is |
| :--- | :--- |
| `AppReplica.vue` | Interactive recreation of the Alexandria desktop shell, built from the app's own tokens and component CSS. Navigates, searches (`/` or `⌘K`), verifies a credential, casts a vote. Collapses to the app's four-tab mobile layout via a container query on the window itself |
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
for all eleven routes. It is worth being exact about what the pair buys, because
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

## Waiting-list signups

The form posts JSON to `/api/early-access` — a Netlify function
(`netlify/functions/early-access.ts`) that forwards to [Plunk](https://www.useplunk.com).
The secret key stays server-side, and the function drops honeypot hits, malformed
addresses and anything outside the role/platform allowlists before it reaches the account.
The route keeps its `/api/early-access` name, and the Plausible goal keeps `EarlyAccess`,
because renaming either would break inbound links and funnel history for nothing a
visitor would notice.

Two calls per signup:

1. `POST /contacts` — upsert the address with the role and platforms below. Plunk answers with `_meta.isNew` at the **top level** of the response: the dashboard endpoints return the resource directly, with no `success`/`data` wrapper. (The public endpoints like `/v1/send` do wrap, which is why the function accepts both shapes.)
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
separate contacts.

### What gets stored, and why it looks like this

```json
{
  "role": "instructor",
  "role_label": "Instructor",
  "platform_macos": true,
  "platform_windows": true,
  "platform_linux": null,
  "platform_ios": null,
  "platform_android": null,
  "platforms": "macOS, Windows",
  "detected_platform": "macos",
  "platform": null
}
```

The shape is dictated by how Plunk filters, not by preference.
`SegmentService.buildJsonFieldCondition` maps `data.<key>` to a JSON path where `equals`
is exact equality and `contains` is Prisma's `string_contains` — a substring match on a
*string*. **An array is therefore unfilterable**: `equals` would need the whole array and
`contains` needs a string. One boolean per platform filters exactly:

| Question | Filter |
| :--- | :--- |
| Instructors | `data.role` `equals` `instructor` |
| Waiting on Windows | `data.platform_windows` `equals` `true` |

Three things worth knowing before changing this:

- **The `null`s are load-bearing.** Plunk *merges* incoming contact data and treats a
  `null` as "delete this key", so unselected platforms are nulled explicitly. Without
  that, someone who picks macOS today and Linux tomorrow stays filed under both forever.
  The retired `platform` key is nulled for the same reason.
- **`detected_platform` avoids the `platform_*` prefix on purpose.** Everything with that
  prefix is a boolean; a string key that looked like one would invite
  `data.platform_detected equals true`, which silently matches nothing.
- **Roles mirror the app**, not the site: `AccountRole` is `learner | instructor | parent`
  (`src/types/index.ts` in the app repo), and the labels come from its onboarding cards.
  Learner is the default because every account is a learner.

Eight DYNAMIC segments exist in Plunk for these — three by role, five by platform — so
targeting a campaign is a selection rather than a filter someone has to rebuild.

### Mail authentication

Set up and verified — `alexandria.ifftu.dev` is a verified SES identity in Plunk (Plunk
sends through Amazon SES), and DNS in Netlify DNS carries:

| Name | Type | Value |
| :--- | :--- | :--- |
| `ifftu.dev` | TXT | `v=spf1 include:_spf.google.com ~all` |
| `alexandria.ifftu.dev` | TXT | `v=spf1 include:_spf.google.com ~all` |
| `_dmarc.ifftu.dev` | TXT | `v=DMARC1; p=none; rua=mailto:admin@ifftu.dev; fo=1` |
| `_dmarc.alexandria.ifftu.dev` | TXT | same as above |

Alongside pre-existing `google._domainkey` TXT records and three `*.dkim.amazonses.com`
DKIM CNAMEs per domain. Confirmed against Gmail: `spf=pass`, `dkim=pass
d=alexandria.ifftu.dev`, `dmarc=pass`.

Four decisions worth keeping:

- **No `include:amazonses.com` in SPF.** It would authorize every SES customer to send as
  the domain. Unnecessary: SES signs with our own DKIM key, so DMARC passes on DKIM
  alignment and SPF alignment is redundant. SES uses its own envelope sender, so SPF is
  evaluated against `eu-north-1.amazonses.com` regardless.
- **One SPF record per name, `~all` not `-all`.** Both names also send Workspace mail
  (`MX → smtp.google.com`), so Google's include has to live in the *same* record — a
  domain publishing two `v=spf1` records has none that validate. Tighten to `-all` only
  after DMARC reports come back clean.
- **DMARC published on the subdomain too, not just the parent.** Org-domain fallback is
  correct per RFC 7489 but depends on the receiver resolving the parent, and a cached
  negative answer means no policy is found at all — which is a DMARC failure on mail that
  is otherwise perfectly signed. An explicit record removes the dependency.
- **`p=none` is monitoring only.** Reports land at `admin@ifftu.dev` daily. Move to
  `p=quarantine` on the evidence in those reports, not on a schedule.

A `200` from `/v1/send` means accepted, not delivered. The confirmation copy lives in
`confirmationBody()` in the function.

### Unsubscribes, and why the launch email must be a campaign

The confirmation body carries `{{unsubscribeUrl}}`. Plunk resolves that itself —
`apps/api/src/jobs/email-processor.ts` runs every message through
`EmailService.format()` with `unsubscribeUrl`, `subscribeUrl` and `manageUrl` in scope
*before* it classifies the send, so the placeholder works on this transactional path and
not only inside campaigns. Verified end to end: the link renders, the hosted page
unsubscribes, and the contact flips to `subscribed: false`.

That link also earns the message a one-click unsubscribe. `buildEmailHeaders` emits the
RFC 8058 `List-Unsubscribe` / `List-Unsubscribe-Post` pair when a send is marketing **or**
when the rendered body links to `/unsubscribe/<contact>`:

```ts
if ((isMarketing || hasListManagementLink) && unsubscribeId) { … }
```

Plunk classifies a send as `marketing` unless the template is `HEADLESS` or the source
type is `TRANSACTIONAL`. Ours is transactional, so without the body link there would be
no pair — which is legitimate (a per-signup confirmation is exempt from the Gmail and
Yahoo bulk-sender rules) but leaves someone who wants out reaching for "report spam"
instead, and a complaint costs sending reputation far more than an unsubscribe costs the
list.

A draft campaign already exists for the launch wave, typed `MARKETING` and using
`{{platforms}}` — not `{{platform}}`, which was retired when the form started asking for
several. A template still interpolating the old key would send a blank or a literal
placeholder.

**Send the launch announcement as a Plunk campaign, not through `/v1/send`.** A campaign
is classified `marketing`, so it gets the header pair, Plunk's hosted unsubscribe footer,
and `Precedence: bulk` / `Auto-Submitted: auto-generated` /
`X-Auto-Response-Suppress: All` so out-of-office replies are suppressed rather than looped
back. Sending that blast transactionally would ship bulk mail with none of it. Note also
that the form upserts with `subscribed: true`, so someone who unsubscribed and later
submits the form again is re-subscribed — that is a fresh opt-in, not a bug, but it is not
a permanent block either.

**The function does not run under `npm run dev`.** Use `netlify dev` to exercise the
whole path locally, or the form will report that it could not reach the list. Note that
`netlify dev` proxies Vite and breaks its HMR websocket, so expect console noise there.

Local runs read `PLUNK_API_KEY` from a `.env` at the repo root. That file is gitignored
and must stay that way: Netlify's secrets scanner fails the build outright — exit code
`2` at the "building site" stage — if it finds the value of one of its own environment
variables committed to the repo, which is the friendlier of the two consequences.

## Responsive checks

`scripts/responsive-audit.mjs` loads every page at eleven widths (320 to 1440) and reports
horizontal overflow, section gutters that disagree with each other, and tap targets under
40px:

```sh
npm run generate
npx serve dist &        # or any static server
node scripts/responsive-audit.mjs http://localhost:3000
```

Two things it deliberately does *not* flag, both learned by getting them wrong first: an
element that a clipping ancestor makes invisible rather than broken (decorative glows sit
outside their box on purpose), and inline links inside running text, which are not tap
targets in the 40px sense and bury the standalone controls that are. It also uses flat
`*.html` paths, because a local static server hands back a directory listing for
`/recruiter` and would silently audit the wrong page.

## Analytics

[Plausible](https://plausible.io) — cookieless, no personal identifiers. Loaded from `nuxt.config.ts` (`app.head.script[]`) with `data-domain="alexandria.ifftu.dev"`. Pageviews, referrers, outbound clicks and file downloads are automatic; custom goals use the `plausible-event-name=<Goal>` class convention:

| Goal | Fired by |
| :--- | :--- |
| `EarlyAccess` | Every trigger that **opens** the waiting-list dialog: the hero and CTA-band buttons, the blog post footer, and the nav, drawer and footer entries |
| `EarlyAccess-Submit` | The waiting-list **`<form>` element** — the **completion**. Kept separate on purpose: the submit once carried `EarlyAccess` too, so a single signup recorded two of them and the goal measured neither opens nor completions. Split, the ratio between the two is a real conversion rate |
| `Nav-Recruiter` / `Nav-Institutions` / `Nav-Learners` | Audience links in the nav, drawer, footer and cross-page links |
| `Nav-Recognition` / `Nav-Technology` | `/why-recognition` and `/technology` |
| `Nav-Verify` / `Nav-Pilots` | `/verify` and `/pilots` |
| `Enquiry` | The `EnquiryForm` **`<form>` element**, on `/pilots`, `/employers`, `/institutions` and `/partners` |
| `CTA-GitHub` | Every "view the source" / "request a demo" / GitHub link |
| `Announcement` | The dismissible banner link |
| `404` | `error.vue`, when `error.statusCode === 404` |

> **Tag a form conversion on the `<form>`, never on the submit button.** Plausible's
> click handler walks up from the clicked element and returns as soon as it meets a
> `form`, so a goal class on a control inside one fires nothing — silently, with no
> error and no entry in the dashboard. Form submissions are read by a separate
> `submit` listener that inspects the form's own classes. `@submit.prevent` is fine:
> it stops the navigation, not the event, which still bubbles to that listener.
> `tests/e2e/plausible.spec.ts` asserts no goal class is buried inside a form.

> **A goal records nothing until it exists in Plausible.** The class only tags the
> event; an unregistered goal is received and discarded, so the funnel looks empty
> rather than broken. `scripts/create-plausible-goals.sh` registers the whole list:
>
> ```sh
> PLAUSIBLE_API_KEY=... ./scripts/create-plausible-goals.sh
> ```
>
> It reads the key from the environment and never prints it. If the Goals API is not
> on your plan it returns 402 — create them under Site Settings → Goals instead.

Goal names are load-bearing — renaming a class silently breaks a funnel that has already collected history.

## Claims, sources and projections

Every figure on the site resolves through `content/evidence.ts`. Pages import from it
rather than typing a number next to the prose that uses it, because a number and its
attribution drift apart the moment they live in different places.

Each figure carries a `status`, which is a **different axis** from `StatusChip`. That
component says how finished a capability is; this says how much weight a number can carry:

| Status | Meaning |
| :--- | :--- |
| `sourced` | Published research, named and dated in `SOURCES` |
| `projection` | Our own model. Never rendered in the same visual register as a sourced figure |
| `internal` | A fact about our own system, checkable in the app repo |

Three corrections were applied to the figures as they arrived in the design brief, all
found by reading the primary sources. They are documented in the `NOTES` block at the
bottom of that file: the Harvard/Burning Glass study is dated February **2024** and
analysed 11,300 **firms** (not 11,000 job postings — which inverts its own finding), and
"two-thirds of Americans hold no four-year degree" overstates a Census figure of 62.3%.

Modeled educator earnings are deliberately absent. A projection shaped like an income
claim, published by a pre-launch company with nobody earning on the platform, is not
something to put in front of people deciding how to spend their time. The 40% revenue
share makes the same argument and is a policy rather than a forecast.

## Deployment

Netlify builds with `npm install && npm run generate` and publishes `dist/`. `netlify.toml` also carries:

- Immutable caching for `/_nuxt/*`, plus `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy`
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

## Getting Started

```sh
npm install
npm run dev          # http://localhost:3000
netlify dev          # also runs the waiting-list function
```

## Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run generate` | Generate the static site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npx vue-tsc -b --noEmit` | Typecheck — CI enforces this |

## License

Copyright © 2025-2026 IFFTU Pvt. Ltd. See [LICENSE](./LICENSE) for terms.

The Alexandria product is owned by Alexandria Pvt. Ltd.; the app's core is MIT-licensed with enterprise modules under the IFFTU Enterprise License, which is what the site footer states.
