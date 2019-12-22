import Parse, { AstObject, Filter, TemplateObject } from './parse'

function CompileToString (str: string, tagOpen: string, tagClose: string) {
  var buffer: Array<AstObject> = Parse(str, tagOpen, tagClose)
  return ParseScope(buffer)
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
}

function parseHelper (res: string, descendants: Array<AstObject>, params: string, name?: string) {
  var ret = '{exec:function(' + res + '){' + ParseScope(descendants) + '},params:[' + params + ']'
  if (name) {
    ret += ",name:'" + name + "'"
  }
  ret += '}'
  return ret
}

function parseBlocks (blocks: Array<TemplateObject>) {
  var ret = '['
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i]
    ret += parseHelper(block.res || '', block.d || [], block.p || '', block.n || '')
    if (i < blocks.length) {
      ret += ','
    }
  }
  ret += ']'
  return ret
}

function ParseScope (buff: Array<AstObject>) {
  var i = 0
  var buffLength = buff.length
  var returnStr = "var tR='';"

  for (i; i < buffLength; i++) {
    var currentBlock = buff[i]
    if (typeof currentBlock === 'string') {
      var str = currentBlock

      // we know string exists
      returnStr += "tR+='" + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "';"
    } else {
      var type = currentBlock.t // ~, s, !, ?, r
      var content = currentBlock.c || ''
      var filters = currentBlock.f || []
      var name = currentBlock.n || ''
      var params = currentBlock.p || ''
      var res = currentBlock.res || ''
      var blocks = currentBlock.b || []

      if (type === 'r') {
        var filtered = filter(content, filters)
        returnStr += 'tR+=' + filtered + ';'
        // reference
      } else if (type === '~') {
        // helper
        // TODO: native helpers
        var helperReturn = "Sqrl.H['" + name + "'](" + parseHelper(res, currentBlock.d, params)
        if (blocks) {
          helperReturn += ',' + parseBlocks(blocks)
        }
        helperReturn += ')'

        helperReturn = filter(helperReturn, filters)
        returnStr += 'tR+=' + helperReturn + ';'
      } else if (type === 's') {
        returnStr += 'tR+=' + filter("Sqrl.H['" + name + "'](" + params + ')', filters) + ';'
        // self-closing helper
      } else if (type === '!') {
        // execute
        returnStr += content + ';'
      } else if (type === '?') {
        // custom (implement later)
      }
    }
  }
  return returnStr + 'return tR'
}

function filter (str: string, filters: Array<Filter>) {
  for (var i = 0; i < filters.length; i++) {
    var name = filters[i][0]
    var params = filters[i][1]
    str = "Sqrl.F['" + name + "'](" + str
    if (params) {
      str += ',' + params
    }
    str += ')'
  }
  return str
}

export default CompileToString
