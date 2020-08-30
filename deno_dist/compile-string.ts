import Parse from './parse.ts'

/* TYPES */

import { EtaConfig } from './config.ts'
import { AstObject } from './parse.ts'

/* END TYPES */

export default function compileToString (str: string, env: EtaConfig) {
  var buffer: Array<AstObject> = Parse(str, env)

  var res =
    "var tR=''\n" +
    (env.useWith ? 'with(' + env.varName + '||{}){' : '') +
    compileScope(buffer, env) +
    'if(cb){cb(null,tR)} return tR' +
    (env.useWith ? '}' : '')

  if (env.plugins) {
    for (var i = 0; i < env.plugins.length; i++) {
      var plugin = env.plugins[i]
      if (plugin.processFnString) {
        res = plugin.processFnString(res, env)
      }
    }
  }

  return res
}

function compileScope (buff: Array<AstObject>, env: EtaConfig) {
  var i = 0
  var buffLength = buff.length
  var returnStr = ''

  for (i; i < buffLength; i++) {
    var currentBlock = buff[i]
    if (typeof currentBlock === 'string') {
      var str = currentBlock

      // we know string exists
      returnStr += "tR+='" + str + "'\n"
    } else {
      var type = currentBlock.t // ~, s, !, ?, r
      var content = currentBlock.val || ''

      if (type === 'r') {
        // raw
        returnStr += 'tR+=' + content + '\n'
      } else if (type === 'i') {
        // interpolate
        if (env.autoEscape) {
          content = 'E.e(' + content + ')'
        }
        returnStr += 'tR+=' + content + '\n'
        // reference
      } else if (type === 'e') {
        // execute
        returnStr += content + '\n' // you need a \n in case you have <% } %>
      }
    }
  }

  return returnStr
}
