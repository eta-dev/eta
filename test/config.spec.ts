import { Render } from '../src/index'
import { Env, Config } from '../src/config'

function generateEnv (options?: object) {
  return 'default'
}

describe('Config Tests', () => {
  it('Renders a simple template with default env', () => {
    var buff = Render('hi {{ it.name }}', { name: 'Ben' }, Env.default)
    expect(buff).toEqual('hi Ben')
  })

  it('Renders a simple template with custom tags', () => {
    var buff = Render('hi << it.name >>', { name: 'Ben' }, Config({ tags: ['<<', '>>'] }))
    expect(buff).toEqual('hi Ben')
  })

  it('Renders a simple template with env-returning function', () => {
    var buff = Render('hi {{ it.name }}', { name: 'Ben' }, generateEnv)
    expect(buff).toEqual('hi Ben')
  })
})
