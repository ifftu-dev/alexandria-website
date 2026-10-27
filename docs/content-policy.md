# Content policy: claims, sources and projections

Status: live
Updated: 2026-10-27

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
