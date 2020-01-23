// Version 1.0.32
import { ParseErr } from './err'
import { trimLeft, trimRight } from './utils'
import { SqrlConfig } from './config'

export type TagType = '~' | '/' | '#' | '?' | 'r' | '!' | 's'
export type TemplateAttribute = 'c' | 'f' | 'fp' | 'p' | 'n' | 'res' | 'err'
export type TemplateObjectAttribute = 'c' | 'p' | 'n' | 'res'

export type AstObject = string | TemplateObject

export type Filter = [string, string | undefined]

export interface TemplateObject {
  n?: string
  t?: string
  f: Array<Filter>
  c?: string
  p?: string
  res?: string
  d?: Array<AstObject> // Todo: Make this optional
  raw?: boolean
  b?: Array<ParentTemplateObject>
}

export interface ParentTemplateObject extends TemplateObject {
  d: Array<AstObject>
  b: Array<ParentTemplateObject>
}

export default function Parse (str: string, env: SqrlConfig): Array<AstObject> {
  var powerchars = new RegExp(
    '([|()]|=>)|' +
    '\'(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r\'\\\\])*?\'|`(?:\\\\[\\s\\w"\'\\\\`]|[^\\\\`])*?`|"(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r"\\\\])*?"' + // matches strings
      '|\\/\\*[^]*?\\*\\/|((\\/)?(-|_)?' +
      env.tags[1] +
      ')',
    'g'
  )
  var tagOpenReg = new RegExp('([^]*?)' + env.tags[0] + '(-|_)?\\s*', 'g')
  var startInd = 0
  var trimNextLeftWs = ''

  function parseTag (): TemplateObject {
    // console.log(JSON.stringify(match))
    var currentObj: TemplateObject = { f: [] }
    var numParens = 0
    var firstChar = str[startInd]
    var currentAttribute: TemplateAttribute = 'c' // default - Valid values: 'c'=content, 'f'=filter, 'fp'=filter params, 'p'=param, 'n'=name
    var currentType: TagType = 'r' // Default
    startInd += 1 // assume we're gonna skip the first character

    if (firstChar === '~' || firstChar === '#' || firstChar === '/') {
      currentAttribute = 'n'
      currentType = firstChar
    } else if (firstChar === '!' || firstChar === '?') {
      // ? for custom
      currentType = firstChar
    } else if (firstChar === '*') {
      currentObj.raw = true
    } else {
      startInd -= 1
    }

    function addAttrValue (indx: number) {
      var valUnprocessed = str.slice(startInd, indx)
      // console.log(valUnprocessed)
      var val = valUnprocessed.trim()
      if (currentAttribute === 'f') {
        if (val === 'safe') {
          currentObj.raw = true
        } else {
          currentObj.f.push([val, ''])
        }
      } else if (currentAttribute === 'fp') {
        currentObj.f[currentObj.f.length - 1][1] += val
      } else if (currentAttribute === 'err') {
        if (val) {
          var found = valUnprocessed.search(/\S/)
          ParseErr('invalid syntax', str, startInd + found)
        }
      } else {
        // if (currentObj[currentAttribute]) { // TODO make sure no errs
        //   currentObj[currentAttribute] += val
        // } else {
        currentObj[currentAttribute] = val
        // }
      }
      startInd = indx + 1
    }

    powerchars.lastIndex = startInd

    var m
    // tslint:disable-next-line:no-conditional-assignment
    while ((m = powerchars.exec(str)) !== null) {
      var char = m[1]
      var tagClose = m[2]
      var slash = m[3]
      var wsControl = m[4]
      var i = m.index

      if (char) {
        // Power character
        if (char === '(') {
          if (numParens === 0) {
            if (currentAttribute === 'n') {
              addAttrValue(i)
              currentAttribute = 'p'
            } else if (currentAttribute === 'f') {
              addAttrValue(i)
              currentAttribute = 'fp'
            }
          }
          numParens++
        } else if (char === ')') {
          numParens--
          if (numParens === 0 && currentAttribute !== 'c') {
            // Then it's closing a filter, block, or helper
            addAttrValue(i)

            currentAttribute = 'err' // Reset the current attribute
          }
        } else if (numParens === 0 && char === '|') {
          addAttrValue(i) // this should actually always be whitespace or empty
          currentAttribute = 'f'
        } else if (char === '=>') {
          addAttrValue(i)
          startInd += 1 // this is 2 chars
          currentAttribute = 'res'
        }
      } else if (tagClose) {
        addAttrValue(i)
        startInd = i + m[0].length
        tagOpenReg.lastIndex = startInd
        // console.log('tagClose: ' + startInd)
        trimNextLeftWs = wsControl
        if (slash && currentType === '~') {
          currentType = 's'
        } // TODO throw err
        currentObj.t = currentType
        return currentObj
      }
    }
    // TODO: Do I need this?
    ParseErr('unclosed tag', str, str.length)
    return currentObj // To prevent TypeScript from erroring
  }

  function parseContext (parentObj: TemplateObject, firstParse?: boolean): ParentTemplateObject {
    parentObj.b = [] // assume there will be blocks // TODO: perf optimize this
    parentObj.d = []
    var lastBlock: ParentTemplateObject | false = false
    var buffer: Array<AstObject> = []

    function pushString (strng: string, wsAhead?: string) {
      if (strng) {
        var stringToPush = strng.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
        if (wsAhead) {
          stringToPush = trimRight(stringToPush, wsAhead)
        }
        if (trimNextLeftWs) {
          stringToPush = trimLeft(stringToPush, trimNextLeftWs)
          trimNextLeftWs = ''
        }
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
      var ws = tagOpenMatch[2]

      pushString(precedingString, ws)
      startInd = tagOpenMatch.index + tagOpenMatch[0].length

      var currentObj = parseTag()
      // ===== NOW ADD THE OBJECT TO OUR BUFFER =====

      var currentType = currentObj.t
      if (currentType === '~') {
        currentObj = parseContext(currentObj) // currentObj is the parent object
        buffer.push(currentObj)
      } else if (currentType === '/') {
        if (parentObj.n === currentObj.n) {
          if (lastBlock) {
            // If there's a previous block
            lastBlock.d = buffer
            parentObj.b.push(lastBlock)
          } else {
            parentObj.d = buffer
          }
          // console.log('parentObj: ' + JSON.stringify(parentObj))
          return parentObj as ParentTemplateObject
        } else {
          ParseErr(
            "Helper start and end don't match",
            str,
            tagOpenMatch.index + tagOpenMatch[0].length
          )
        }
      } else if (currentType === '#') {
        if (lastBlock) {
          // If there's a previous block
          lastBlock.d = buffer
          parentObj.b.push(lastBlock)
        } else {
          parentObj.d = buffer
        }
        lastBlock = currentObj as ParentTemplateObject // Set the 'lastBlock' object to the value of the current block

        buffer = []
      } else {
        buffer.push(currentObj)
      }
      // ===== DONE ADDING OBJECT TO BUFFER =====
    }

    if (firstParse) {
      // TODO: more intuitive
      pushString(str.slice(startInd, str.length))
      parentObj.d = buffer
    }

    return parentObj as ParentTemplateObject
  }

  var parseResult = parseContext({ f: [] }, true)
  // console.log(JSON.stringify(parseResult))
  return parseResult.d // Parse the very outside context
}
