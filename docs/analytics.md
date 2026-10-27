# Analytics

Status: live
Updated: 2026-10-27

[Plausible](https://plausible.io) — cookieless, no personal identifiers. Loaded from `nuxt.config.ts` (`app.head.script[]`) with `data-domain="alexandria.ifftu.dev"`. Pageviews, referrers, outbound clicks and file downloads are automatic; custom goals use the `plausible-event-name=<Goal>` class convention:

| Goal | Fired by |
| :--- | :--- |
| `EarlyAccess` | Every trigger that **opens** the waiting-list dialog: the hero and CTA-band buttons, the blog post footer, and the nav, drawer and footer entries |
| `EarlyAccess-Submit` | The waiting-list **`<form>` element** — the **completion**. Kept separate on purpose: the submit once carried `EarlyAccess` too, so a single signup recorded two of them and the goal measured neither opens nor completions. Split, the ratio between the two is a real conversion rate |
| `Nav-Recruiter` / `Nav-Institutions` / `Nav-Learners` | Audience links in the nav, drawer, footer and cross-page links |
| `Nav-Recognition` / `Nav-Technology` | `/why-recognition` and `/technology` |
| `Nav-Verify` / `Nav-Pilots` | `/verify` and `/pilots` |
| `Nav-Blog` | Blog links. **Not registered** by `create-plausible-goals.sh` yet, so it records nothing until it is added there or in Plausible |
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
