/**
 * Every statistic on the site, with its source, resolved in one place.
 *
 * The rule the redesign brief sets is that no figure appears without an
 * attribution and no projection renders as a fact. That rule only holds if
 * there is a single list to check, so pages import from here rather than
 * inlining numbers next to prose where a later edit can quietly separate the
 * two.
 *
 * `status` is deliberately not the same axis as `StatusChip`. That component
 * says how finished a capability is; this says how much weight a number can
 * carry:
 *
 *   `sourced`     published research, named and dated below
 *   `projection`  our own model — never to be shown without saying so
 *   `internal`    a fact about our own system, checkable in the repo
 *
 * Verified 31 July 2026 against the primary sources. Two figures in the design
 * handoff did not survive that check and are corrected here — see NOTES.
 */

export interface Source {
  id: string
  /** How the citation reads under a stat band. */
  line: string
  url: string
}

export interface Figure {
  id: string
  value: string
  label: string
  status: 'sourced' | 'projection' | 'internal'
  source?: string
  /** Shown where the figure needs its base stated to be honest. */
  basis?: string
}

export const SOURCES: Record<string, Source> = {
  bgi2024: {
    id: 'bgi2024',
    line: 'Harvard Business School Managing the Future of Work with the Burning Glass Institute, February 2024 — 11,300 large US firms, 2014–2023.',
    url: 'https://www.burningglassinstitute.org/research/skills-based-hiring-2024',
  },
  census2022: {
    id: 'census2022',
    line: 'US Census Bureau, educational attainment, 2022.',
    url: 'https://www.census.gov/topics/education/educational-attainment.html',
  },
  nta2025: {
    id: 'nta2025',
    line: 'National Testing Agency, India, 2025 — NEET-UG and JEE Main registrations.',
    url: 'https://www.nta.ac.in/',
  },
}

/**
 * The stat band under the hero. Three of these are the same study, which is
 * worth knowing: it is one piece of research, not four converging ones.
 */
export const RECOGNITION_GAP: Figure[] = [
  {
    id: 'no-degree',
    value: '62%',
    label: 'of American adults hold no bachelor’s degree',
    status: 'sourced',
    source: 'census2022',
    basis: 'Aged 25 and over. 37.7% hold a bachelor’s or higher.',
  },
  {
    id: 'one-in-700',
    value: 'Fewer than 1 in 700',
    label: 'new hires actually benefited when employers dropped degree requirements',
    status: 'sourced',
    source: 'bgi2024',
    basis: 'About 97,000 workers out of 77 million hires in 2023.',
  },
  {
    id: 'pay',
    value: '+25%',
    label: 'average salary increase for workers hired without a degree, where it did take hold',
    status: 'sourced',
    source: 'bgi2024',
  },
  {
    id: 'retention',
    value: '+10 pts',
    label: 'higher retention than colleagues who held degrees',
    status: 'sourced',
    source: 'bgi2024',
  },
]

/**
 * What we are aiming at. Every one of these is our own model, and the page must
 * never render them in the same visual register as the sourced figures above.
 *
 * The handoff also carried `$58K median educator earnings`, `$199K top` and
 * `622 educators earning $12,000+`. Those are income representations, which are
 * a regulated category in several jurisdictions and a liability in all of them
 * when published pre-launch by a company with no educators on the platform. The
 * revenue share replaces them: it makes the same argument, it is a policy rather
 * than a forecast, and it can be checked against the licence and the payouts.
 */
export const TARGETS: Figure[] = [
  { id: 'learners', value: '6M', label: 'learners, at no cost to any of them', status: 'projection' },
  { id: 'credentials', value: '1.9M', label: 'credentials issued per year', status: 'projection' },
  { id: 'share', value: '40%', label: 'of earned revenue goes to the educators who create the skills', status: 'internal' },
  { id: 'costs', value: '96%', label: 'of costs met by earned revenue, never by learners', status: 'projection' },
]

/** Model provenance, shown wherever TARGETS appear. */
export const MODEL_NOTE
  = 'Alexandria’s own bottom-up model, July 2026, base case — built from unit '
    + 'drivers rather than market share. Nobody is on the platform yet, so these '
    + 'are objectives we expect to be held to, not results.'

/**
 * NOTES — corrections applied to the figures in the design handoff.
 *
 * 1. The handoff dated the Harvard/Burning Glass work February 2025 and
 *    described its sample as "11,000+ US job postings". Both are wrong: the
 *    report is dated 12 February 2024 (the published PDF is
 *    `Skills-Based-Hiring-02122024-vF-srmp.pdf`) and it analysed 11,300 large
 *    firms. Postings and firms are not interchangeable — the study's whole
 *    point is that postings changed and hiring did not, so citing postings
 *    inverts the finding.
 *
 * 2. "2 in 3 Americans hold no four-year degree" overstates. The Census figure
 *    is 37.7% holding a bachelor's or higher among those aged 25 and over,
 *    which leaves 62.3% — closer to three in five than two in three. Stated
 *    here as 62% with the base named, because an evidence page that rounds in
 *    its own favour forfeits the argument it is making.
 *
 * 3. India's National Testing Agency figure ("3.8M") is sound, but only with
 *    its base attached: NEET-UG 22.76 lakh registered plus JEE Main 15.4 lakh
 *    across two sessions, for 2025. Without naming those two examinations the
 *    number is ambiguous — the full NTA slate including CUET is considerably
 *    larger. Wherever it appears, it names them.
 */
export const NTA_2025: Figure = {
  id: 'nta',
  value: '3.8M',
  label: 'candidates sat NEET-UG and JEE Main in 2025',
  status: 'sourced',
  source: 'nta2025',
  basis: 'NEET-UG 22.76 lakh registered; JEE Main 15.4 lakh across two sessions.',
}
