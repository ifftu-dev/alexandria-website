# Waiting list and enquiries (operator runbook)

Status: live
Updated: 2026-10-27

How signups and enquiries reach Plunk, what is stored, how mail is authenticated, and how to send to the list.

## How a signup flows

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

## Configuration

Set these in **Netlify → Site settings → Environment variables**. Both
functions read them.

| Variable | Purpose |
| :--- | :--- |
| `PLUNK_API_KEY` | Secret key (`sk_…`). The public `pk_…` key only works for `/v1/track` and is not enough here |
| `PLUNK_API_BASE` | Optional; defaults to `https://next-api.useplunk.com` |
| `PLUNK_FROM` | Optional sender address; defaults to `admin@alexandria.ifftu.dev`. Must be on a domain verified in the Plunk account |
| `PLUNK_FROM_NAME` | Optional display name; defaults to `Alexandria` |
| `ENQUIRY_TO` | Optional; where enquiry notifications go. Defaults to `admin@ifftu.dev` |

Until the key is set the endpoint answers `503` with a message that blames the
configuration rather than the visitor's address.

Addresses are trimmed and lower-cased before sending, so casing variants do not become
separate contacts.

## Pilot and partner enquiries

`EnquiryForm.vue` posts to `/api/pilot` or `/api/partner`, both served by
`netlify/functions/enquiry.ts`. It is kept apart from the waiting list: every
contact carries `audience` (Plunk segments split on `data.audience`), contacts
are created with `subscribed: false`, and the only mail sent is a notification
to `ENQUIRY_TO`. There is no confirmation email.

## What gets stored, and why it looks like this

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

## Mail authentication

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

## Unsubscribes, and why the launch email must be a campaign

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

## Testing locally

**The functions do not run under `npm run dev`.** Use `netlify dev` to exercise the
whole path locally, or the form will report that it could not reach the list. Note that
`netlify dev` proxies Vite and breaks its HMR websocket, so expect console noise there.

Local runs read `PLUNK_API_KEY` from a `.env` at the repo root. That file is gitignored
and must stay that way: Netlify's secrets scanner fails the build outright — exit code
`2` at the "building site" stage — if it finds the value of one of its own environment
variables committed to the repo, which is the friendlier of the two consequences.
