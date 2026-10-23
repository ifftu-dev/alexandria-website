import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { after, test } from 'node:test'
import ts from 'typescript'

const output = mkdtempSync(join(tmpdir(), 'alexandria-functions-'))
writeFileSync(join(output, 'package.json'), '{"type":"module"}')
after(() => rmSync(output, { recursive: true, force: true }))
for (const file of ['functions/_tls-runtime', 'functions/_ratelimit',
  'functions/early-access', 'functions/enquiry', 'email/confirmation']) {
  const source = readFileSync(new URL(`../netlify/${file}.ts`, import.meta.url), 'utf8')
  const target = join(output, `${file}.js`)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText)
}
const load = file => import(pathToFileURL(join(output, `functions/${file}.js`)).href)
const { hasPatchedTlsRuntime } = await load('_tls-runtime')

test('only patched supported Node release lines can send credentials', () => {
  for (const version of ['22.23.4', '22.24.0', '24.22.1', '24.23.0', '26.12.1']) {
    assert.equal(hasPatchedTlsRuntime(version), true, version)
  }
  for (const version of ['22.21.1', '22.23.3', '24.22.0', '26.12.0', '20.99.0',
    '23.99.0', '27.0.0', '22.23.4-rc.1', '', '22.23', 'garbage']) {
    assert.equal(hasPatchedTlsRuntime(version), false, version)
  }
})

test('both handlers block outbound calls on an unpatched runtime and work after updating', async t => {
  const original = Object.getOwnPropertyDescriptor(process.versions, 'node')
  t.after(() => Object.defineProperty(process.versions, 'node', original))
  t.mock.method(console, 'error', () => {})
  t.mock.method(globalThis, 'fetch', async () => new Response('{"_meta":{"isNew":false}}', {
    headers: { 'Content-Type': 'application/json' },
  }))
  const previousKey = process.env.PLUNK_API_KEY
  process.env.PLUNK_API_KEY = 'fixture-key'
  t.after(() => {
    if (previousKey === undefined) delete process.env.PLUNK_API_KEY
    else process.env.PLUNK_API_KEY = previousKey
  })
  for (const file of ['early-access', 'enquiry']) {
    const { default: handler } = await load(file)
    const request = () => new Request('https://example.test/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-nf-client-connection-ip': file },
      body: JSON.stringify({ email: 'fixture@example.test', platforms: ['linux'] }),
    })
    Object.defineProperty(process.versions, 'node', { value: '22.21.1' })
    const before = fetch.mock.callCount()
    const rejected = await handler(request())
    assert.equal(rejected.status, 503)
    assert.equal(rejected.headers.get('cache-control'), 'no-store')
    assert.equal(fetch.mock.callCount(), before)
    Object.defineProperty(process.versions, 'node', { value: '22.23.4' })
    const accepted = await handler(request())
    assert.equal(accepted.status, 200)
    assert.ok(fetch.mock.callCount() > before)
  }
})


test('HEAD probes verify both live runtimes without credentials or outbound requests', async t => {
  const original = Object.getOwnPropertyDescriptor(process.versions, 'node')
  t.after(() => Object.defineProperty(process.versions, 'node', original))
  t.mock.method(console, 'error', () => {})
  t.mock.method(globalThis, 'fetch', () => { throw new Error('Health probes must not call upstream') })
  const previousKey = process.env.PLUNK_API_KEY
  delete process.env.PLUNK_API_KEY
  t.after(() => {
    if (previousKey !== undefined) process.env.PLUNK_API_KEY = previousKey
  })
  for (const file of ['early-access', 'enquiry']) {
    const { default: handler } = await load(file)
    for (const [version, status] of [['22.23.3', 503], ['22.23.4', 204]]) {
      Object.defineProperty(process.versions, 'node', { value: version })
      const response = await handler(new Request('https://example.test/api/test', { method: 'HEAD' }))
      assert.equal(response.status, status, `${file} on ${version}`)
      assert.equal(response.headers.get('cache-control'), 'no-store')
    }
  }
  assert.equal(fetch.mock.callCount(), 0)
})
