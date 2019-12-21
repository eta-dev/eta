"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Version 1.0.32
var err_1 = require("./err");
var utils_1 = require("./utils");
function Parse(str, tagOpen, tagClose) {
    var powerchars = new RegExp('([|()]|=>)|' +
        '\'(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r\'\\\\])*?\'|`(?:\\\\[\\s\\w"\'\\\\`]|[^\\\\`])*?`|"(?:\\\\[\\s\\w"\'\\\\`]|[^\\n\\r"\\\\])*?"' + // matches strings
        '|\\/\\*[^]*?\\*\\/|((\\/)?(-|_)?' +
        tagClose +
        ')', 'g');
    var tagOpenReg = new RegExp('([^]*?)' + tagOpen + '(-|_)?\\s*', 'g');
    var startInd = 0;
    var trimNextLeftWs = '';
    function parseTag() {
        // console.log(JSON.stringify(match))
        var currentObj = { f: [], d: [] };
        var numParens = 0;
        var filterNumber = 0;
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
        else {
            startInd -= 1;
        }
        function addAttrValue(indx, strng) {
            var valUnprocessed = str.slice(startInd, indx) + (strng || '');
            // console.log(valUnprocessed)
            var val = valUnprocessed.trim();
            if (currentAttribute === 'f') {
                currentObj.f[filterNumber - 1][0] += val; // filterNumber - 1 because first filter: 0->1, but zero-indexed arrays
            }
            else if (currentAttribute === 'fp') {
                currentObj.f[filterNumber - 1][1] += val;
            }
            else if (currentAttribute === 'err') {
                if (val) {
                    var found = valUnprocessed.search(/\S/);
                    err_1.ParseErr('invalid syntax', str, startInd + found);
                }
            }
            else if (currentAttribute) {
                // if (currentObj[currentAttribute]) { // TODO make sure no errs
                //   currentObj[currentAttribute] += val
                // } else {
                currentObj[currentAttribute] = val;
                // }
            }
            startInd = indx + 1;
        }
        var m;
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
                    filterNumber++;
                    //   TODO if (!currentObj.f) {
                    //     currentObj.f = [] // Initial assign
                    //   }
                    currentObj.f[filterNumber - 1] = ['', ''];
                }
                else if (char === '=>') {
                    addAttrValue(i);
                    startInd += 1; // this is 2 chars
                    currentAttribute = 'res';
                }
            }
            else if (tagClose) {
                addAttrValue(i);
                startInd += tagClose.length - 1;
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
        err_1.ParseErr('unclosed tag', str, str.length);
        return currentObj; // To prevent TypeScript from erroring
    }
    function parseContext(parentObj, firstParse) {
        parentObj.b = []; // assume there will be blocks
        var lastBlock = false;
        var buffer = [];
        function pushString(strng, wsAhead) {
            if (strng && typeof strng === 'string') {
                var stringToPush = strng.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                if (wsAhead) {
                    stringToPush = utils_1.trimRight(stringToPush, wsAhead);
                }
                if (trimNextLeftWs) {
                    stringToPush = utils_1.trimLeft(stringToPush, trimNextLeftWs);
                    trimNextLeftWs = '';
                }
                buffer.push(stringToPush);
            }
        }
        // Random TODO: parentObj.b doesn't need to have t: #
        var tagOpenMatch;
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
                    err_1.ParseErr("Helper start and end don't match", str, tagOpenMatch.index + tagOpenMatch[0].length);
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
    var parseResult = parseContext({ f: [], d: [] }, true);
    // console.log(JSON.stringify(parseResult))
    return parseResult.d; // Parse the very outside context
}
exports.default = Parse;
// TODO: Don't add f[] by default. Use currentObj.f[currentObj.f.length - 1] instead of using filterNumber
//# sourceMappingURL=parse.js.map