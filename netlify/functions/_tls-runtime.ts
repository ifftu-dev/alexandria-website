import { versions } from 'node:process'

export function hasPatchedTlsRuntime(version: string): boolean {
  if (!/^\d+\.\d+\.\d+$/.test(version)) return false
  const [major, minor, patch] = version.split('.').map(Number)
  const minimum: Record<number, readonly [number, number]> = {
    22: [23, 4],
    24: [22, 1],
    26: [12, 1],
  }
  const required = major === undefined ? undefined : minimum[major]
  return required !== undefined && minor !== undefined && patch !== undefined
    && (minor > required[0] || (minor === required[0] && patch >= required[1]))
}

export function insecureTlsRuntimeResponse(): Response | undefined {
  if (hasPatchedTlsRuntime(versions.node)) return undefined
  console.error('Outbound HTTPS disabled: Node needs the CVE-2026-111943 fix', versions.node)
  return new Response(JSON.stringify({
    ok: false,
    error: 'This service is temporarily unavailable. Please try again later.',
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}
