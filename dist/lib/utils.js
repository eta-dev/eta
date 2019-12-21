"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.trimLeft = trimLeft;
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
exports.trimRight = trimRight;
//# sourceMappingURL=utils.js.map