"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compile_string_1 = require("./compile-string");
function Compile(str, tagOpen, tagClose) {
    return new Function('it', 'Sqrl', compile_string_1.default(str, tagOpen, tagClose)); // eslint-disable-line no-new-func
}
exports.default = Compile;
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())
//# sourceMappingURL=compile.js.map