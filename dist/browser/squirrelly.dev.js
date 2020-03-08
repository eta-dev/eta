(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Sqrl = {}));
}(this, (function (exports) { 'use strict';

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
      throw SqrlErr(message);
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
              if (fromObj[key] != null &&
                  typeof fromObj[key] == 'object' &&
                  key === 'storage' &&
                  !notConfig // not called from Cache.load
              ) {
                  // plugins or storage
                  // Note: this doesn't merge from initial config!
                  // Deep clone instead of assigning
                  // TODO: run checks on this
                  toObj[key] = copyProps(/*toObj[key] ||*/ {}, fromObj[key]);
              }
              else {
                  toObj[key] = fromObj[key];
              }
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

  /* END TYPES */
  var asyncRegExp = /^async +/;
  function parse(str, env) {
      var powerchars = new RegExp('([|()]|=>)|' +
          '\'(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r\'\\\\])*?\'|`(?:\\\\[\\s\\w"\'\\\\`]|[^\\\\`])*?`|"(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r"\\\\])*?"' + // matches strings
          '|\\/\\*[^]*?\\*\\/|((\\/)?(-|_)?' +
          env.tags[1] +
          ')', 'g');
      var tagOpenReg = new RegExp('([^]*?)' + env.tags[0] + '(-|_)?\\s*', 'g');
      var startInd = 0;
      var trimNextLeftWs = '';
      function parseTag() {
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
                      if (env.async && asyncRegExp.test(val)) {
                          val = val.replace(asyncRegExp, '');
                          currentObj.f.push([val, '', true]);
                      }
                      else {
                          currentObj.f.push([val, '']);
                      }
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
                  var hName = currentObj.n || '';
                  if (env.async && asyncRegExp.test(hName)) {
                      currentObj.a = true;
                      currentObj.n = hName.replace(asyncRegExp, '');
                  }
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
                  // TODO: make sure async stuff inside blocks are recognized
                  if (lastBlock) {
                      // If there's a previous block
                      lastBlock.d = buffer;
                      parentObj.b.push(lastBlock);
                  }
                  else {
                      parentObj.d = buffer;
                  }
                  var blockName = currentObj.n || '';
                  if (env.async && asyncRegExp.test(blockName)) {
                      currentObj.a = true;
                      currentObj.n = blockName.replace(asyncRegExp, '');
                  }
                  lastBlock = currentObj; // Set the 'lastBlock' object to the value of the current block
                  buffer = [];
              }
              else if (currentType === 's') {
                  var selfClosingHName = currentObj.n || '';
                  if (env.async && asyncRegExp.test(selfClosingHName)) {
                      currentObj.a = true;
                      currentObj.n = selfClosingHName.replace(asyncRegExp, '');
                  }
                  buffer.push(currentObj);
              }
              else {
                  buffer.push(currentObj);
              }
              // ===== DONE ADDING OBJECT TO BUFFER =====
          }
          if (firstParse) {
              pushString(str.slice(startInd, str.length));
              parentObj.d = buffer;
          }
          else {
              throw SqrlErr('unclosed helper "' + parentObj.n + '"');
              // It should have returned by now
          }
          return parentObj;
      }
      var parseResult = parseContext({ f: [] }, true);
      // console.log(JSON.stringify(parseResult))
      if (env.plugins) {
          for (var i = 0; i < env.plugins.length; i++) {
              var plugin = env.plugins[i];
              if (plugin.processAST) {
                  parseResult.d = plugin.processAST(parseResult.d, env);
              }
          }
      }
      return parseResult.d; // Parse the very outside context
  }

  // import SqrlErr from './err'
  /* END TYPES */
  function compileToString(str, env) {
      var buffer = parse(str, env);
      var res = "var tR='';" +
          (env.useWith ? 'with(' + env.varName + '||{}){' : '') +
          compileScope(buffer, env)
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
  function filter(str, filters, env) {
      for (var i = 0; i < filters.length; i++) {
          var name = filters[i][0];
          var params = filters[i][1];
          var isFilterAsync = filters[i][2];
          // if (isFilterAsync && !env.async) {
          //   throw SqrlErr("Async filter '" + name + "' in non-async env")
          // }
          // Let the JS compiler do this, compile() will catch it
          str = (isFilterAsync ? 'await ' : '') + "c.l('F','" + name + "')(" + str;
          if (params) {
              str += ',' + params;
          }
          str += ')';
      }
      return str;
  }
  // TODO: Use type intersections for TemplateObject, etc.
  // so I don't have to make properties mandatory
  function compileHelper(env, res, descendants, params, isAsync, name) {
      var ret = '{exec:' +
          (isAsync ? 'async ' : '') +
          compileScopeIntoFunction(descendants, res, env) +
          ',params:[' +
          params +
          ']';
      if (name) {
          ret += ",name:'" + name + "'";
      }
      if (isAsync) {
          ret += ',async:true';
      }
      ret += '}';
      return ret;
  }
  function compileBlocks(blocks, env) {
      var ret = '[';
      for (var i = 0; i < blocks.length; i++) {
          var block = blocks[i];
          ret += compileHelper(env, block.res || '', block.d, block.p || '', block.a, block.n);
          if (i < blocks.length) {
              ret += ',';
          }
      }
      ret += ']';
      return ret;
  }
  function compileScopeIntoFunction(buff, res, env) {
      return 'function(' + res + "){var tR='';" + compileScope(buff, env) + 'return tR}';
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
              var content = currentBlock.c || '';
              var filters = currentBlock.f;
              var name = currentBlock.n || '';
              var params = currentBlock.p || '';
              var res = currentBlock.res || '';
              var blocks = currentBlock.b;
              var isAsync = !!currentBlock.a; // !! is to booleanize it
              // if (isAsync && !env.async) {
              //   throw SqrlErr("Async block or helper '" + name + "' in non-async env")
              // }
              // Let compiler do this
              if (type === 'r') {
                  if (env.defaultFilter) {
                      content = "c.l('F','" + env.defaultFilter + "')(" + content + ')';
                  }
                  if (!currentBlock.raw && env.autoEscape) {
                      content = "c.l('F','e')(" + content + ')';
                  }
                  var filtered = filter(content, filters);
                  returnStr += 'tR+=' + filtered + ';';
                  // reference
              }
              else if (type === '~') {
                  // helper
                  if (env.storage.nativeHelpers.get(name)) {
                      returnStr += env.storage.nativeHelpers.get(name)(currentBlock, env);
                  }
                  else {
                      var helperReturn = (isAsync ? 'await ' : '') +
                          "c.l('H','" +
                          name +
                          "')(" +
                          compileHelper(env, res, currentBlock.d, params, isAsync);
                      if (blocks) {
                          helperReturn += ',' + compileBlocks(blocks, env);
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
                      'tR+=' +
                          filter((isAsync ? 'await ' : '') + "c.l('H','" + name + "')({params:[" + params + ']},[],c)', filters) +
                          ';';
                  // self-closing helper
              }
              else if (type === '!') {
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
          copyProps(this.cache, cacheObj, true);
      };
      return Cacher;
  }());

  /* END TYPES */
  var templates = new Cacher({});
  function errWithBlocksOrFilters(name, blocks, // false means don't check
  filters, native) {
      if (blocks && blocks.length > 0) {
          throw SqrlErr((native ? 'Native' : '') + "Helper '" + name + "' doesn't accept blocks");
      }
      if (filters && filters.length > 0) {
          throw SqrlErr((native ? 'Native' : '') + "Helper '" + name + "' doesn't accept filters");
      }
  }
  /* ASYNC LOOP FNs */
  function asyncArrLoop(arr, index, fn, res, cb) {
      fn(arr[index], index).then(function (val) {
          res += val;
          if (index === arr.length - 1) {
              cb(res);
          }
          else {
              asyncArrLoop(arr, index + 1, fn, res, cb);
          }
      });
  }
  function asyncObjLoop(obj, keys, index, fn, res, cb) {
      fn(keys[index], obj[keys[index]]).then(function (val) {
          res += val;
          if (index === keys.length - 1) {
              cb(res);
          }
          else {
              asyncObjLoop(obj, keys, index + 1, fn, res, cb);
          }
      });
  }
  /* ASYNC LOOP FNs */
  var helpers = new Cacher({
      each: function (content, blocks) {
          var res = '';
          var arr = content.params[0];
          errWithBlocksOrFilters('each', blocks, false);
          if (content.async) {
              return new Promise(function (resolve) {
                  asyncArrLoop(arr, 0, content.exec, res, resolve);
              });
          }
          else {
              for (var i = 0; i < arr.length; i++) {
                  res += content.exec(arr[i], i);
              }
              return res;
          }
      },
      foreach: function (content, blocks) {
          var obj = content.params[0];
          errWithBlocksOrFilters('foreach', blocks, false);
          if (content.async) {
              return new Promise(function (resolve) {
                  asyncObjLoop(obj, Object.keys(obj), 0, content.exec, '', resolve);
              });
          }
          else {
              var res = '';
              for (var key in obj) {
                  if (!hasOwnProp(obj, key))
                      continue;
                  res += content.exec(key, obj[key]); // todo: check on order
              }
              return res;
          }
      },
      include: function (content, blocks, config) {
          errWithBlocksOrFilters('include', blocks, false);
          var template = config.storage.templates.get(content.params[0]);
          if (!template) {
              throw SqrlErr('Could not fetch template "' + content.params[0] + '"');
          }
          return template(content.params[1], config);
      },
      extends: function (content, blocks, config) {
          var data = content.params[1] || {};
          data.content = content.exec();
          for (var i = 0; i < blocks.length; i++) {
              var currentBlock = blocks[i];
              data[currentBlock.name] = currentBlock.exec();
          }
          var template = config.storage.templates.get(content.params[0]);
          if (!template) {
              throw SqrlErr('Could not fetch template "' + content.params[0] + '"');
          }
          return template(data, config);
      },
      useScope: function (content, blocks) {
          errWithBlocksOrFilters('useScope', blocks, false);
          return content.exec(content.params[0]);
      }
  });
  var nativeHelpers = new Cacher({
      if: function (buffer, env) {
          errWithBlocksOrFilters('if', false, buffer.f, true);
          var returnStr = 'if(' + buffer.p + '){' + compileScope(buffer.d, env) + '}';
          if (buffer.b) {
              for (var i = 0; i < buffer.b.length; i++) {
                  var currentBlock = buffer.b[i];
                  if (currentBlock.n === 'else') {
                      returnStr += 'else{' + compileScope(currentBlock.d, env) + '}';
                  }
                  else if (currentBlock.n === 'elif') {
                      returnStr += 'else if(' + currentBlock.p + '){' + compileScope(currentBlock.d, env) + '}';
                  }
              }
          }
          return returnStr;
      },
      try: function (buffer, env) {
          errWithBlocksOrFilters('try', false, buffer.f, true);
          if (!buffer.b || buffer.b.length !== 1 || buffer.b[0].n !== 'catch') {
              throw SqrlErr("native helper 'try' only accepts 1 block, 'catch'");
          }
          var returnStr = 'try{' + compileScope(buffer.d, env) + '}';
          var currentBlock = buffer.b[0];
          returnStr +=
              'catch' +
                  (currentBlock.res ? '(' + currentBlock.res + ')' : '') +
                  '{' +
                  compileScope(currentBlock.d, env) +
                  '}';
          return returnStr;
      },
      block: function (buffer, env) {
          errWithBlocksOrFilters('block', buffer.b, buffer.f, true);
          var returnStr = 'if(!' +
              env.varName +
              '[' +
              buffer.p +
              ']){tR+=(' +
              compileScopeIntoFunction(buffer.d, '', env) +
              ')()}else{tR+=' +
              env.varName +
              '[' +
              buffer.p +
              ']}';
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
  var filters = new Cacher({ e: XMLEscape });

  /* END TYPES */
  var defaultConfig = {
      varName: 'it',
      autoTrim: [false, 'nl'],
      autoEscape: true,
      defaultFilter: false,
      tags: ['{{', '}}'],
      l: function (container, name) {
          if (container === 'H') {
              var hRet = this.storage.helpers.get(name);
              if (hRet) {
                  return hRet;
              }
              else {
                  throw SqrlErr("Can't find helper '" + name + "'");
              }
          }
          else if (container === 'F') {
              var fRet = this.storage.filters.get(name);
              if (fRet) {
                  return fRet;
              }
              else {
                  throw SqrlErr("Can't find filter '" + name + "'");
              }
          }
      },
      async: false,
      storage: {
          helpers: helpers,
          nativeHelpers: nativeHelpers,
          filters: filters,
          templates: templates
      },
      cache: false,
      plugins: [],
      useWith: false
  };
  defaultConfig.l.bind(defaultConfig);
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
      res.l.bind(res);
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
          return new ctor(options.varName, 'c', // SqrlConfig
          'cb', // optional callback
          compileToString(str, options)); // eslint-disable-line no-new-func
      }
      catch (e) {
          if (e instanceof SyntaxError) {
              throw SqrlErr('Bad template syntax\n\n' +
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
                          result = handleCache(template, options)(data, options);
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
  exports.compileScope = compileScope;
  exports.compileScopeIntoFunction = compileScopeIntoFunction;
  exports.compileToString = compileToString;
  exports.defaultConfig = defaultConfig;
  exports.filters = filters;
  exports.getConfig = getConfig;
  exports.helpers = helpers;
  exports.nativeHelpers = nativeHelpers;
  exports.parse = parse;
  exports.render = render;
  exports.templates = templates;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=squirrelly.dev.js.map
