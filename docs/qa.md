# QA: responsive checks

Status: live
Updated: 2026-10-27

Layout checks to run before shipping a page change.

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
