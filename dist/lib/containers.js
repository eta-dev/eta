import { Cacher } from './storage';
import SqrlErr from './err';
import { ParseScope } from './compile-string';
// interface ITemplate {
//   exec: (options: object, Sqrl: object) => string
// }
var Templates = new Cacher({});
// Templates.define("hey", function (it) {return "hey"})
var Layouts = new Cacher({});
var Partials = new Cacher({});
var Helpers = new Cacher({
    each: function (content) {
        // helperStart is called with (params, id) but id isn't needed
        var res = '';
        var param = content.params[0];
        for (var i = 0; i < param.length; i++) {
            res += content.exec(param[i], i);
        }
        return res;
    },
    foreach: function (content) {
        var res = '';
        var param = content.params[0];
        for (var key in param) {
            if (!param.hasOwnProperty(key))
                continue;
            res += content.exec(param, key);
        }
        return res;
    }
});
var NativeHelpers = new Cacher({
    if: function (buffer) {
        if (buffer.f && buffer.f.length) {
            throw SqrlErr("native helper 'if' can't have filters");
        }
        var returnStr = 'if(' + buffer.p + '){' + ParseScope(buffer.d) + '}';
        if (buffer.b) {
            for (var i = 0; i < buffer.b.length; i++) {
                var currentBlock = buffer.b[i];
                if (currentBlock.n === 'else') {
                    returnStr += 'else{' + ParseScope(currentBlock.d) + '}';
                }
                else if (currentBlock.n === 'elif') {
                    returnStr += 'else if(' + currentBlock.p + '){' + ParseScope(currentBlock.d) + '}';
                }
            }
        }
        return returnStr;
    }
});
var Filters = new Cacher({});
export { Templates, Layouts, Partials, Helpers, NativeHelpers, Filters };
//# sourceMappingURL=containers.js.map