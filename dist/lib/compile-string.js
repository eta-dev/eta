import Parse from './parse';
import { NativeHelpers } from './containers';
function CompileToString(str, tagOpen, tagClose) {
    var buffer = Parse(str, tagOpen, tagClose);
    return ("var tR='';" +
        ParseScope(buffer)
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r') +
        'return tR');
}
// TODO: rename parseHelper, parseScope, etc. to compileHelper, compileScope, etc.
// TODO: Use type intersections for TemplateObject, etc.
// so I don't have to make properties mandatory
function parseHelper(res, descendants, params, name) {
    var ret = '{exec:' + ParseScopeIntoFunction(descendants, res) + ',params:[' + params + ']';
    if (name) {
        ret += ",name:'" + name + "'";
    }
    ret += '}';
    return ret;
}
function parseBlocks(blocks) {
    var ret = '[';
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        ret += parseHelper(block.res || '', block.d || [], block.p || '', block.n || '');
        if (i < blocks.length) {
            ret += ',';
        }
    }
    ret += ']';
    return ret;
}
export function ParseScopeIntoFunction(buff, res) {
    return 'function(' + res + "){var tR='';" + ParseScope(buff) + 'return tR}';
}
export function ParseScope(buff) {
    var i = 0;
    var buffLength = buff.length;
    var returnStr = '';
    for (i; i < buffLength; i++) {
        var currentBlock = buff[i];
        if (typeof currentBlock === 'string') {
            var str = currentBlock;
            // we know string exists
            returnStr += "tR+='" + str /*.replace(/\\/g, '\\\\').replace(/'/g, "\\'")*/ + "';";
            // I believe the above replace is already in Parse
        }
        else {
            var type = currentBlock.t; // ~, s, !, ?, r
            var content = currentBlock.c || '';
            var filters = currentBlock.f || [];
            var name = currentBlock.n || '';
            var params = currentBlock.p || '';
            var res = currentBlock.res || '';
            var blocks = currentBlock.b || [];
            if (type === 'r') {
                var filtered = filter(content, filters);
                returnStr += 'tR+=' + filtered + ';';
                // reference
            }
            else if (type === '~') {
                // helper
                // TODO: native helpers
                if (NativeHelpers.get(name)) {
                    returnStr += NativeHelpers.get(name)(currentBlock);
                }
                else {
                    var helperReturn = "Sqrl.H.get('" + name + "')(" + parseHelper(res, currentBlock.d, params);
                    if (blocks) {
                        helperReturn += ',' + parseBlocks(blocks);
                    }
                    helperReturn += ')';
                    helperReturn = filter(helperReturn, filters);
                    returnStr += 'tR+=' + helperReturn + ';';
                }
            }
            else if (type === 's') {
                returnStr += 'tR+=' + filter("Sqrl.H.get('" + name + "')(" + params + ')', filters) + ';';
                // self-closing helper
            }
            else if (type === '!') {
                // execute
                returnStr += content + ';';
            }
            else if (type === '?') {
                // custom (implement later)
            }
        }
    }
    return returnStr;
}
function filter(str, filters) {
    for (var i = 0; i < filters.length; i++) {
        var name = filters[i][0];
        var params = filters[i][1];
        str = "Sqrl.F.get('" + name + "')(" + str;
        if (params) {
            str += ',' + params;
        }
        str += ')';
    }
    return str;
}
export default CompileToString;
//# sourceMappingURL=compile-string.js.map