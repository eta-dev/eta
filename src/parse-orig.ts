import { ParseErr } from './err'
import { trimWS } from './utils'

/* TYPES */

import { EtaConfig } from './config'

export type TagType = 'r' | 'e' | 'i' | ''

export interface TemplateObject {
  t: TagType
  val: string
}

export type AstObject = string | TemplateObject

/* END TYPES */

export default function parse (str: string, env: EtaConfig): Array<AstObject> {
  var buffer: Array<AstObject> = []

  var tagCloseRegExp = new RegExp(
    '\'(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r\'\\\\])*?\'|`(?:\\\\[\\s\\w"\'\\\\`]|[^\\\\`])*?`|"(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r"\\\\])*?"' + // matches strings
      '|\\/\\*[^]*?\\*\\/|((-|_)?' +
      env.tags[1] +
      ')',
    'g'
  )

  var prefixes = (env.parse.exec + env.parse.interpolate + env.parse.raw).split('').join('|')

  var tagOpenReg = new RegExp('([^]*?)' + env.tags[0] + '(-|_)?\\s*(' + prefixes + ')?', 'g')
  var startInd = 0
  var trimLeftOfNextStr: string | false = false

  function pushString (strng: string, shouldTrimRightOfString?: string | false) {
    if (strng) {
      // if string is truthy it must be of type 'string'
      // replace \ with \\, ' with \'
      var stringToPush = strng.replace(/\\|'/g, '\\$&')

      // TODO: benchmark replace( /(\\|')/g, '\\$1')
      stringToPush = trimWS(
        stringToPush,
        env,
        trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
        shouldTrimRightOfString
      )

      stringToPush = stringToPush.replace(/\n/g, '\\n').replace(/\r/g, '\\r')

      if (stringToPush) {
        buffer.push(stringToPush)
      }
    }
  }

  // Random TODO: parentObj.b doesn't need to have t: #
  var tagOpenMatch
  // tslint:disable-next-line:no-conditional-assignment
  while ((tagOpenMatch = tagOpenReg.exec(str)) !== null) {
    var precedingString = tagOpenMatch[1]
    var shouldTrimRightOfString = tagOpenMatch[2]
    var prefix = tagOpenMatch[3] || ''

    var currentType: TagType = ''

    if (prefix === env.parse.exec) {
      currentType = 'e'
    } else if (prefix === env.parse.raw) {
      currentType = 'r'
    } else if (prefix === env.parse.interpolate) {
      currentType = 'i'
    }

    pushString(precedingString, shouldTrimRightOfString)
    startInd = tagOpenMatch.index + tagOpenMatch[0].length

    tagCloseRegExp.lastIndex = startInd

    var currentObj: TemplateObject | false = false

    var m
    // tslint:disable-next-line:no-conditional-assignment
    while ((m = tagCloseRegExp.exec(str)) !== null) {
      if (m[1]) {
        // tagClose, not a string or comment
        var wsControl = m[2]
        var i = m.index

        var val = str.slice(startInd, i).trim()
        startInd = i + m[0].length
        tagOpenReg.lastIndex = startInd
        // console.log('tagClose: ' + startInd)
        trimLeftOfNextStr = wsControl
        currentObj = { t: currentType, val: val }
        break
      }
    }

    if (currentObj) {
      buffer.push(currentObj)
    } else {
      ParseErr('unclosed tag', str, startInd)
    }
  }

  pushString(str.slice(startInd, str.length), false)

  // console.log(JSON.stringify(buffer))
  if (env.plugins) {
    for (var i = 0; i < env.plugins.length; i++) {
      var plugin = env.plugins[i]
      if (plugin.processAST) {
        buffer = plugin.processAST(buffer, env)
      }
    }
  }
  return buffer // Return buffer
}
