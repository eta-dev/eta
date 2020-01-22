// v 1.0.32
function setPrototypeOf(obj, proto) {
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(obj, proto);
    }
    else {
        obj.__proto__ = proto;
    }
}
function SqrlErr(message) {
    var err = new Error(message);
    setPrototypeOf(err, SqrlErr.prototype);
    return err;
}
SqrlErr.prototype = Object.create(Error.prototype, {
    name: { value: 'Squirrelly Error', enumerable: false }
});
// TODO: Class transpilation adds a lot to the bundle size
function ParseErr(message, str, indx) {
    var whitespace = str
        .slice(0, indx) // +2 because of {{
        .split(/\n/);
    // console.log('whitespace: \n' + JSON.stringify(whitespace))
    var lineNo = whitespace.length;
    var colNo = whitespace[lineNo - 1].length + 1;
    message +=
        ' at line ' +
            lineNo +
            ' col ' +
            colNo +
            ':\n\n' +
            '  ' +
            str.split(/\n/)[lineNo - 1] +
            '\n' +
            '  ' +
            Array(colNo).join(' ') +
            '^';
    throw SqrlErr(message);
}

/**
 * Trims either one whitespace character from the beginning of a string, or all
 *
 * @remarks
 * Includes trimLeft polyfill
 *
 * @param str - String to trim
 * @param type - Either '-' (trim only 1 whitespace char) or '_' (trim all whitespace)
 * @returns Trimmed string
 *
 */
// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
// TODO: only include trimLeft polyfill if not in ES6
function trimLeft(str, type) {
    if (type === '_') {
        // full slurp
        if (String.prototype.trimLeft) {
            return str.trimLeft();
        }
        else {
            return str.replace(/^[\s\uFEFF\xA0]+/, '');
        }
    }
    else {
        // type must be '-'
        return str.replace(/^(?:[\s\uFEFF\xA0]|\r\n)/, '');
    }
}
/**
 * Trims either one whitespace character from the end of the string, or all
 *
 * @remarks
 * Includes trimRight polyfill
 *
 * @param str - String to trim
 * @param type - Either '-' (trim only 1 whitespace char) or '_' (trim all whitespace)
 * @returns Trimmed string
 *
 */
function trimRight(str, type) {
    if (type === '_') {
        // full slurp
        if (String.prototype.trimRight) {
            return str.trimRight();
        }
        else {
            return str.replace(/[\s\uFEFF\xA0]+$/, '');
        }
    }
    else {
        // type must be '-'
        return str.replace(/(?:[\s\uFEFF\xA0]|\r\n)$/, ''); // TODO: make sure this gets \r\n
    }
}

// Version 1.0.32
function Parse(str, env) {
    var powerchars = new RegExp('([|()]|=>)|' +
        '\'(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r\'\\\\])*?\'|`(?:\\\\[\\s\\w"\'\\\\`]|[^\\\\`])*?`|"(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r"\\\\])*?"' + // matches strings
        '|\\/\\*[^]*?\\*\\/|((\\/)?(-|_)?' +
        env.tags[1] +
        ')', 'g');
    var tagOpenReg = new RegExp('([^]*?)' + env.tags[0] + '(-|_)?\\s*', 'g');
    var startInd = 0;
    var trimNextLeftWs = '';
    function parseTag() {
        // console.log(JSON.stringify(match))
        var currentObj = { f: [] };
        var numParens = 0;
        var firstChar = str[startInd];
        var currentAttribute = 'c'; // default - Valid values: 'c'=content, 'f'=filter, 'fp'=filter params, 'p'=param, 'n'=name
        var currentType = 'r'; // Default
        startInd += 1; // assume we're gonna skip the first character
        if (firstChar === '~' || firstChar === '#' || firstChar === '/') {
            currentAttribute = 'n';
            currentType = firstChar;
        }
        else if (firstChar === '!' || firstChar === '?') {
            // ? for custom
            currentType = firstChar;
        }
        else if (firstChar === '*') {
            currentObj.raw = true;
        }
        else {
            startInd -= 1;
        }
        function addAttrValue(indx) {
            var valUnprocessed = str.slice(startInd, indx);
            // console.log(valUnprocessed)
            var val = valUnprocessed.trim();
            if (currentAttribute === 'f') {
                if (val === 'safe') {
                    currentObj.raw = true;
                }
                else {
                    currentObj.f.push([val, '']);
                }
            }
            else if (currentAttribute === 'fp') {
                currentObj.f[currentObj.f.length - 1][1] += val;
            }
            else if (currentAttribute === 'err') {
                if (val) {
                    var found = valUnprocessed.search(/\S/);
                    ParseErr('invalid syntax', str, startInd + found);
                }
            }
            else {
                // if (currentObj[currentAttribute]) { // TODO make sure no errs
                //   currentObj[currentAttribute] += val
                // } else {
                currentObj[currentAttribute] = val;
                // }
            }
            startInd = indx + 1;
        }
        powerchars.lastIndex = startInd;
        var m;
        // tslint:disable-next-line:no-conditional-assignment
        while ((m = powerchars.exec(str)) !== null) {
            var char = m[1];
            var tagClose = m[2];
            var slash = m[3];
            var wsControl = m[4];
            var i = m.index;
            if (char) {
                // Power character
                if (char === '(') {
                    if (numParens === 0) {
                        if (currentAttribute === 'n') {
                            addAttrValue(i);
                            currentAttribute = 'p';
                        }
                        else if (currentAttribute === 'f') {
                            addAttrValue(i);
                            currentAttribute = 'fp';
                        }
                    }
                    numParens++;
                }
                else if (char === ')') {
                    numParens--;
                    if (numParens === 0 && currentAttribute !== 'c') {
                        // Then it's closing a filter, block, or helper
                        addAttrValue(i);
                        currentAttribute = 'err'; // Reset the current attribute
                    }
                }
                else if (numParens === 0 && char === '|') {
                    addAttrValue(i); // this should actually always be whitespace or empty
                    currentAttribute = 'f';
                }
                else if (char === '=>') {
                    addAttrValue(i);
                    startInd += 1; // this is 2 chars
                    currentAttribute = 'res';
                }
            }
            else if (tagClose) {
                addAttrValue(i);
                startInd = i + m[0].length;
                tagOpenReg.lastIndex = startInd;
                // console.log('tagClose: ' + startInd)
                trimNextLeftWs = wsControl;
                if (slash && currentType === '~') {
                    currentType = 's';
                } // TODO throw err
                currentObj.t = currentType;
                return currentObj;
            }
        }
        // TODO: Do I need this?
        ParseErr('unclosed tag', str, str.length);
        return currentObj; // To prevent TypeScript from erroring
    }
    function parseContext(parentObj, firstParse) {
        parentObj.b = []; // assume there will be blocks // TODO: perf optimize this
        parentObj.d = [];
        var lastBlock = false;
        var buffer = [];
        function pushString(strng, wsAhead) {
            if (strng) {
                var stringToPush = strng.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                if (wsAhead) {
                    stringToPush = trimRight(stringToPush, wsAhead);
                }
                if (trimNextLeftWs) {
                    stringToPush = trimLeft(stringToPush, trimNextLeftWs);
                    trimNextLeftWs = '';
                }
                buffer.push(stringToPush);
            }
        }
        // Random TODO: parentObj.b doesn't need to have t: #
        var tagOpenMatch;
        // tslint:disable-next-line:no-conditional-assignment
        while ((tagOpenMatch = tagOpenReg.exec(str)) !== null) {
            var precedingString = tagOpenMatch[1];
            var ws = tagOpenMatch[2];
            pushString(precedingString, ws);
            startInd = tagOpenMatch.index + tagOpenMatch[0].length;
            var currentObj = parseTag();
            // ===== NOW ADD THE OBJECT TO OUR BUFFER =====
            var currentType = currentObj.t;
            if (currentType === '~') {
                currentObj = parseContext(currentObj); // currentObj is the parent object
                buffer.push(currentObj);
            }
            else if (currentType === '/') {
                if (parentObj.n === currentObj.n) {
                    if (lastBlock) {
                        // If there's a previous block
                        lastBlock.d = buffer;
                        parentObj.b.push(lastBlock);
                    }
                    else {
                        parentObj.d = buffer;
                    }
                    // console.log('parentObj: ' + JSON.stringify(parentObj))
                    return parentObj;
                }
                else {
                    ParseErr("Helper start and end don't match", str, tagOpenMatch.index + tagOpenMatch[0].length);
                }
            }
            else if (currentType === '#') {
                if (lastBlock) {
                    // If there's a previous block
                    lastBlock.d = buffer;
                    parentObj.b.push(lastBlock);
                }
                else {
                    parentObj.d = buffer;
                }
                lastBlock = currentObj; // Set the 'lastBlock' object to the value of the current block
                buffer = [];
            }
            else {
                buffer.push(currentObj);
            }
            // ===== DONE ADDING OBJECT TO BUFFER =====
        }
        if (firstParse) {
            // TODO: more intuitive
            pushString(str.slice(startInd, str.length));
            parentObj.d = buffer;
        }
        return parentObj;
    }
    var parseResult = parseContext({ f: [] }, true);
    // console.log(JSON.stringify(parseResult))
    return parseResult.d; // Parse the very outside context
}

var Cacher = /** @class */ (function () {
    function Cacher(cache) {
        this.cache = cache;
    }
    Cacher.prototype.define = function (key, val) {
        this.cache[key] = val;
    };
    Cacher.prototype.get = function (key) {
        // string | array.
        // TODO: allow array of keys to look down
        // TODO: create plugin to allow referencing helpers, filters with dot notation
        return this.cache[key];
    };
    Cacher.prototype.remove = function (key) {
        delete this.cache[key];
    };
    Cacher.prototype.clear = function () {
        this.cache = {};
    };
    Cacher.prototype.load = function (cacheObj) {
        this.cache = cacheObj;
    };
    return Cacher;
}());

// interface ITemplate {
//   exec: (options: object, Sqrl: object) => string
// }
var Templates = new Cacher({});
var Helpers = new Cacher({
    each: function (content) {
        // helperStart is called with (params, id) but id isn't needed
        var res = '';
        var param = content.params[0];
        for (var i = 0; i < param.length; i++) {
            res += content.exec(param[i], i);
        }
        return res;
    },
    foreach: function (content) {
        var res = '';
        var param = content.params[0];
        for (var key in param) {
            if (!param.hasOwnProperty(key))
                continue;
            res += content.exec(param, key); // todo: I think this is wrong?
        }
        return res;
    }
});
var NativeHelpers = new Cacher({
    if: function (buffer, env) {
        if (buffer.f && buffer.f.length) {
            throw SqrlErr("native helper 'if' can't have filters");
        }
        var returnStr = 'if(' + buffer.p + '){' + ParseScope(buffer.d, env) + '}';
        if (buffer.b) {
            for (var i = 0; i < buffer.b.length; i++) {
                var currentBlock = buffer.b[i];
                if (currentBlock.n === 'else') {
                    returnStr += 'else{' + ParseScope(currentBlock.d, env) + '}';
                }
                else if (currentBlock.n === 'elif') {
                    returnStr += 'else if(' + currentBlock.p + '){' + ParseScope(currentBlock.d, env) + '}';
                }
            }
        }
        return returnStr;
    },
    try: function (buffer, env) {
        if (buffer.f && buffer.f.length) {
            throw SqrlErr("native helper 'try' can't have filters");
        }
        if (!buffer.b || buffer.b.length !== 1 || buffer.b[0].n !== 'catch') {
            throw SqrlErr("native helper 'try' only accepts 1 block, 'catch'");
        }
        var returnStr = 'try{' + ParseScope(buffer.d, env) + '}';
        var currentBlock = buffer.b[0];
        returnStr +=
            'catch' +
                (currentBlock.res ? '(' + currentBlock.res + ')' : '') +
                '{' +
                ParseScope(currentBlock.d, env) +
                '}';
        return returnStr;
    }
});
var escMap = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#39;'
};
function replaceChar(s) {
    return escMap[s];
}
function XMLEscape(str) {
    // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
    var newStr = String(str);
    if (/[&<"']/.test(newStr)) {
        return newStr.replace(/[&<"']/g, replaceChar);
    }
    else {
        return newStr;
    }
}
var Filters = new Cacher({ e: XMLEscape });

function CompileToString(str, env) {
    var buffer = Parse(str, env);
    return ("var tR='';" +
        ParseScope(buffer, env)
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r') +
        'return tR');
}
// TODO: rename parseHelper, parseScope, etc. to compileHelper, compileScope, etc.
// TODO: Use type intersections for TemplateObject, etc.
// so I don't have to make properties mandatory
function parseHelper(env, res, descendants, params, name) {
    var ret = '{exec:' + ParseScopeIntoFunction(descendants, res, env) + ',params:[' + params + ']';
    if (name) {
        ret += ",name:'" + name + "'";
    }
    ret += '}';
    return ret;
}
function parseBlocks(blocks, env) {
    var ret = '[';
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        ret += parseHelper(env, block.res || '', block.d, block.p || '', block.n);
        if (i < blocks.length) {
            ret += ',';
        }
    }
    ret += ']';
    return ret;
}
function ParseScopeIntoFunction(buff, res, env) {
    return 'function(' + res + "){var tR='';" + ParseScope(buff, env) + 'return tR}';
}
function ParseScope(buff, env) {
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
            var filters = currentBlock.f;
            var name = currentBlock.n || '';
            var params = currentBlock.p || '';
            var res = currentBlock.res || '';
            var blocks = currentBlock.b;
            if (type === 'r') {
                if (!currentBlock.raw && env.autoEscape) {
                    content = "l('F','e')(" + content + ')';
                }
                var filtered = filter(content, filters);
                returnStr += 'tR+=' + filtered + ';';
                // reference
            }
            else if (type === '~') {
                // helper
                // TODO: native helpers
                if (NativeHelpers.get(name)) {
                    returnStr += NativeHelpers.get(name)(currentBlock, env);
                }
                else {
                    var helperReturn = "l('H','" +
                        name +
                        "')(" +
                        parseHelper(env, res, currentBlock.d, params);
                    if (blocks) {
                        helperReturn += ',' + parseBlocks(blocks, env);
                    }
                    helperReturn += ')';
                    returnStr += 'tR+=' + filter(helperReturn, filters) + ';';
                }
            }
            else if (type === 's') {
                returnStr += 'tR+=' + filter("l('H','" + name + "')(" + params + ')', filters) + ';';
                // self-closing helper
            }
            else if (type === '!') {
                // execute
                returnStr += content + ';';
            }
        }
    }
    return returnStr;
}
function filter(str, filters) {
    for (var i = 0; i < filters.length; i++) {
        var name = filters[i][0];
        var params = filters[i][1];
        str = "l('F','" + name + "')(" + str;
        if (params) {
            str += ',' + params;
        }
        str += ')';
    }
    return str;
}

var defaultConfig = {
    varName: 'it',
    autoTrim: false,
    autoEscape: true,
    defaultFilter: false,
    tags: ['{{', '}}'],
    loadFunction: function (container, name) {
        if (container === 'T') {
            return Templates.get(name);
        }
        else if (container === 'H') {
            return Helpers.get(name);
        }
        else if (container === 'F') {
            return Filters.get(name);
        }
    },
    plugins: {
        processAST: [],
        processFuncString: []
    }
};
var Env = {
    cache: {
        default: defaultConfig
    },
    define: function (key, newConfig) {
        if (!this.cache[key]) {
            this.cache[key] = defaultConfig;
        }
        for (var attrname in newConfig) {
            this.cache[key][attrname] = newConfig[attrname];
        }
    },
    get: function (key) {
        // string | array.
        // TODO: allow array of keys to look down
        return this.cache[key];
    },
    remove: function (key) {
        delete this.cache[key];
    },
    clear: function () {
        this.cache = {};
    },
    load: function (cacheObj) {
        this.cache = cacheObj;
    }
};
// Have different envs. Sqrl.Render, Compile, etc. all use default env
// Use class for env

function Compile(str, env) {
    var SqrlEnv = Env.get('default');
    if (env && typeof env === 'string') {
        SqrlEnv = Env.get(env);
    }
    else if (env && typeof env === 'object') {
        SqrlEnv = env;
    }
    return new Function(SqrlEnv.varName, 'l', // this fetches helpers, partials, etc.
    CompileToString(str, SqrlEnv)); // eslint-disable-line no-new-func
}
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())

function Render(template, data, env, options) {
    var Config = Env.get('default');
    if (typeof env === 'function') {
        env = env(options); // this can be used to dynamically pick an env based on name, etc.
    }
    if (typeof env === 'object') {
        Config = env;
    }
    else if (typeof env === 'string' && env.length) {
        Config = Env.get(env);
    }
    if (typeof template === 'function') {
        return template(data, Config.loadFunction);
    }
    // else
    var templateFunc = Compile(template, Config);
    return templateFunc(data, Config.loadFunction);
}

export { Compile, CompileToString, Env, Filters, Helpers, NativeHelpers, Parse, ParseScope, ParseScopeIntoFunction, Render };
//# sourceMappingURL=squirrelly.es.js.map
