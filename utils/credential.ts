/**
 * Verify an Alexandria credential in the browser.
 *
 * The credential is a W3C Verifiable Credential (Data Model 2.0) secured with
 * a Data Integrity proof, cryptosuite `eddsa-jcs-2022`. This page implements
 * that suite as the specification states it, not an approximation of it, so a
 * credential exported from the app verifies here and a tampered one does not:
 *
 *   1. JCS-canonicalize (RFC 8785) the credential without its `proof`, and the
 *      proof options without `proofValue` plus the credential's `@context`.
 *   2. hashData = SHA-256(canonical proof options) || SHA-256(canonical document).
 *   3. `proofValue` is multibase base58btc of the Ed25519 signature over
 *      hashData. Verify it against the public key carried inside the issuer's
 *      `did:key`, which is self-resolving — no network, no key server.
 *
 * Everything happens on the page. Nothing is uploaded; there is nowhere to
 * upload it to.
 *
 * Revocation: when the credential names its status list by an https URL, this
 * page fetches it — one plain GET — and reads the bit, after checking that what
 * came back is that list, signed by that issuer. A list named by a URN lives
 * only in the issuer's exported bundle, which this page does not have, and is
 * reported as "not checked here" rather than silently passed. The on-chain
 * anchor is a Cardano query and is likewise reported, not assumed.
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

function textBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s)
}

async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))
}

/** The 64 bytes an `eddsa-jcs-2022` proof signs. */
export async function hashData(credential: Record<string, unknown>): Promise<Uint8Array> {
  const { proof, ...document } = credential
  const { proofValue: _omitted, ...options } = proof as Record<string, unknown>
  const config = { ...options, '@context': credential['@context'] }
  const left = await sha256(textBytes(canonicalize(config)))
  const right = await sha256(textBytes(canonicalize(document)))
  const out = new Uint8Array(64)
  out.set(left)
  out.set(right, 32)
  return out
}

export interface VerifyOptions {
  /** Replaced in tests; the page uses the browser's `fetch`. */
  fetch?: typeof fetch
}

/** A status list reference a verifier can fetch: https, or http on loopback. */
export function isListUrl(reference: unknown): reference is string {
  if (typeof reference !== 'string') return false
  try {
    const url = new URL(reference)
    const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
    return url.protocol === 'https:' || (url.protocol === 'http:' && loopback)
  }
  catch {
    return false
  }
}

/** `encodedList` → bitstring: multibase base64url (`u`) of GZIP bytes. */
export async function decodeEncodedList(encoded: unknown): Promise<Uint8Array> {
  if (typeof encoded !== 'string' || !encoded.startsWith('u')) throw new Error('encodedList is not multibase base64url')
  const b64 = encoded.slice(1).replace(/-/g, '+').replace(/_/g, '/')
  const compressed = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer())
  if (bytes.length > 1 << 20) throw new Error('status list is larger than 1 MiB')
  return bytes
}

/**
 * Fetch the list a credential names and read its bit. The fetched document
 * must be a `BitstringStatusListCredential` whose `id` is the URL, whose
 * issuer is the credential's issuer and whose own proof verifies — otherwise
 * it is somebody else's list and the credential stays unchecked.
 */
async function checkRevocation(
  vc: Record<string, any>,
  issuer: string,
  options: VerifyOptions,
): Promise<Pick<VerifyCheck, 'state' | 'detail'>> {
  const status = vc.credentialStatus as Record<string, any> | undefined
  if (!status) return { state: 'skip', detail: 'No status list on this credential' }
  const reference = status.statusListCredential
  if (!isListUrl(reference)) {
    return { state: 'skip', detail: 'This credential names a status list by URN; it travels in the issuer’s exported bundle, which this page does not have' }
  }
  try {
    const doFetch = options.fetch ?? fetch
    const response = await doFetch(reference, { headers: { accept: 'application/vc, application/json' }, redirect: 'error' })
    if (!response.ok) throw new Error(`the host answered ${response.status}`)
    const list = await response.json() as Record<string, any>
    if (list.id !== reference) throw new Error('the document is not the list the credential named')
    if (list.issuer !== issuer) throw new Error('the list is not issued by the credential issuer')
    if (!(list.type ?? []).includes('BitstringStatusListCredential')) throw new Error('not a BitstringStatusListCredential')
    const subject = list.credentialSubject ?? {}
    if (subject.type !== 'BitstringStatusList' || subject.statusPurpose !== status.statusPurpose) {
      throw new Error('the list is not a status list for this purpose')
    }
    const signed = await verifyCredential(list, { fetch: async () => { throw new Error('a status list does not fetch further lists') } })
    if (!signed.checks.some(c => c.id === 'signature' && c.state === 'pass')) throw new Error('the list’s own signature does not verify')
    const bits = await decodeEncodedList(subject.encodedList)
    const index = Number.parseInt(String(status.statusListIndex), 10)
    if (!Number.isInteger(index) || index < 0 || index >= bits.length * 8) throw new Error('statusListIndex is out of range')
    const set = ((bits[index >> 3]! >> (7 - (index & 7))) & 1) === 1
    return set
      ? { state: 'fail', detail: `Revoked — bit ${index} is set in the issuer’s published list (${reference})` }
      : { state: 'pass', detail: `Not revoked — bit ${index} is clear in the issuer’s published list, fetched from ${reference}` }
  }
  catch (error) {
    return { state: 'skip', detail: `Status list not checked: ${error instanceof Error ? error.message : String(error)}` }
  }
}

/** Verify a parsed credential object. */
export async function verifyCredential(credential: unknown, options: VerifyOptions = {}): Promise<VerifyOutcome> {
  const checks: VerifyCheck[] = []
  const fail = (error: string): VerifyOutcome => ({ valid: false, checks, error })

  if (typeof credential !== 'object' || credential === null) {
    return fail('That is not a JSON object.')
  }
  const vc = credential as Record<string, any>

  // ---- shape -------------------------------------------------------------
  const issuer: unknown = vc.issuer
  const proof = vc.proof as Record<string, any> | undefined
  if (typeof issuer !== 'string' || !proof || typeof proof.proofValue !== 'string') {
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
  if (proof.type !== 'DataIntegrityProof' || proof.cryptosuite !== 'eddsa-jcs-2022') {
    checks.push({
      id: 'signature',
      label: 'Signature',
      state: 'fail',
      detail: `proof is ${proof.type ?? 'untyped'} / ${proof.cryptosuite ?? 'no cryptosuite'}; this page checks Data Integrity eddsa-jcs-2022`,
    })
    return { valid: false, checks, error: 'The proof is not in the expected form.' }
  }
  const [controller, fragment] = String(proof.verificationMethod ?? '').split('#')
  if (controller !== issuer || !fragment) {
    checks.push({
      id: 'signature',
      label: 'Signature',
      state: 'fail',
      detail: 'proof.verificationMethod is not a key the issuer controls',
    })
    return { valid: false, checks, error: 'The proof names a key the issuer does not control.' }
  }

  let signatureValid = false
  try {
    if (!proof.proofValue.startsWith('z')) throw new Error('proofValue is not multibase base58btc')
    const signature = base58Decode(proof.proofValue.slice(1))
    if (signature.length !== 64) throw new Error('not an Ed25519 signature')
    // The issuer signed the two hashes of the credential as it was before the
    // signature existed: the proof options without their value, and the
    // document without its proof.
    signatureValid = await verifyAsync(signature, await hashData(vc), publicKey)
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

  // ---- revocation --------------------------------------------------------
  const revocation = await checkRevocation(vc, issuer, options)
  checks.push({ id: 'revocation', label: 'Revocation', ...revocation })

  // ---- what this page honestly cannot check ------------------------------
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

  const revoked = checks.some(c => c.id === 'revocation' && c.state === 'fail')
  return { valid: signatureValid && inWindow && !revoked, checks, issuer, subject, claim }
}
