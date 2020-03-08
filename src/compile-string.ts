import Parse from './parse'

/* TYPES */

import { SqrlConfig } from './config'
import { AstObject, Filter, ParentTemplateObject } from './parse'
// import SqrlErr from './err'

/* END TYPES */

export default function compileToString (str: string, env: SqrlConfig) {
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

function filter (str: string, filters: Array<Filter>, env: SqrlConfig) {
  for (var i = 0; i < filters.length; i++) {
    var name = filters[i][0]
    var params = filters[i][1]
    var isFilterAsync = filters[i][2]

    // if (isFilterAsync && !env.async) {
    //   throw SqrlErr("Async filter '" + name + "' in non-async env")
    // }
    // Let the JS compiler do this, compile() will catch it

    str = (isFilterAsync ? 'await ' : '') + "c.l('F','" + name + "')(" + str
    if (params) {
      str += ',' + params
    }
    str += ')'
  }
  return str
}

// TODO: Use type intersections for TemplateObject, etc.
// so I don't have to make properties mandatory

function compileHelper (
  env: SqrlConfig,
  res: string,
  descendants: Array<AstObject>,
  params: string,
  isAsync?: boolean,
  name?: string
) {
  var ret =
    '{exec:' +
    (isAsync ? 'async ' : '') +
    compileScopeIntoFunction(descendants, res, env) +
    ',params:[' +
    params +
    ']'
  if (name) {
    ret += ",name:'" + name + "'"
  }
  if (isAsync) {
    ret += ',async:true'
  }
  ret += '}'
  return ret
}

function compileBlocks (blocks: Array<ParentTemplateObject>, env: SqrlConfig) {
  var ret = '['
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i]
    ret += compileHelper(env, block.res || '', block.d, block.p || '', block.a, block.n)
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
      var isAsync = !!currentBlock.a // !! is to booleanize it
      // if (isAsync && !env.async) {
      //   throw SqrlErr("Async block or helper '" + name + "' in non-async env")
      // }
      // Let compiler do this
      if (type === 'r') {
        if (env.defaultFilter) {
          content = "c.l('F','" + env.defaultFilter + "')(" + content + ')'
        }
        if (!currentBlock.raw && env.autoEscape) {
          content = "c.l('F','e')(" + content + ')'
        }
        var filtered = filter(content, filters, env)
        returnStr += 'tR+=' + filtered + ';'
        // reference
      } else if (type === '~') {
        // helper
        if (env.storage.nativeHelpers.get(name)) {
          returnStr += env.storage.nativeHelpers.get(name)(currentBlock, env)
        } else {
          var helperReturn =
            (isAsync ? 'await ' : '') +
            "c.l('H','" +
            name +
            "')(" +
            compileHelper(env, res, (currentBlock as ParentTemplateObject).d, params, isAsync)
          if (blocks) {
            helperReturn += ',' + compileBlocks(blocks, env)
          } else {
            helperReturn += ',[]'
          }
          helperReturn += ',c)'

          returnStr += 'tR+=' + filter(helperReturn, filters, env) + ';'
        }
      } else if (type === 's') {
        returnStr +=
          'tR+=' +
          filter(
            (isAsync ? 'await ' : '') + "c.l('H','" + name + "')({params:[" + params + ']},[],c)',
            filters,
            env
          ) +
          ';'
        // self-closing helper
      } else if (type === '!') {
        // execute
        returnStr += content
      } else if (type === '?') {
        // custom (implement later)
      }
    }
  }

  return returnStr
}
