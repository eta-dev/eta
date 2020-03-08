import { Cacher } from './storage'
import SqrlErr from './err'
import { compileScope, compileScopeIntoFunction } from './compile-string'
import { hasOwnProp } from './utils'

/* TYPES */

import { SqrlConfig } from './config'
import { TemplateFunction } from './compile'
import { ParentTemplateObject } from './parse'

export interface HelperContent {
  exec: Function
  params: Array<any>
  async?: boolean
}

export interface HelperBlock extends HelperContent {
  name: string
}

export type HelperFunction = (
  content: HelperContent,
  blocks: Array<HelperBlock>,
  config: SqrlConfig
) => string | Promise<string>

export type FilterFunction = (str: string) => any | Promise<any>

interface EscapeMap {
  '&': '&amp;'
  '<': '&lt;'
  '"': '&quot;'
  "'": '&#39;'
  [index: string]: string
}

interface IncludeHelperContent extends HelperContent {
  params: [string, object]
}

interface GenericData {
  [index: string]: any
}

/* END TYPES */

var templates = new Cacher<TemplateFunction>({})

function errWithBlocksOrFilters (
  name: string,
  blocks: Array<any> | false, // false means don't check
  filters: Array<any> | false,
  native?: boolean
) {
  if (blocks && blocks.length > 0) {
    throw SqrlErr((native ? 'Native' : '') + "Helper '" + name + "' doesn't accept blocks")
  }
  if (filters && filters.length > 0) {
    throw SqrlErr((native ? 'Native' : '') + "Helper '" + name + "' doesn't accept filters")
  }
}

/* ASYNC LOOP FNs */
function asyncArrLoop (arr: Array<any>, index: number, fn: Function, res: string, cb: Function) {
  fn(arr[index], index).then(function (val: string) {
    res += val
    if (index === arr.length - 1) {
      cb(res)
    } else {
      asyncArrLoop(arr, index + 1, fn, res, cb)
    }
  })
}

function asyncObjLoop (
  obj: { [index: string]: any },
  keys: Array<string>,
  index: number,
  fn: Function,
  res: string,
  cb: Function
) {
  fn(keys[index], obj[keys[index]]).then(function (val: string) {
    res += val
    if (index === keys.length - 1) {
      cb(res)
    } else {
      asyncObjLoop(obj, keys, index + 1, fn, res, cb)
    }
  })
}

/* ASYNC LOOP FNs */

var helpers = new Cacher<HelperFunction>({
  each: function (content: HelperContent, blocks: Array<HelperBlock>) {
    var res = ''
    var arr = content.params[0]
    errWithBlocksOrFilters('each', blocks, false)

    if (content.async) {
      return new Promise(function (resolve) {
        asyncArrLoop(arr, 0, content.exec, res, resolve)
      })
    } else {
      for (var i = 0; i < arr.length; i++) {
        res += content.exec(arr[i], i)
      }
      return res
    }
  },
  foreach: function (content: HelperContent, blocks: Array<HelperBlock>) {
    var obj = content.params[0]
    errWithBlocksOrFilters('foreach', blocks, false)

    if (content.async) {
      return new Promise(function (resolve) {
        asyncObjLoop(obj, Object.keys(obj), 0, content.exec, '', resolve)
      })
    } else {
      var res = ''

      for (var key in obj) {
        if (!hasOwnProp(obj, key)) continue
        res += content.exec(key, obj[key]) // todo: check on order
      }
      return res
    }
  },
  include: function (
    content: IncludeHelperContent,
    blocks: Array<HelperBlock>,
    config: SqrlConfig
  ): string {
    errWithBlocksOrFilters('include', blocks, false)
    var template = config.storage.templates.get(content.params[0])
    if (!template) {
      throw SqrlErr('Could not fetch template "' + content.params[0] + '"')
    }
    return template(content.params[1], config)
  } as HelperFunction,
  extends: function (
    content: IncludeHelperContent,
    blocks: Array<HelperBlock>,
    config: SqrlConfig
  ): string {
    var data: GenericData = content.params[1] || {}
    data.content = content.exec()

    for (var i = 0; i < blocks.length; i++) {
      var currentBlock = blocks[i]
      data[currentBlock.name] = currentBlock.exec()
    }

    var template = config.storage.templates.get(content.params[0])
    if (!template) {
      throw SqrlErr('Could not fetch template "' + content.params[0] + '"')
    }
    return template(data, config)
  } as HelperFunction,
  useScope: function (content: HelperContent, blocks: Array<HelperBlock>): string {
    errWithBlocksOrFilters('useScope', blocks, false)

    return content.exec(content.params[0])
  } as HelperFunction
})

var nativeHelpers = new Cacher<Function>({
  if: function (buffer: ParentTemplateObject, env: SqrlConfig) {
    errWithBlocksOrFilters('if', false, buffer.f, true)

    var returnStr = 'if(' + buffer.p + '){' + compileScope(buffer.d, env) + '}'
    if (buffer.b) {
      for (var i = 0; i < buffer.b.length; i++) {
        var currentBlock = buffer.b[i]
        if (currentBlock.n === 'else') {
          returnStr += 'else{' + compileScope(currentBlock.d, env) + '}'
        } else if (currentBlock.n === 'elif') {
          returnStr += 'else if(' + currentBlock.p + '){' + compileScope(currentBlock.d, env) + '}'
        }
      }
    }
    return returnStr
  },
  try: function (buffer: ParentTemplateObject, env: SqrlConfig) {
    errWithBlocksOrFilters('try', false, buffer.f, true)

    if (!buffer.b || buffer.b.length !== 1 || buffer.b[0].n !== 'catch') {
      throw SqrlErr("native helper 'try' only accepts 1 block, 'catch'")
    }
    var returnStr = 'try{' + compileScope(buffer.d, env) + '}'

    var currentBlock = buffer.b[0]
    returnStr +=
      'catch' +
      (currentBlock.res ? '(' + currentBlock.res + ')' : '') +
      '{' +
      compileScope(currentBlock.d, env) +
      '}'

    return returnStr
  },
  block: function (buffer: ParentTemplateObject, env: SqrlConfig) {
    errWithBlocksOrFilters('block', buffer.b, buffer.f, true)

    var returnStr =
      'if(!' +
      env.varName +
      '[' +
      buffer.p +
      ']){tR+=(' +
      compileScopeIntoFunction(buffer.d, '', env) +
      ')()}else{tR+=' +
      env.varName +
      '[' +
      buffer.p +
      ']}'

    return returnStr
  }
})

var escMap: EscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#39;'
}

function replaceChar (s: string): string {
  return escMap[s]
}

function XMLEscape (str: any) {
  // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
  var newStr = String(str)
  if (/[&<"']/.test(newStr)) {
    return newStr.replace(/[&<"']/g, replaceChar)
  } else {
    return newStr
  }
}

var filters = new Cacher<FilterFunction>({ e: XMLEscape })

export { templates, helpers, nativeHelpers, filters }
