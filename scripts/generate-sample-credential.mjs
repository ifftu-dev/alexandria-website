/**
 * Mint the sample credential /verify offers.
 *
 *     node scripts/generate-sample-credential.mjs
 *
 * Signs a real credential with a real Ed25519 key, using the scheme the app
 * uses (`src-tauri/src/domain/vc/sign.rs`): JCS-canonicalize the envelope with
 * `proof.jws` emptied, sign `protectedHeader . canonicalBytes`, store the result
 * as a detached JWS. The issuer DID is derived from the public key, so it is
 * self-resolving.
 *
 * The private key is generated fresh each run and thrown away — it exists only
 * long enough to sign, and nothing else is ever issued under it. That matters:
 * a sample credential has to be genuinely signed or the verifier on /verify
 * would be demonstrating nothing, but it must not look like a key the project
 * actually uses to issue credentials to people.
 */
import { writeFileSync } from 'node:fs'
import { getPublicKeyAsync, signAsync, utils } from '@noble/ed25519'
import { canonicalize } from '../utils/credential.ts'

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function base58Encode(bytes) {
  const digits = [0]
  for (const byte of bytes) {
    let carry = byte
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] << 8
      digits[i] = carry % 58
      carry = (carry / 58) | 0
    }
    while (carry > 0) {
      digits.push(carry % 58)
      carry = (carry / 58) | 0
    }
  }
  let out = ''
  for (const byte of bytes) {
    if (byte !== 0) break
    out += '1'
  }
  return out + digits.reverse().map(d => B58[d]).join('')
}

const b64url = bytes =>
  Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const privateKey = utils.randomSecretKey()
const publicKey = await getPublicKeyAsync(privateKey)

// did:key = multibase(base58btc, multicodec(0xed01) || publicKey)
const prefixed = new Uint8Array(2 + publicKey.length)
prefixed.set([0xed, 0x01])
prefixed.set(publicKey, 2)
const issuerDid = `did:key:z${base58Encode(prefixed)}`

// A learner's own DID would be a different key; for a sample, a fixed string
// that is obviously a placeholder is more honest than minting a second key and
// implying a person.
const subjectDid = 'did:key:z6MkjSampleLearnerSubjectDidForDemonstration'

const credential = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://alexandria.ifftu.dev/credentials/v1',
  ],
  'id': 'urn:uuid:5f1d7e6c-2a44-4d6e-9f1c-8a3b2c4d5e6f',
  'type': ['VerifiableCredential', 'AssessmentCredential'],
  'issuer': issuerDid,
  'validFrom': '2026-06-02T09:41:00Z',
  'credentialSubject': {
    id: subjectDid,
    skill: 'welding.pipe.6g',
    level: 'Apply',
    evidence: 'Proctored assessment, 42 minutes, scored on device',
    assessedAt: '2026-06-02T09:38:00Z',
  },
  'proof': {
    type: 'Ed25519Signature2020',
    created: '2026-06-02T09:41:00Z',
    verificationMethod: `${issuerDid}#key-1`,
    proofPurpose: 'assertionMethod',
    jws: '',
  },
}

const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'EdDSA', b64: false, crit: ['b64'] })))
const canonicalBytes = new TextEncoder().encode(canonicalize(credential))
const signingInput = new Uint8Array(header.length + 1 + canonicalBytes.length)
signingInput.set(new TextEncoder().encode(`${header}.`))
signingInput.set(canonicalBytes, header.length + 1)

const signature = await signAsync(signingInput, privateKey)
credential.proof.jws = `${header}..${b64url(signature)}`

writeFileSync('public/sample-credential.json', `${JSON.stringify(credential, null, 2)}\n`)
console.log(`  public/sample-credential.json written`)
console.log(`  issuer ${issuerDid}`)
