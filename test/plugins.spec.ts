/* global it, expect, describe */
import * as Sqrl from '../src/index'
import { SqrlConfig } from '../src/config'
import { AstObject } from '../src/parse'

function myPlugin () {
  return {
    processAST: function (ast: Array<AstObject>, env?: SqrlConfig) {
      ast.push('String to append')
      return ast
    },
    processFnString: function (str: string, env?: SqrlConfig) {
      return str.replace(/@@num@@/, '2352.3')
    }
  }
}

var template = `{{it.val}} {{ @@num@@ }}.`

describe('Plugins', () => {
  it('Plugins function properly', () => {
    expect(Sqrl.render(template, { val: 'value' }, { plugins: [myPlugin()] })).toEqual(
      'value 2352.3.String to append'
    )
  })
})
