# Copy review: typos, consistency and stale claims

Status: active
Updated: 2026-11-03
Triage: ready-for-agent
Repos: website

## Problem Statement

The IFFTU site has no tracker of its own; its share of this pass is covered here too.


A visitor reading the Alexandria website meets typos, grammar slips and a mix of spelling
conventions on the same page. Worse, several pages contradict each other or the app: the app
renamed Opinions to Discussions and the site did not follow; the privacy page says the site
loads nothing from another origin while it loads Plausible; the trust page reports a February
security review as current when two more passes ran in August; and the search palette, which
calls itself "Search this site", cannot find the privacy, trust or partners pages and tells
anyone who joined the waiting list that we hold no data about them. The IFFTU site still
advertises Alexandria as classified and unreleased. For a site whose whole pitch is "nothing
here asks to be taken on faith", each of these is a small breach of that promise.

## Solution

One pass over every piece of visible copy on both sites (pages, layout, components, the app
replica, the command palette, form messages, the confirmation email, metadata and structured
data) that:

- fixes outright typos and grammar;
- applies one house style per site (below) everywhere;
- removes claims that are false or out of date, and reconciles pages that contradict each
  other or the app;
- lets the search palette reach every page and stops its jokes asserting false things.

House style for the Alexandria website, chosen to match the majority of existing copy and the
app's own labels:

| Choice | Rule |
| --- | --- |
| Spelling | American (license, canonicalization, rigor, enroll, percent) |
| Apostrophes and quotes in prose | Curly |
| Serial comma | None in site copy; the long-form blog post keeps its own consistent style |
| Sign-up list | "waiting list", never "waitlist" |
| Organization contact | "inquiry", not "enquiry", in anything a visitor reads |
| The public map of skills | "skill graph", as the app labels it |
| Discussion feature | "Discussions", as the app labels it |
| Dates | Month day, year |

The IFFTU site keeps its existing American spelling and serial comma, and hyphenates
"open-source" when it modifies a noun.

## User Stories

1. As a visitor, I want the copy free of typos, so that I take the project seriously.
2. As a visitor, I want one spelling convention per site, so that the copy reads as written by one hand.
3. As a visitor, I want the same thing called by the same name on every page, so that I do not wonder whether "skill map" and "skill graph" are two features.
4. As a visitor, I want feature names on the site to match the names in the app, so that what I read is what I find after installing.
5. As a visitor looking at the app replica, I want it to show the app's current labels, so that the caption "the app's actual layout" is true.
6. As a visitor, I want the privacy policy to disclose every third party the site loads, so that I can trust the rest of it.
7. As a visitor, I want the privacy and trust pages to agree about analytics, so that I do not have to decide which one is wrong.
8. As a security researcher, I want one reporting address across Alexandria and IFFTU, so that my report reaches the right inbox.
9. As a security-minded evaluator, I want the trust page to describe the latest security reviews with their dates, so that I can judge the current posture rather than a historical one.
10. As an evaluator, I want the technology page's security paragraph to agree with the trust page, so that the two pages do not contradict each other.
11. As a visitor using the search palette, I want every page reachable from it, so that "Search this site" is true.
12. As a visitor using the search palette, I want each command named the way the rest of the site names it, so that typing "verify" finds the verifier.
13. As someone on the waiting list, I want the "Delete all my data" joke not to claim the site holds nothing about me, so that the joke is not a false privacy statement.
14. As a visitor, I want the roadmap joke to reflect that the alpha already exists, so that the palette agrees with the home page.
15. As a phone user, I want the palette footer to start with a capital letter once the key hints are hidden, so that it does not read as a typo.
16. As a learner, I want the learners page heading to say what actually happened to degree requirements, so that it agrees with the evidence page.
17. As a reader of the evidence, I want statistics labelled with their real basis (adults aged 25 and over; candidates registered rather than sat), so that the numbers mean what they say.
18. As a reader, I want sentences whose pronouns have clear referents, so that "where it did take hold" does not leave me guessing what "it" is.
19. As a reader of the technology page, I want Bloom's levels named as Bloom names them, so that "recall" does not stand in for "remember".
20. As a reader, I want the sign-up form, the modal, the email and the palette to call the list the same thing, so that I know I am on one list.
21. As an employer or institution filling the inquiry form, I want size ranges that do not overlap, so that I can pick one honestly.
22. As an inquirer, I want the confirmation copy to make sense for partners as well as pilots, so that it does not talk about a pilot I did not ask for.
23. As a search engine, I want breadcrumb names that use the post's real title, so that the product name is not lower-cased in results.
24. As a reader of the announcement post, I want its typos and broken sentences fixed, so that the first thing many people read about the project is clean.
25. As a visitor to the IFFTU site, I want the blog page not to call Alexandria classified and unbuilt, so that it agrees with the projects page.
26. As a visitor to the IFFTU site, I want the projects page to use the app's current feature names, so that it matches Alexandria.
27. As a reader of the IFFTU manifesto post, I want an honest read time, so that "8 MIN" does not oversell a two-minute read.
28. As a maintainer, I want the house-style rules checked in CI, so that the next copy change cannot quietly reintroduce what this pass removed.

## Implementation Decisions

- Copy changes are edits in place. No component, route or data structure is renamed: code identifiers (`EnquiryForm`, the `organisation` payload field, the `#enquiry` anchor, Plunk segment names) stay as they are, because renaming them changes URLs, analytics and stored data for no reader benefit. Only text a visitor or crawler reads changes.
- The search palette gains commands for the partners, trust and privacy pages, named as the footer names them. The verifier command takes the nav's name, "Verify a credential"; the palette's other, deliberately conversational command names stay.
- The "Delete all my data" answer distinguishes learning data (never held) from a waiting-list address or inquiry (held, deletable by email).
- Breadcrumbs under the blog use the post's title instead of title-casing its slug. All other routes keep the slug-derived name.
- The privacy page lists Plausible as the one third-party origin the site loads, consistent with the trust page and the site's own configuration, and its "last updated" date moves to the date of this change.
- The trust page summarizes the security reviews from the app repository's audit records: a February review, a monorepo-wide August review whose findings were all fixed or accepted in writing, and a later August pass that left a few items open and written down. The technology page's security paragraph points to the same facts.
- Security reports on both sites go to the dedicated security address the IFFTU site already publishes.
- Where two pieces of copy contradict each other (the replica's mic state, the announcement's design-system claim, a footer column headed "For"), the inaccurate one changes.
- Figures stay in the shared evidence module, and prose that states one renders it from there; corrected labels are made there so every page that renders them changes together.
- The announcement post is a dated document. Typos, grammar and the author contact address are corrected; claims that were accurate on its publication date are left as written.

## Testing Decisions

- Copy is tested at one seam: the existing source-level copy test that already guards the license and verifier wording. It reads source files and asserts on the text a visitor sees, which is the external behavior of a static site.
- New tests in that file assert: none of the retired spellings and terms appear in visible copy (with code comments stripped and code identifiers excluded by matching visible-text shapes rather than bare words); the privacy page names Plausible and no longer claims to load nothing from another origin; and the search palette has a command for every top-level page in the pages directory.
- The shared security address spans two repositories, so no test in either can see both; it is a one-line change checked by review.
- A good test here names a rule a future editor could break, not a specific sentence. "Every page is reachable from the palette" survives a page being added; "the palette contains these ten strings" would not.
- The breadcrumb change is checked against the generated HTML of the announcement post after a static build, because the composable only runs inside Nuxt.
- Typecheck and the production build run as in CI. The IFFTU site is checked by its own build.

## Out of Scope

- Visual or layout changes, and any rewrite beyond correcting what is wrong or inconsistent.
- Renaming code identifiers, routes, anchors, payload fields or analytics goals.
- Rewriting historical claims in the dated announcement post, including its account of credential issuance and its security-audit figures.
- The accent-color decision and other open design questions.
- Legal review of the privacy policy.

## Further Notes

- The dedicated security mailbox is published on the IFFTU site already; delivery to it should be confirmed by a person before this ships.
