import EtaErr, { ParseErr } from './err'
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
  var trimLeftOfNextStr: string | false = false
  var lastIndex = 0

  var templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g

  var singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g

  var doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g

  function pushString (strng: string, shouldTrimRightOfString?: string | false) {
    if (strng) {
      // if string is truthy it must be of type 'string'

      // TODO: benchmark replace( /(\\|')/g, '\\$1')
      strng = trimWS(
        strng,
        env,
        trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
        shouldTrimRightOfString
      )

      if (strng) {
        // replace \ with \\, ' with \'

        strng = strng.replace(/\\|'/g, '\\$&').replace(/\r\n|\n|\r/g, '\\n')
        // we're going to convert all CRLF to LF so it doesn't take more than one replace

        buffer.push(strng)
      }
    }
  }

  var prefixes = (env.parse.exec + env.parse.interpolate + env.parse.raw).split('').join('|')

  var parseOpenReg = new RegExp('([^]*?)' + env.tags[0] + '(-|_)?\\s*(' + prefixes + ')?\\s*', 'g')
  var parseCloseReg = new RegExp('\'|"|`|\\/\\*|(\\s*(-|_)?' + env.tags[1] + ')', 'g')
  // TODO: benchmark having the \s* on either side vs using str.trim()

  var m

  while ((m = parseOpenReg.exec(str))) {
    // TODO: check if above needs exec(str) !== null. Don't think it's possible to have 0-width matches but...
    lastIndex = m[0].length + m.index

    var precedingString = m[1]
    var wsLeft = m[2]
    var prefix = m[3] || '' // by default either ~, =, or empty

    pushString(precedingString, wsLeft)

    parseCloseReg.lastIndex = lastIndex
    var closeTag
    var currentObj

    while ((closeTag = parseCloseReg.exec(str))) {
      if (closeTag[1]) {
        var content = str.slice(lastIndex, closeTag.index)

        parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex

        trimLeftOfNextStr = closeTag[2]

        var currentType: TagType = ''
        if (prefix === env.parse.exec) {
          currentType = 'e'
        } else if (prefix === env.parse.raw) {
          currentType = 'r'
        } else if (prefix === env.parse.interpolate) {
          currentType = 'i'
        }

        currentObj = { t: currentType, val: content }
        break
      } else {
        var char = closeTag[0]
        if (char === '/*') {
          var commentCloseInd = str.indexOf('*/', parseCloseReg.lastIndex)

          if (commentCloseInd === -1) {
            ParseErr('unclosed comment', str, closeTag.index)
          }
          parseCloseReg.lastIndex = commentCloseInd
        } else if (char === "'") {
          singleQuoteReg.lastIndex = closeTag.index

          var singleQuoteMatch = singleQuoteReg.exec(str)
          if (singleQuoteMatch) {
            parseCloseReg.lastIndex = singleQuoteReg.lastIndex
          } else {
            ParseErr('unclosed string', str, closeTag.index)
          }
        } else if (char === '"') {
          doubleQuoteReg.lastIndex = closeTag.index
          var doubleQuoteMatch = doubleQuoteReg.exec(str)

          if (doubleQuoteMatch) {
            parseCloseReg.lastIndex = doubleQuoteReg.lastIndex
          } else {
            ParseErr('unclosed string', str, closeTag.index)
          }
        } else if (char === '`') {
          templateLitReg.lastIndex = closeTag.index
          var templateLitMatch = templateLitReg.exec(str)
          if (templateLitMatch) {
            parseCloseReg.lastIndex = templateLitReg.lastIndex
          } else {
            ParseErr('unclosed string', str, closeTag.index)
          }
        }
      }
    }
    if (currentObj) {
      buffer.push(currentObj)
    } else {
      ParseErr('unclosed tag', str, m.index)
    }
  }

  pushString(str.slice(lastIndex, str.length), false)

  if (env.plugins) {
    for (var i = 0; i < env.plugins.length; i++) {
      var plugin = env.plugins[i]
      if (plugin.processAST) {
        buffer = plugin.processAST(buffer, env)
      }
    }
  }

  return buffer
}
