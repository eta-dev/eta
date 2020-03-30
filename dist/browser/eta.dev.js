(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Eta = {}));
}(this, (function (exports) { 'use strict';

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
  // TODO: Class transpilation adds a lot to the bundle size
  function ParseErr(message, str, indx) {
      var whitespace = str.slice(0, indx).split(/\n/);
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
      throw EtaErr(message);
  }

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

  /* END TYPES */
  function parse(str, env) {
      var buffer = [];
      var trimLeftOfNextStr = false;
      var lastIndex = 0;
      function pushString(strng, shouldTrimRightOfString) {
          if (strng) {
              // if string is truthy it must be of type 'string'
              // replace \ with \\, ' with \'
              // TODO: benchmark replace( /(\\|')/g, '\\$1')
              strng = trimWS(strng, env, trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
              shouldTrimRightOfString);
              if (strng) {
                  strng = strng
                      .replace(/\\|'/g, '\\$&')
                      .replace(/\n/g, '\\n')
                      .replace(/\r/g, '\\r');
                  buffer.push(strng);
              }
          }
      }
      var prefixes = (env.parse.exec + env.parse.interpolate + env.parse.raw).split('').join('|');
      var parseOpenReg = new RegExp('([^]*?)' + env.tags[0] + '(-|_)?\\s*(' + prefixes + ')?\\s*', 'g');
      var parseCloseReg = new RegExp('\'(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r\'\\\\])*?\'|`(?:\\\\[\\s\\w"\'\\\\`]|[^\\\\`])*?`|"(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r"\\\\])*?"|\\/\\*[^]*?\\*\\/|(\\s*(-|_)?' +
          env.tags[1] +
          ')', 'g');
      // TODO: benchmark having the \s* on either side vs using str.trim()
      var m;
      while ((m = parseOpenReg.exec(str)) !== null) {
          lastIndex = m[0].length + m.index;
          var precedingString = m[1];
          var wsLeft = m[2];
          var prefix = m[3] || ''; // by default either ~, =, or empty
          pushString(precedingString, wsLeft);
          parseCloseReg.lastIndex = lastIndex;
          var closeTag;
          var currentObj;
          while ((closeTag = parseCloseReg.exec(str)) !== null) {
              if (closeTag[1]) {
                  var content = str.slice(lastIndex, closeTag.index);
                  parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;
                  trimLeftOfNextStr = closeTag[2];
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
                  currentObj = { t: currentType, val: content };
                  break;
              }
          }
          if (currentObj) {
              buffer.push(currentObj);
          }
          else {
              ParseErr('unclosed tag', str, lastIndex);
          }
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
          compileScope(buffer, env) +
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
              if (type === 'r') {
                  // raw
                  returnStr += 'tR+=' + content + ';';
              }
              else if (type === 'i') {
                  // interpolate
                  if (env.autoEscape) {
                      content = 'E.e(' + content + ')';
                  }
                  returnStr += 'tR+=' + content + ';';
                  // reference
              }
              else if (type === 'e') {
                  // execute
                  returnStr += content + '\n'; // you need a \n in case you have <% } %>
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

  /* END TYPES */
  var templates = new Cacher({});

  /* END TYPES */
  function includeHelper(templateNameOrPath, data) {
      var template = this.templates.get(templateNameOrPath);
      if (!template) {
          throw EtaErr('Could not fetch template "' + templateNameOrPath + '"');
      }
      return template(data, this);
  }
  var defaultConfig = {
      varName: 'it',
      autoTrim: [false, 'nl'],
      autoEscape: true,
      tags: ['<%', '%>'],
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
      e: XMLEscape,
      include: includeHelper
  };
  includeHelper.bind(defaultConfig);
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
                  throw EtaErr("This environment doesn't support async/await");
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

  /* END TYPES */
  function handleCache(template, options) {
      var templateFunc;
      if (options.cache && options.name && options.templates.get(options.name)) {
          return options.templates.get(options.name);
      }
      if (typeof template === 'function') {
          templateFunc = template;
      }
      else {
          templateFunc = compile(template, options);
      }
      if (options.cache && options.name) {
          options.templates.define(options.name, templateFunc);
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
                          result = handleCache(template, options)(data, options);
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
                  handleCache(template, options)(data, options, cb);
              }
              catch (err) {
                  return cb(err);
              }
          }
      }
      else {
          return handleCache(template, options)(data, options);
      }
  }

  exports.compile = compile;
  exports.compileToString = compileToString;
  exports.defaultConfig = defaultConfig;
  exports.getConfig = getConfig;
  exports.parse = parse;
  exports.render = render;
  exports.templates = templates;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=eta.dev.js.map
