'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function setPrototypeOf(obj, proto) {
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(obj, proto);
    }
    else {
        obj.__proto__ = proto;
    }
}
function EtaErr(message) {
    var err = new Error(message);
    setPrototypeOf(err, EtaErr.prototype);
    return err;
}
EtaErr.prototype = Object.create(Error.prototype, {
    name: { value: 'Eta Error', enumerable: false }
});
//# sourceMappingURL=err.js.map

// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
// TODO: only include trimLeft polyfill if not in ES6
/* END TYPES */
var promiseImpl = new Function('return this;')().Promise;
function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
function copyProps(toObj, fromObj, notConfig) {
    for (var key in fromObj) {
        if (hasOwnProp(fromObj, key)) {
            toObj[key] = fromObj[key];
        }
    }
    return toObj;
}
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
    if (wsLeft || wsLeft === false) {
        leftTrim = wsLeft;
    }
    if (wsRight || wsRight === false) {
        rightTrim = wsRight;
    }
    if (leftTrim === 'slurp' && rightTrim === 'slurp') {
        return str.trim();
    }
    if (leftTrim === '_' || leftTrim === 'slurp') {
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
    if (rightTrim === '_' || rightTrim === 'slurp') {
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
//# sourceMappingURL=utils.js.map

/* END TYPES */
function parse(str, env) {
    var buffer = [];
    var trimLeftOfNextStr = false;
    var lastIndex = 0;
    function pushString(strng, shouldTrimRightOfString) {
        if (strng) {
            // if string is truthy it must be of type 'string'
            var stringToPush = strng.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            // TODO: benchmark replace( /(\\|')/g, '\\$1')
            stringToPush = trimWS(stringToPush, env, trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
            shouldTrimRightOfString);
            console.log('str to push is');
            console.log(stringToPush.length);
            if (stringToPush) {
                buffer.push(stringToPush);
            }
        }
    }
    var prefixArr = [];
    if (env.parse.exec) {
        prefixArr.push(env.parse.exec);
    }
    if (env.parse.interpolate) {
        prefixArr.push(env.parse.interpolate);
    }
    if (env.parse.raw) {
        prefixArr.push(env.parse.raw);
    }
    var parseReg = new RegExp('([^]*?)' +
        env.tags[0] +
        '(-|_)?\\s*(' +
        prefixArr.join('|') +
        ')?\\s*((?:[^]*?(?:\'(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r\'\\\\])*?\'|`(?:\\\\[\\s\\w"\'\\\\`]|[^\\\\`])*?`|"(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r"\\\\])*?"|\\/\\*[^]*?\\*\\/)?)*?)\\s*(-|_)?' +
        env.tags[1], 'g');
    // TODO: benchmark having the \s* on either side vs using str.trim()
    var m;
    while ((m = parseReg.exec(str)) !== null) {
        lastIndex = m[0].length + m.index;
        var i = m.index;
        console.log(m);
        console.log('hey');
        var precedingString = m[1];
        var wsLeft = m[2];
        var prefix = m[3] || ''; // by default either ~, =, or empty
        var content = m[4];
        pushString(precedingString, wsLeft);
        trimLeftOfNextStr = m[5];
        // if i is 0, we're gonna set I do
        var currentType = '';
        if (prefix === env.parse.exec) {
            currentType = 'e';
        }
        else if (prefix === env.parse.raw) {
            currentType = 'r';
        }
        else if (prefix === env.parse.interpolate) {
            currentType = 'i';
        }
        buffer.push({ t: currentType, val: content });
    }
    pushString(str.slice(lastIndex, str.length), false);
    if (env.plugins) {
        for (var i = 0; i < env.plugins.length; i++) {
            var plugin = env.plugins[i];
            if (plugin.processAST) {
                buffer = plugin.processAST(buffer, env);
            }
        }
    }
    return buffer;
}

/* END TYPES */
function compileToString(str, env) {
    var buffer = parse(str, env);
    var res = "var tR='';" +
        (env.useWith ? 'with(' + env.varName + '||{}){' : '') +
        compileScope(buffer)
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r') +
        'if(cb){cb(null,tR)} return tR' +
        (env.useWith ? '}' : '');
    if (env.plugins) {
        for (var i = 0; i < env.plugins.length; i++) {
            var plugin = env.plugins[i];
            if (plugin.processFnString) {
                res = plugin.processFnString(res, env);
            }
        }
    }
    return res;
    // TODO: is `return cb()` necessary, or could we just do `cb()`
}
function compileScope(buff, env) {
    var i = 0;
    var buffLength = buff.length;
    var returnStr = '';
    for (i; i < buffLength; i++) {
        var currentBlock = buff[i];
        if (typeof currentBlock === 'string') {
            var str = currentBlock;
            // we know string exists
            returnStr += "tR+='" + str + "';";
        }
        else {
            var type = currentBlock.t; // ~, s, !, ?, r
            var content = currentBlock.val || '';
            if (type === 'i') {
                returnStr += 'tR+=' + content + ';';
            }
            else if (type === 'r') {
                returnStr = 'tR+=E.e(' + content + ')';
                // reference
            }
            else if (type === 'e') {
                // execute
                returnStr += content;
            }
        }
    }
    return returnStr;
}

/* END TYPES */
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
        // TODO: this will err with deep objects and `storage` or `plugins` keys.
        // Update Feb 26: EDITED so it shouldn't err
        copyProps(this.cache, cacheObj);
    };
    return Cacher;
}());
//# sourceMappingURL=storage.js.map

/* END TYPES */
var templates = new Cacher({});
//# sourceMappingURL=containers.js.map

/* END TYPES */
var defaultConfig = {
    varName: 'it',
    autoTrim: [false, 'nl'],
    autoEscape: true,
    tags: ['{{', '}}'],
    parse: {
        interpolate: '=',
        raw: '~',
        exec: ''
    },
    async: false,
    templates: templates,
    cache: false,
    plugins: [],
    useWith: false,
    e: XMLEscape
};
function getConfig(override, baseConfig) {
    // TODO: run more tests on this
    var res = {}; // Linked
    copyProps(res, defaultConfig); // Creates deep clone of res, 1 layer deep
    if (baseConfig) {
        copyProps(res, baseConfig);
    }
    if (override) {
        copyProps(res, override);
    }
    return res;
}
//# sourceMappingURL=config.js.map

/* END TYPES */
function compile(str, env) {
    var options = getConfig(env || {});
    var ctor; // constructor
    /* ASYNC HANDLING */
    // The below code is modified from mde/ejs. All credit should go to them.
    if (options.async) {
        // Have to use generated function for this, since in envs without support,
        // it breaks in parsing
        try {
            ctor = new Function('return (async function(){}).constructor;')();
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                throw new Error("This environment doesn't support async/await");
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
    try {
        return new ctor(options.varName, 'E', // EtaConfig
        'cb', // optional callback
        compileToString(str, options)); // eslint-disable-line no-new-func
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr('Bad template syntax\n\n' +
                e.message +
                '\n' +
                Array(e.message.length + 1).join('=') +
                '\n' +
                compileToString(str, options));
        }
        else {
            throw e;
        }
    }
}
//# sourceMappingURL=compile.js.map

var fs = require('fs');
var path = require('path');
var _BOM = /^\uFEFF/;
function readFile(filePath) {
    return fs
        .readFileSync(filePath)
        .toString()
        .replace(_BOM, ''); // TODO: is replacing BOM's necessary?
}
function loadFile(filePath, options) {
    var config = getConfig(options);
    var template = readFile(filePath);
    try {
        var compiledTemplate = compile(template, config);
        config.storage.templates.define(config.filename, compiledTemplate);
        return compiledTemplate;
    }
    catch (e) {
        throw EtaErr('Loading file: ' + filePath + ' failed');
    }
}
//# sourceMappingURL=file-utils.js.map

// express is set like: app.engine('html', require('eta').renderFile)
/* END TYPES */
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
        var func = options.storage.templates.get(filename);
        if (func) {
            return func;
        }
        else {
            return loadFile(filename, options);
        }
    }
    return compile(readFile(filename), options);
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
        if (typeof promiseImpl === 'function') {
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
            throw EtaErr("Please provide a callback function, this env doesn't support Promises");
        }
    }
    else {
        try {
            handleCache(options)(data, options, cb);
        }
        catch (err) {
            return cb(err);
        }
    }
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
            copyProps(Config, viewOpts);
        }
    }
    Config.filename = filename; // Make sure filename is right
    return tryHandleCache(Config, data, cb);
}
//# sourceMappingURL=file-handlers.js.map

/* END TYPES */
function handleCache$1(template, options) {
    var templateFunc;
    if (options.cache && options.name && options.storage.templates.get(options.name)) {
        return options.storage.templates.get(options.name);
    }
    if (typeof template === 'function') {
        templateFunc = template;
    }
    else {
        templateFunc = compile(template, options);
    }
    if (options.cache && options.name) {
        options.storage.templates.define(options.name, templateFunc);
    }
    return templateFunc;
}
function render(template, data, env, cb) {
    var options = getConfig(env || {});
    if (options.async) {
        var result;
        if (!cb) {
            // No callback, try returning a promise
            if (typeof promiseImpl === 'function') {
                return new promiseImpl(function (resolve, reject) {
                    try {
                        result = handleCache$1(template, options)(data, options);
                        resolve(result);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            }
            else {
                throw EtaErr("Please provide a callback function, this env doesn't support Promises");
            }
        }
        else {
            try {
                handleCache$1(template, options)(data, options, cb);
            }
            catch (err) {
                return cb(err);
            }
        }
    }
    else {
        return handleCache$1(template, options)(data, options);
    }
}
//# sourceMappingURL=render.js.map

exports.__express = renderFile;
exports.compile = compile;
exports.compileToString = compileToString;
exports.defaultConfig = defaultConfig;
exports.getConfig = getConfig;
exports.loadFile = loadFile;
exports.parse = parse;
exports.render = render;
exports.renderFile = renderFile;
exports.templates = templates;
//# sourceMappingURL=eta.cjs.js.map
