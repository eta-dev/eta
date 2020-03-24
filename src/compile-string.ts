import Parse from './parse'

/* TYPES */

import { EtaConfig } from './config'
import { AstObject } from './parse'

/* END TYPES */

export default function compileToString (str: string, env: EtaConfig) {
  var buffer: Array<AstObject> = Parse(str, env)

  var res =
    "var tR='';" +
    (env.useWith ? 'with(' + env.varName + '||{}){' : '') +
    compileScope(buffer, env)
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r') +
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

  // TODO: is `return cb()` necessary, or could we just do `cb()`
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
      returnStr += "tR+='" + str + "';"
    } else {
      var type = currentBlock.t // ~, s, !, ?, r
      var content = currentBlock.val || ''

      if (type === 'i') {
        returnStr += 'tR+=' + content + ';'
      } else if (type === 'r') {
        returnStr = 'tR+=E.e(' + content + ')'
        // reference
      } else if (type === 'e') {
        // execute
        returnStr += content
      }
    }
  }

  return returnStr
}
