#!/usr/bin/env bash
#
# Register the site's custom goals with Plausible.
#
# The `plausible-event-name=<Goal>` class in the markup only tags an event. Until
# the goal exists in the dashboard, Plausible receives it and discards it — so a
# funnel looks empty rather than broken, which is the worst way for this to fail.
#
# Run this yourself; it reads the key from the environment and never prints it.
# Generate a key at https://plausible.io/settings/api-keys
#
#   PLAUSIBLE_API_KEY=... ./scripts/create-plausible-goals.sh
#
# Creating a goal that already exists is a no-op on Plausible's side, so this is
# safe to re-run after adding a new one to the list.

set -euo pipefail

SITE_ID="${PLAUSIBLE_SITE_ID:-alexandria.ifftu.dev}"
API="https://plausible.io/api/v1/sites/goals"

if [[ -z "${PLAUSIBLE_API_KEY:-}" ]]; then
  echo "PLAUSIBLE_API_KEY is not set." >&2
  echo "Generate one at https://plausible.io/settings/api-keys, then:" >&2
  echo "  PLAUSIBLE_API_KEY=... $0" >&2
  exit 1
fi

# Every goal the markup tags. Keep in step with the table in README.md — the
# names are load-bearing, and renaming one silently breaks a funnel that already
# has history.
GOALS=(
  EarlyAccess
  EarlyAccess-Submit
  Enquiry
  Nav-Learners
  Nav-Recruiter
  Nav-Institutions
  Nav-Recognition
  Nav-Technology
  Nav-Verify
  Nav-Pilots
  CTA-GitHub
  Announcement
  404
)

echo "Registering ${#GOALS[@]} goals on ${SITE_ID}"

fail=0
for goal in "${GOALS[@]}"; do
  code=$(curl -sS -o /tmp/plausible-goal.$$ -w '%{http_code}' -X PUT "$API" \
    -H "Authorization: Bearer ${PLAUSIBLE_API_KEY}" \
    -H 'Content-Type: application/json' \
    -d "{\"site_id\":\"${SITE_ID}\",\"goal_type\":\"event\",\"event_name\":\"${goal}\"}")

  case "$code" in
    200|201) printf '  %-18s ok\n' "$goal" ;;
    *)       printf '  %-18s HTTP %s — %s\n' "$goal" "$code" "$(head -c 200 /tmp/plausible-goal.$$)"; fail=1 ;;
  esac
  rm -f /tmp/plausible-goal.$$
done

if [[ $fail -eq 1 ]]; then
  echo
  echo "Some goals failed. A 401 means the key is wrong or lacks scope; a 402 means" >&2
  echo "the Goals API is not on your Plausible plan — create them in the dashboard" >&2
  echo "under Site Settings -> Goals instead." >&2
  exit 1
fi

echo "Done. Verify at https://plausible.io/${SITE_ID}/settings/goals"
