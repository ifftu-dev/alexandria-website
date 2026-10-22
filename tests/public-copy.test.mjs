import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('website and email distinguish the application and verifier licenses', () => {
  for (const path of ['layouts/landing.vue', 'netlify/email/confirmation.ts', 'README.md']) {
    const source = read(path)
    assert.match(source, /GNU AGPL v3 or later/)
    assert.match(source, /MIT OR Apache-2\.0/)
    assert.doesNotMatch(source, /MIT-licensed core|Core released under the MIT License|IFFTU Enterprise License/)
  }
  assert.match(read('README.md'), /This website repository is MIT-licensed/)
  assert.doesNotMatch(read('layouts/landing.vue'), /License \(open-core\)/)
})

test('verifier discloses status requests before the Verify action', () => {
  const source = read('pages/verify.vue')
  assert.doesNotMatch(source, /nothing sent anywhere|does not fetch the issuer's revocation list|Both need data a static page cannot have/)
  assert.match(source, /host may receive your IP address and the requested URL/)
  assert.match(source, /Browser or site security policies may block the request/)
  assert.ok(source.indexOf('class="v-note v-privacy"') < source.indexOf('@click="run"'))
  assert.match(source, /Revocation checks may request the issuer/)
  assert.match(source, /status-list checks may make network requests/)
})

test('verifier separates signatures, unresolved status, anchors and trust', () => {
  const source = read('pages/verify.vue')
  assert.match(source, /An unchecked revocation status is not proof that/)
  assert.match(source, /A valid signature alone does not settle revocation/)
  assert.match(source, /Chain anchors are not checked here/)
  assert.match(source, /does not\s+establish assessment quality, issuer authority or recognition/)
})
