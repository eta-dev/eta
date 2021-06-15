import { assertEquals } from 'https://deno.land/std@0.97.0/testing/asserts.ts'
import * as eta from '../../deno_dist/mod.ts'

Deno.test('Renders a simple template with default env', () => {
  const res = eta.render('hi <%= it.name %>', { name: 'Ben' }, eta.defaultConfig)

  assertEquals(res, 'hi Ben')
})

Deno.test('Renders a simple template with custom tags', () => {
  const res = eta.render('hi <<= it.name >>', { name: 'Ben' }, { tags: ['<<', '>>'] })

  assertEquals(res, 'hi Ben')
})

Deno.test('Renders a simple template without autoescaping', () => {
  const res = eta.render('<%= it.html %>', { html: '<p>Hi</p>' }, { autoEscape: false })

  assertEquals(res, '<p>Hi</p>') // not escaped
})
