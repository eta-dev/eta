"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var err_1 = require("./err");
function Cacher(initialCache) {
    var cache = initialCache;
    this.define = function (key, val) {
        cache[key] = val;
    };
    this.get = function (key) {
        if (cache[key]) {
            return cache[key];
        }
        else {
            throw err_1.default("Key '" + key + "' doesn't exist");
        }
    };
    this.remove = function (key) {
        delete cache[key];
    };
    this.clear = function () {
        cache = {};
    };
    this.load = function (cacheObj) {
        cache = cacheObj;
    };
}
exports.Cacher = Cacher;
//# sourceMappingURL=storage.js.map