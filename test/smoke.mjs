import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

test('built client is the T3 picker and keeps the official selection contract', async () => {
  const client = await read('client.js')
  assert.match(client, /id: '@fizor-drm\/dsh-model-picker'/)
  assert.match(client, /t3mp-panel/)
  assert.match(client, /providerLogos/)
  assert.match(client, /provider: group\.id/)
  assert.match(client, /provider: currentGroup\.id/)
  assert.doesNotMatch(client, /t3mp-shortcut/)
  assert.doesNotMatch(client, /Ctrl\+/)
})

test('package and patch point at the fork', async () => {
  const pkg = JSON.parse(await read('package.json'))
  const patch = await read('cordis.patch.yml')
  assert.equal(pkg.name, '@fizor-drm/dsh-model-picker')
  assert.match(patch, /@fizor-drm\/dsh-model-picker/)
  assert.ok(pkg.files.includes('FORK-NOTICE.md'))
  assert.ok(pkg.files.includes('client.js'))
})
