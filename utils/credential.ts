/**
 * Verify an Alexandria credential in the browser.
 *
 * This is a reimplementation of the app's own check
 * (`src-tauri/src/domain/vc/verify.rs`), not an approximation of it, so a
 * credential exported from the app verifies here and a tampered one does not:
 *
 *   1. Canonicalize the envelope with `proof.jws` emptied — JCS, RFC 8785.
 *   2. Signing input is `protectedHeader . canonicalBytes` (detached JWS: the
 *      middle segment of `header..signature` is empty).
 *   3. Verify Ed25519 against the public key carried inside the issuer's
 *      `did:key`, which is self-resolving — no network, no key server.
 *
 * Everything happens on the page. Nothing is uploaded; there is nowhere to
 * upload it to.
 *
 * What this does NOT do, and the UI must not imply otherwise: revocation is a
 * status-list lookup the app performs against its own store, and the on-chain
 * anchor is a Cardano query. Both need data this page does not have, so both are
 * reported as "not checked here" rather than silently passed.
 */
import { verifyAsync } from '@noble/ed25519'

export interface VerifyCheck {
  id: string
  label: string
  state: 'pass' | 'fail' | 'skip'
  detail: string
}

export interface VerifyOutcome {
  valid: boolean
  checks: VerifyCheck[]
  issuer?: string
  subject?: string
  claim?: string
  error?: string
}

/**
 * JCS canonicalization (RFC 8785).
 *
 * Object keys sort by UTF-16 code unit, which is what JavaScript's default
 * string comparison already does. Numbers go through `JSON.stringify`, whose
 * output is ECMA-262 `Number::toString` — the same production RFC 8785 cites.
 * Both sides therefore agree on the bytes without a JSON library.
 */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new Error('cannot canonicalize a non-finite number')
    }
    return JSON.stringify(value)
  }
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(',')}}`
  }
  throw new Error(`cannot canonicalize ${typeof value}`)
}

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

/** base58btc decode — the multibase `z` alphabet, as used by did:key. */
function base58Decode(input: string): Uint8Array {
  const bytes: number[] = [0]
  for (const ch of input) {
    const value = B58.indexOf(ch)
    if (value === -1) throw new Error(`invalid base58 character "${ch}"`)
    let carry = value
    for (let i = 0; i < bytes.length; i++) {
      carry += bytes[i]! * 58
      bytes[i] = carry & 0xff
      carry >>= 8
    }
    while (carry > 0) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  }
  // Leading '1's are leading zero bytes.
  for (const ch of input) {
    if (ch !== '1') break
    bytes.push(0)
  }
  return new Uint8Array(bytes.reverse())
}

/**
 * Pull the Ed25519 public key out of a `did:key`. The multicodec prefix
 * `0xed 0x01` is what makes it an Ed25519 key rather than some other curve;
 * rejecting anything else keeps this from "verifying" a key it cannot check.
 */
export function publicKeyFromDidKey(did: string): Uint8Array {
  if (!did.startsWith('did:key:z')) throw new Error('not a did:key')
  const decoded = base58Decode(did.slice('did:key:'.length + 1))
  if (decoded.length !== 34 || decoded[0] !== 0xed || decoded[1] !== 0x01) {
    throw new Error('did:key does not carry an Ed25519 public key')
  }
  return decoded.slice(2)
}

function b64urlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  return Uint8Array.from(binary, c => c.charCodeAt(0))
}

function textBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s)
}

/** Verify a parsed credential object. */
export async function verifyCredential(credential: unknown): Promise<VerifyOutcome> {
  const checks: VerifyCheck[] = []
  const fail = (error: string): VerifyOutcome => ({ valid: false, checks, error })

  if (typeof credential !== 'object' || credential === null) {
    return fail('That is not a JSON object.')
  }
  const vc = credential as Record<string, any>

  // ---- shape -------------------------------------------------------------
  const issuer: unknown = vc.issuer
  const proof = vc.proof as Record<string, any> | undefined
  if (typeof issuer !== 'string' || !proof || typeof proof.jws !== 'string') {
    return fail('Missing an issuer or a proof — this does not look like a credential.')
  }
  checks.push({
    id: 'shape',
    label: 'Credential envelope',
    state: 'pass',
    detail: `${(vc.type ?? []).join(', ') || 'VerifiableCredential'}`,
  })

  // ---- issuer key --------------------------------------------------------
  let publicKey: Uint8Array
  try {
    publicKey = publicKeyFromDidKey(issuer)
    checks.push({
      id: 'issuer',
      label: 'Issuer key',
      state: 'pass',
      detail: 'Ed25519 public key read from the issuer’s did:key — no lookup needed',
    })
  }
  catch (error) {
    checks.push({
      id: 'issuer',
      label: 'Issuer key',
      state: 'fail',
      detail: error instanceof Error ? error.message : 'unreadable issuer',
    })
    return { valid: false, checks, error: 'The issuer DID could not be read.' }
  }

  // ---- signature ---------------------------------------------------------
  const segments = proof.jws.split('.')
  if (segments.length !== 3 || segments[1] !== '') {
    checks.push({
      id: 'signature',
      label: 'Signature',
      state: 'fail',
      detail: 'proof.jws is not a detached JWS (expected header..signature)',
    })
    return { valid: false, checks, error: 'The proof is not in the expected form.' }
  }

  let signatureValid = false
  try {
    const signature = b64urlDecode(segments[2]!)
    // Canonical bytes are computed over the envelope with the signature
    // removed — the issuer signed the credential as it was before the
    // signature existed.
    const unsigned = { ...vc, proof: { ...proof, jws: '' } }
    const canonicalBytes = textBytes(canonicalize(unsigned))
    const header = textBytes(`${segments[0]}.`)
    const signingInput = new Uint8Array(header.length + canonicalBytes.length)
    signingInput.set(header)
    signingInput.set(canonicalBytes, header.length)
    signatureValid = await verifyAsync(signature, signingInput, publicKey)
  }
  catch {
    signatureValid = false
  }

  checks.push({
    id: 'signature',
    label: 'Signature',
    state: signatureValid ? 'pass' : 'fail',
    detail: signatureValid
      ? 'Ed25519 signature matches the credential exactly as issued'
      : 'The signature does not match — the credential has been altered, or was signed by a different key',
  })

  // ---- validity window ---------------------------------------------------
  const now = new Date()
  const validFrom = vc.validFrom ? new Date(vc.validFrom) : null
  const validUntil = vc.validUntil ? new Date(vc.validUntil) : null
  const inWindow = (!validFrom || validFrom <= now) && (!validUntil || validUntil >= now)
  checks.push({
    id: 'window',
    label: 'Validity period',
    state: inWindow ? 'pass' : 'fail',
    detail: validUntil
      ? `valid ${vc.validFrom ?? '—'} to ${vc.validUntil}`
      : `valid from ${vc.validFrom ?? '—'}, no expiry`,
  })

  // ---- what this page honestly cannot check ------------------------------
  checks.push({
    id: 'revocation',
    label: 'Revocation',
    state: 'skip',
    detail: vc.credentialStatus
      ? 'This credential names a status list; checking it needs the issuer’s list, which this page does not fetch'
      : 'No status list on this credential',
  })
  checks.push({
    id: 'anchor',
    label: 'Chain anchor',
    state: 'skip',
    detail: vc.witness
      ? 'An on-chain witness is present; confirming it needs a Cardano query'
      : 'Not anchored — the signature stands on its own either way',
  })

  const subject = typeof vc.credentialSubject?.id === 'string' ? vc.credentialSubject.id : undefined
  const claimKeys = Object.keys(vc.credentialSubject ?? {}).filter(k => k !== 'id')
  const claim = claimKeys.length
    ? claimKeys.map(k => `${k}: ${JSON.stringify(vc.credentialSubject[k])}`).join(' · ')
    : undefined

  return { valid: signatureValid && inWindow, checks, issuer, subject, claim }
}
