import Parse from './parse'
import { nativeHelpers } from './containers'

/* TYPES */

import { SqrlConfig } from './config'
import { AstObject, Filter, ParentTemplateObject } from './parse'

/* END TYPES */

function compileToString (str: string, env: SqrlConfig) {
  var buffer: Array<AstObject> = Parse(str, env)
  return (
    "var tR='';" +
    compileScope(buffer, env)
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r') +
    'return tR'
  )
}

// TODO: Use type intersections for TemplateObject, etc.
// so I don't have to make properties mandatory

function compileHelper (
  env: SqrlConfig,
  res: string,
  descendants: Array<AstObject>,
  params: string,
  name?: string
) {
  var ret = '{exec:' + compileScopeIntoFunction(descendants, res, env) + ',params:[' + params + ']'
  if (name) {
    ret += ",name:'" + name + "'"
  }
  ret += '}'
  return ret
}

function compileBlocks (blocks: Array<ParentTemplateObject>, env: SqrlConfig) {
  var ret = '['
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i]
    ret += compileHelper(env, block.res || '', block.d, block.p || '', block.n)
    if (i < blocks.length) {
      ret += ','
    }
  }
  ret += ']'
  return ret
}

export function compileScopeIntoFunction (buff: Array<AstObject>, res: string, env: SqrlConfig) {
  return 'function(' + res + "){var tR='';" + compileScope(buff, env) + 'return tR}'
}

export function compileScope (buff: Array<AstObject>, env: SqrlConfig) {
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
      var content = currentBlock.c || ''
      var filters = currentBlock.f
      var name = currentBlock.n || ''
      var params = currentBlock.p || ''
      var res = currentBlock.res || ''
      var blocks = currentBlock.b

      if (type === 'r') {
        if (!currentBlock.raw && env.autoEscape) {
          content = "c.l('F','e')(" + content + ')'
        }
        var filtered = filter(content, filters)
        returnStr += 'tR+=' + filtered + ';'
        // reference
      } else if (type === '~') {
        // helper
        // TODO: native helpers: check
        if (nativeHelpers.get(name)) {
          returnStr += nativeHelpers.get(name)(currentBlock, env)
        } else {
          var helperReturn =
            "c.l('H','" +
            name +
            "')(" +
            compileHelper(env, res, (currentBlock as ParentTemplateObject).d, params)
          if (blocks) {
            helperReturn += ',' + compileBlocks(blocks, env)
          } else {
            helperReturn += ',[]'
          }
          helperReturn += ',c)'

          returnStr += 'tR+=' + filter(helperReturn, filters) + ';'
        }
      } else if (type === 's') {
        returnStr +=
          'tR+=' + filter("c.l('H','" + name + "')({params:[" + params + ']},[],c)', filters) + ';'
        // self-closing helper
      } else if (type === '!') {
        // execute
        returnStr += content + ';'
      } else if (type === '?') {
        // custom (implement later)
      }
    }
  }
  return returnStr
}

function filter (str: string, filters: Array<Filter>) {
  for (var i = 0; i < filters.length; i++) {
    var name = filters[i][0]
    var params = filters[i][1]
    str = "c.l('F','" + name + "')(" + str
    if (params) {
      str += ',' + params
    }
    str += ')'
  }
  return str
}

export default compileToString
