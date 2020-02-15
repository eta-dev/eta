import { Cacher } from './storage'
import SqrlErr from './err'
import { compileScope } from './compile-string'
// interface ITemplate {
//   exec: (options: object, Sqrl: object) => string
// }

/* TYPES */

import { SqrlConfig } from './config'
import { TemplateFunction } from './compile'
import { ParentTemplateObject } from './parse'

export interface HelperBlock {
  exec: Function
  params: Array<any>
}
export type HelperFunction = (
  content: HelperBlock,
  blocks: Array<HelperBlock>,
  config: SqrlConfig
) => string

type FilterFunction = (str: string) => string

interface EscapeMap {
  '&': '&amp;'
  '<': '&lt;'
  '"': '&quot;'
  "'": '&#39;'
  [index: string]: string
}

interface IncludeHelperBlock extends HelperBlock {
  params: [string, object]
}

/* END TYPES */

var templates = new Cacher<TemplateFunction>({})

var helpers = new Cacher<HelperFunction>({
  each: function (content: HelperBlock) {
    // helperStart is called with (params, id) but id isn't needed
    var res = ''
    var param = content.params[0]
    for (var i = 0; i < param.length; i++) {
      res += content.exec(param[i], i)
    }
    return res
  },
  foreach: function (content: HelperBlock) {
    var res = ''
    var param = content.params[0]
    for (var key in param) {
      if (!param.hasOwnProperty(key)) continue
      res += content.exec(key, param[key]) // todo: I think this is wrong?
    }
    return res
  },
  include: function (
    content: IncludeHelperBlock,
    blocks: Array<HelperBlock>,
    config: SqrlConfig
  ): string {
    // helperStart is called with (params, id) but id isn't needed
    if (blocks && blocks.length > 0) {
      throw SqrlErr("Helper 'include' doesn't accept blocks")
    }
    var template = templates.get(content.params[0])
    if (!template) {
      throw SqrlErr('Could not fetch template "' + content.params[0] + '"')
    }
    return template(content.params[1], config)
  } as HelperFunction
})

var nativeHelpers = new Cacher<Function>({
  if: function (buffer: ParentTemplateObject, env: SqrlConfig) {
    if (buffer.f && buffer.f.length) {
      throw SqrlErr("native helper 'if' can't have filters")
    }
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
    if (buffer.f && buffer.f.length) {
      throw SqrlErr("native helper 'try' can't have filters")
    }
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
