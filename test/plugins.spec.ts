/* global it, expect, describe */
import * as Eta from '../src/index'
import { EtaConfig } from '../src/config'
import { AstObject } from '../src/parse'

function myPlugin() {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    processAST: function (ast: Array<AstObject>, _env?: EtaConfig) {
      ast.push('String to append')
      return ast
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    processFnString: function (str: string, _env?: EtaConfig) {
      return str.replace(/@@num@@/, '2352.3')
    }
  }
}

const template = `<%= it.val %> <%= @@num@@ %>.`

describe('Plugins', () => {
  it('Plugins function properly', () => {
    expect(Eta.render(template, { val: 'value' }, { plugins: [myPlugin()] })).toEqual(
      'value 2352.3.String to append'
    )
  })
})
