import { assertEquals } from 'https://deno.land/std@0.97.0/testing/asserts.ts'
import * as eta from '../../deno_dist/mod.ts'

Deno.test('simple render', () => {
  const t = `Hi <%=it.name%>`
  assertEquals(eta.render(t, { name: 'Ben' }), 'Hi Ben')
})
