"use strict";
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
    else if (type === '-') {
        return str.replace(/^(?:[\s\uFEFF\xA0]|\r\n)/, '');
    }
    return str;
    // else something's wrong
}
exports.trimLeft = trimLeft;
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
    else if (type === '-') {
        return str.replace(/(?:[\s\uFEFF\xA0]|\r\n)$/, ''); // TODO: make sure this gets \r\n
    }
    return str;
}
exports.trimRight = trimRight;
//# sourceMappingURL=utils.js.map