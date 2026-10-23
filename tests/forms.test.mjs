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
for (const file of ['functions/_ratelimit',
  'functions/early-access', 'functions/enquiry', 'email/confirmation']) {
  const source = readFileSync(new URL(`../netlify/${file}.ts`, import.meta.url), 'utf8')
  const target = join(output, `${file}.js`)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText)
}
const load = file => import(pathToFileURL(join(output, `functions/${file}.js`)).href)

test('both handlers accept submissions using the managed runtime regardless of patch version', async t => {
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
    for (const version of ['22.21.1', '22.23.4']) {
      Object.defineProperty(process.versions, 'node', { value: version })
      const before = fetch.mock.callCount()
      const accepted = await handler(request())
      assert.equal(accepted.status, 200, `${file} on ${version}`)
      assert.equal(accepted.headers.get('cache-control'), 'no-store')
      assert.equal((await accepted.json()).ok, true)
      assert.equal(fetch.mock.callCount() - before, file === 'enquiry' ? 2 : 1)
    }
  }
})

test('OPTIONS probes advertise methods without credentials or outbound requests', async t => {
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
    for (const version of ['22.23.3', '22.23.4']) {
      Object.defineProperty(process.versions, 'node', { value: version })
      const response = await handler(new Request('https://example.test/api/test', { method: 'OPTIONS' }))
      assert.equal(response.status, 204, `${file} on ${version}`)
      assert.equal(response.headers.get('allow'), 'POST, OPTIONS')
      assert.equal(response.headers.get('cache-control'), 'no-store')
    }
  }
  assert.equal(fetch.mock.callCount(), 0)
})

test('TLS failures return 502 without retrying or reporting a successful submission', async t => {
  t.mock.method(console, 'error', () => {})
  t.mock.method(globalThis, 'fetch', async () => {
    throw new TypeError('fetch failed', {
      cause: Object.assign(new Error('certificate verification failed'), {
        code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
      }),
    })
  })
  const previousKey = process.env.PLUNK_API_KEY
  process.env.PLUNK_API_KEY = 'fixture-key'
  t.after(() => {
    if (previousKey === undefined) delete process.env.PLUNK_API_KEY
    else process.env.PLUNK_API_KEY = previousKey
  })
  for (const file of ['early-access', 'enquiry']) {
    const { default: handler } = await load(file)
    const before = fetch.mock.callCount()
    const response = await handler(new Request('https://example.test/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-nf-client-connection-ip': `tls-${file}` },
      body: JSON.stringify({ email: 'fixture@example.test', platforms: ['linux'] }),
    }))
    assert.equal(response.status, 502)
    assert.equal((await response.json()).ok, false)
    assert.equal(fetch.mock.callCount() - before, 1)
  }
})

test('invalid addresses and honeypot submissions never reach Plunk', async t => {
  t.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected upstream call') })
  for (const file of ['early-access', 'enquiry']) {
    const { default: handler } = await load(file)
    for (const [payload, status] of [
      [{ email: 'invalid' }, 400],
      [{ email: 'fixture@example.test', platforms: ['linux'], botField: 'bot' }, 200],
    ]) {
      const response = await handler(new Request('https://example.test/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-nf-client-connection-ip': `validation-${file}` },
        body: JSON.stringify(payload),
      }))
      assert.equal(response.status, status)
    }
  }
  assert.equal(fetch.mock.callCount(), 0)
})
