'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
    Cacher.prototype.reset = function () {
        this.cache = {};
    };
    Cacher.prototype.load = function (cacheObj) {
        for (var key in cacheObj) {
            if (cacheObj.hasOwnProperty(key)) {
                this.cache[key] = cacheObj[key];
            }
        }
    };
    return Cacher;
}());

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

// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
// TODO: only include trimLeft polyfill if not in ES6
function trimWS(str, env, wsLeft, wsRight) {
    var leftTrim;
    var rightTrim;
    if (typeof env.autoTrim === 'string') {
        leftTrim = rightTrim = env.autoTrim;
    }
    else if (Array.isArray(env.autoTrim)) {
        // kinda confusing
        // but _}} will trim the left side of the following string
        leftTrim = env.autoTrim[1];
        rightTrim = env.autoTrim[0];
    }
    if (wsLeft) {
        leftTrim = wsLeft;
    }
    if (wsRight) {
        rightTrim = wsRight;
    }
    if ((leftTrim === 'slurp' && rightTrim === 'slurp') ||
        (leftTrim === true && rightTrim === true)) {
        return str.trim();
    }
    if (leftTrim === '_' || leftTrim === 'slurp' || leftTrim === true) {
        // console.log('trimming left' + leftTrim)
        // full slurp
        if (String.prototype.trimLeft) {
            str = str.trimLeft();
        }
        else {
            str = str.replace(/^[\s\uFEFF\xA0]+/, '');
        }
    }
    else if (leftTrim === '-' || leftTrim === 'nl') {
        // console.log('trimming left nl' + leftTrim)
        // nl trim
        str = str.replace(/^(?:\n|\r|\r\n)/, '');
    }
    if (rightTrim === '_' || rightTrim === 'slurp' || rightTrim === true) {
        // console.log('trimming right' + rightTrim)
        // full slurp
        if (String.prototype.trimRight) {
            str = str.trimRight();
        }
        else {
            str = str.replace(/[\s\uFEFF\xA0]+$/, '');
        }
    }
    else if (rightTrim === '-' || rightTrim === 'nl') {
        // console.log('trimming right nl' + rightTrim)
        // nl trim
        str = str.replace(/(?:\n|\r|\r\n)$/, ''); // TODO: make sure this gets \r\n
    }
    return str;
}

// Version 1.0.32
// TODO: INFINITE LOOP WHEN YOU TYPE IN AN UNCLOSED HELPER
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
        function pushString(strng, shouldTrimRightPrecedingString) {
            if (strng) {
                var stringToPush = strng.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                stringToPush = trimWS(stringToPush, env, trimNextLeftWs, shouldTrimRightPrecedingString);
                if (stringToPush) {
                    buffer.push(stringToPush);
                }
            }
        }
        // Random TODO: parentObj.b doesn't need to have t: #
        var tagOpenMatch;
        // tslint:disable-next-line:no-conditional-assignment
        while ((tagOpenMatch = tagOpenReg.exec(str)) !== null) {
            var precedingString = tagOpenMatch[1];
            var shouldTrimRightPrecedingString = tagOpenMatch[2];
            pushString(precedingString, shouldTrimRightPrecedingString);
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
        else {
            throw SqrlErr('unclosed helper "' + parentObj.n + '"');
        }
        return parentObj;
    }
    var parseResult = parseContext({ f: [] }, true);
    // console.log(JSON.stringify(parseResult))
    return parseResult.d; // Parse the very outside context
}

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
                    content = "c.l('F','e')(" + content + ')';
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
                    var helperReturn = "c.l('H','" +
                        name +
                        "')(" +
                        parseHelper(env, res, currentBlock.d, params);
                    if (blocks) {
                        helperReturn += ',' + parseBlocks(blocks, env);
                    }
                    else {
                        helperReturn += ',[]';
                    }
                    helperReturn += ',c)';
                    returnStr += 'tR+=' + filter(helperReturn, filters) + ';';
                }
            }
            else if (type === 's') {
                returnStr +=
                    'tR+=' + filter("c.l('H','" + name + "')({params:[" + params + ']},[],c)', filters) + ';';
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
        str = "c.l('F','" + name + "')(" + str;
        if (params) {
            str += ',' + params;
        }
        str += ')';
    }
    return str;
}

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
            res += content.exec(key, param[key]); // todo: I think this is wrong?
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

var defaultConfig = {
    varName: 'it',
    autoTrim: [false, 'nl'],
    autoEscape: true,
    defaultFilter: false,
    tags: ['{{', '}}'],
    l: function (container, name) {
        if (container === 'H') {
            return Helpers.get(name);
        }
        else if (container === 'F') {
            return Filters.get(name);
        }
    },
    async: false,
    cache: false,
    plugins: {
        processAST: [],
        processFuncString: []
    }
};
function getConfig(override) {
    var res = {
        varName: defaultConfig.varName,
        autoTrim: defaultConfig.autoTrim,
        autoEscape: defaultConfig.autoEscape,
        defaultFilter: defaultConfig.defaultFilter,
        tags: defaultConfig.tags,
        l: defaultConfig.l,
        async: defaultConfig.async,
        cache: defaultConfig.cache,
        plugins: defaultConfig.plugins
    };
    for (var key in override) {
        if (override.hasOwnProperty(key)) {
            res[key] = override[key];
        }
    }
    return res;
}
// Have different envs. Sqrl.Render, Compile, etc. all use default env
// Use class for env

function Compile(str, env) {
    var Options = getConfig(env || {});
    var ctor; // constructor
    /* ASYNC HANDLING */
    // The below code is modified from mde/ejs. All credit should go to them.
    if (Options.async) {
        // Have to use generated function for this, since in envs without support,
        // it breaks in parsing
        try {
            ctor = new Function('return (async function(){}).constructor;')();
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                throw new Error('This environment does not support async/await');
            }
            else {
                throw e;
            }
        }
    }
    else {
        ctor = Function;
    }
    /* END ASYNC HANDLING */
    return new ctor(Options.varName, 'c', // SqrlConfig
    CompileToString(str, Options)); // eslint-disable-line no-new-func
}
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())

var fs = require('fs');
var path = require('path');
var _BOM = /^\uFEFF/;
/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String}  name       specified path
 * @param {String}  parentfile parent file path
 * @param {Boolean} [isDir=false] whether parent file path is a directory
 * @return {String}
 */
function getWholeFilePath(name, parentfile, isDirectory) {
    var includePath = path.resolve(isDirectory ? parentfile : path.dirname(parentfile), // returns directory the parent file is in
    name // file
    );
    var ext = path.extname(name);
    if (!ext) {
        includePath += '.sqrl';
    }
    return includePath;
}
/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
function getPath(path, options) {
    var includePath;
    var filePath;
    var views = options.views;
    var match = /^[A-Za-z]+:\\|^\//.exec(path);
    // Abs path
    if (match && match.length) {
        includePath = getWholeFilePath(path.replace(/^\/*/, ''), options.root || '/', true);
    }
    // Relative paths
    else {
        // Look relative to a passed filename first
        if (options.filename) {
            filePath = getWholeFilePath(path, options.filename);
            if (fs.existsSync(filePath)) {
                includePath = filePath;
            }
        }
        // Then look in any views directories
        if (!includePath) {
            if (Array.isArray(views) &&
                views.some(function (v) {
                    filePath = getWholeFilePath(path, v, true);
                    return fs.existsSync(filePath);
                })) {
                includePath = filePath;
            }
        }
        if (!includePath) {
            throw SqrlErr('Could not find the include file "' + path + '"');
        }
    }
    return includePath;
}
function readFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString()
        .replace(_BOM, ''); // TODO: is replacing BOM's necessary?
}
function loadFile(filePath, options) {
    var template = readFile(filePath);
    try {
        var compiledTemplate = Compile(template, options);
        Templates.define(options.filename, compiledTemplate);
        return compiledTemplate;
    }
    catch (e) {
        throw SqrlErr('Loading file: ' + filePath + ' failed');
    }
}

var promiseImpl = new Function('return this;')().Promise;
/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @param {Options} options   compilation options
 * @param {String} [template] template source
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 * @static
 */
function handleCache(options) {
    var filename = options.filename;
    if (options.cache) {
        var func = Templates.get(filename);
        if (func) {
            return func;
        }
        else {
            return loadFile(filename, options);
        }
    }
    return Compile(readFile(filename), options);
}
/**
 * Try calling handleCache with the given options and data and call the
 * callback with the result. If an error occurs, call the callback with
 * the error. Used by renderFile().
 *
 * @param {Options} options    compilation options
 * @param {Object} data        template data
 * @param {RenderFileCallback} cb callback
 * @static
 */
function tryHandleCache(options, data, cb) {
    var result;
    if (!cb) {
        // No callback, try returning a promise
        if (typeof promiseImpl == 'function') {
            return new promiseImpl(function (resolve, reject) {
                try {
                    result = handleCache(options)(data, options);
                    resolve(result);
                }
                catch (err) {
                    reject(err);
                }
            });
        }
        else {
            throw SqrlErr("Please provide a callback function, this env doesn't support Promises");
        }
    }
    else {
        try {
            result = handleCache(options)(data, options);
        }
        catch (err) {
            return cb(err);
        }
        cb(null, result);
    }
}
/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */
function includeFile(path, options) {
    // the below creates a new options object, using the parent filepath of the old options object and the path
    var newFileOptions = getConfig({ filename: getPath(path, options) });
    // TODO: update this to merge the old options
    return handleCache(newFileOptions);
}
function renderFile(filename, data, cb) {
    var Config = getConfig(data || {});
    // TODO: make sure above doesn't error. We do set filename down below
    if (data.settings) {
        // Pull a few things from known locations
        if (data.settings.views) {
            Config.views = data.settings.views;
        }
        if (data.settings['view cache']) {
            Config.cache = true;
        }
        // Undocumented after Express 2, but still usable, esp. for
        // items that are unsafe to be passed along with data, like `root`
        var viewOpts = data.settings['view options'];
        if (viewOpts) {
            for (var key in viewOpts) {
                if (viewOpts.hasOwnProperty(key)) {
                    Config[key] = viewOpts[key];
                }
            }
        }
    }
    Config.filename = filename; // Make sure filename is right
    return tryHandleCache(Config, data, cb);
}

function includeFileHelper(content, blocks, config) {
    // helperStart is called with (params, id) but id isn't needed
    if (blocks && blocks.length > 0) {
        throw SqrlErr("Helper 'include' doesn't accept blocks");
    }
    return includeFile(content.params[0], config)(content.params[1], config);
}
function includeHelper(content, blocks, config) {
    // helperStart is called with (params, id) but id isn't needed
    if (blocks && blocks.length > 0) {
        throw SqrlErr("Helper 'include' doesn't accept blocks");
    }
    var template = Templates.get(content.params[0]);
    if (!template) {
        throw SqrlErr('Could not fetch template "' + content.params[0] + '"');
    }
    return template(content.params[1], config);
}
// interface ExtendsHelperBlock extends HelperBlock {
//   params: [string, object]
// }
// interface ExtendsHelperNameBlock extends HelperBlock {
//   params: [string]
// }
// export function extendsHelper (
//   content: ExtendsHelperBlock,
//   blocks: Array<ExtendsHelperNameBlock>
// ): string {
//   // helperStart is called with (params, id) but id isn't needed
//   if (blocks && blocks.length > 0) {
//     throw SqrlErr("Helper 'extends' doesn't accept blocks")
//   }
//   var res = ''
//   var param = content.params[0]
//   for (var i = 0; i < param.length; i++) {
//     res += content.exec(param[i], i)
//   }
//   return res
// }
// export function extendsFileHelper (
//   content: ExtendsHelperBlock,
//   blocks: Array<ExtendsHelperNameBlock>
// ): string {
//   // helperStart is called with (params, id) but id isn't needed
//   if (blocks && blocks.length > 0) {
//     throw SqrlErr("Helper 'extends' doesn't accept blocks")
//   }
//   var res = ''
//   var param = content.params[0]
//   for (var i = 0; i < param.length; i++) {
//     res += content.exec(param[i], i)
//   }
//   return res
// }

function Render(template, data, env) {
    var Options = getConfig(env || {});
    var templateFunc;
    if (Options.cache && Options.name && Templates.get(Options.name)) {
        return Templates.get(Options.name)(data, Options);
    }
    if (typeof template === 'function') {
        templateFunc = template;
    }
    else {
        templateFunc = Compile(template, Options);
    }
    if (Options.cache && Options.name) {
        Templates.define(Options.name, templateFunc);
    }
    return templateFunc(data, Options);
}

// TODO: allow importing polyfills?
Helpers.define('include', includeHelper);
Helpers.define('includeFile', includeFileHelper);

exports.Compile = Compile;
exports.CompileToString = CompileToString;
exports.Filters = Filters;
exports.Helpers = Helpers;
exports.NativeHelpers = NativeHelpers;
exports.Parse = Parse;
exports.ParseScope = ParseScope;
exports.ParseScopeIntoFunction = ParseScopeIntoFunction;
exports.Render = Render;
exports.__express = renderFile;
exports.defaultConfig = defaultConfig;
exports.getConfig = getConfig;
exports.renderFile = renderFile;
//# sourceMappingURL=squirrelly.cjs.js.map
