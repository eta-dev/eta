"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// v 1.0.32
function SqrlErr(message) {
    var err = new Error(message);
    Object.setPrototypeOf(err, SqrlErr.prototype);
    return err;
}
SqrlErr.prototype = Object.create(Error.prototype, {
    name: { value: 'Squirrelly Error', enumerable: false }
});
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
    throw new SqrlErr(message);
}
exports.ParseErr = ParseErr;
//# sourceMappingURL=err.js.map