import { Cacher } from './storage'
import { AstObject, Filter, TemplateObject, ParentTemplateObject } from './parse'
import SqrlErr from './err'
import { ParseScope } from './compile-string'
import { SqrlConfig } from './config'

type TemplateFunction = (
  options: object,
  l: (container: 'T' | 'H' | 'F', name: string) => any
) => string

// interface ITemplate {
//   exec: (options: object, Sqrl: object) => string
// }

var Templates = new Cacher<TemplateFunction>({})

interface HelperBlock {
  exec: Function
  params: Array<any>
}
type HelperFunction = (content: HelperBlock, blocks: Array<HelperBlock>) => string

var Helpers = new Cacher<HelperFunction>({
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
  }
})

var NativeHelpers = new Cacher<Function>({
  if: function (buffer: ParentTemplateObject, env: SqrlConfig) {
    if (buffer.f && buffer.f.length) {
      throw SqrlErr("native helper 'if' can't have filters")
    }
    var returnStr = 'if(' + buffer.p + '){' + ParseScope(buffer.d, env) + '}'
    if (buffer.b) {
      for (var i = 0; i < buffer.b.length; i++) {
        var currentBlock = buffer.b[i] as ParentTemplateObject
        if (currentBlock.n === 'else') {
          returnStr += 'else{' + ParseScope(currentBlock.d, env) + '}'
        } else if (currentBlock.n === 'elif') {
          returnStr += 'else if(' + currentBlock.p + '){' + ParseScope(currentBlock.d, env) + '}'
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
    var returnStr = 'try{' + ParseScope(buffer.d, env) + '}'

    var currentBlock = buffer.b[0] as ParentTemplateObject
    returnStr +=
      'catch' +
      (currentBlock.res ? '(' + currentBlock.res + ')' : '') +
      '{' +
      ParseScope(currentBlock.d, env) +
      '}'

    return returnStr
  }
})

type FilterFunction = (str: string) => string

interface EscapeMap {
  '&': '&amp;'
  '<': '&lt;'
  '"': '&quot;'
  "'": '&#39;'
  [index: string]: string
}

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

var Filters = new Cacher<FilterFunction>({ e: XMLEscape })

export { Templates, Helpers, NativeHelpers, Filters }
