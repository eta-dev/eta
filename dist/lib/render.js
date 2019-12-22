"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compile_1 = require("./compile");
function Render(template, options) {
    var templateFunc = compile_1.default(template, '{{', '}}');
    return templateFunc(options, {});
}
exports.default = Render;
//# sourceMappingURL=render.js.map