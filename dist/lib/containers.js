"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("./storage");
// interface ITemplate {
//   exec: (options: object, Sqrl: object) => string
// }
var Templates = new storage_1.Cacher({});
exports.Templates = Templates;
// Templates.define("hey", function (it) {return "hey"})
var Layouts = new storage_1.Cacher({});
exports.Layouts = Layouts;
var Partials = new storage_1.Cacher({});
exports.Partials = Partials;
var Helpers = new storage_1.Cacher({});
exports.Helpers = Helpers;
var NativeHelpers = new storage_1.Cacher({});
exports.NativeHelpers = NativeHelpers;
var Filters = new storage_1.Cacher({});
exports.Filters = Filters;
//# sourceMappingURL=containers.js.map