import { Render } from '../src/index'
import { Env, Config } from '../src/config'

function generateEnv (options?: object) {
  return 'default'
}

Config({ autoEscape: false }, 'safe-from-xss')

describe('Config Tests', () => {
  it('Renders a simple template with default env', () => {
    var res = Render('hi {{ it.name }}', { name: 'Ben' }, Env.default)
    expect(res).toEqual('hi Ben')
  })

  it('Renders a simple template with custom tags', () => {
    var res = Render('hi << it.name >>', { name: 'Ben' }, Config({ tags: ['<<', '>>'] }))
    expect(res).toEqual('hi Ben')
  })

  it('Renders a simple template with env-returning function', () => {
    var res = Render('hi {{ it.name }}', { name: 'Ben' }, generateEnv)
    expect(res).toEqual('hi Ben')
  })

  it('Renders a simple template with stored env', () => {
    var res = Render('{{ it.html }}', { html: '<p>Hi</p>' }, 'safe-from-xss')
    expect(res).toEqual('<p>Hi</p>') // not escaped
  })

  test('throws when invalid env reference is passed', () => {
    expect(() => {
      // I have to annotate 3 as unknown as string for typescript
      // Don't worry, it's not converted to a string
      Render('hi {{ it.name }}', { name: 'Ben' }, (3 as unknown) as string)
    }).toThrow()
  })
})
