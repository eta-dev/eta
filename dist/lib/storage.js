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
        return this.cache[key];
    };
    Cacher.prototype.remove = function (key) {
        delete this.cache[key];
    };
    Cacher.prototype.clear = function () {
        this.cache = {};
    };
    Cacher.prototype.load = function (cacheObj) {
        this.cache = cacheObj;
    };
    return Cacher;
}());
export { Cacher };
//# sourceMappingURL=storage.js.map