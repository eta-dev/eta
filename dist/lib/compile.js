import CompileToString from './compile-string';
function Compile(str, tagOpen, tagClose) {
    return new Function('it', 'Sqrl', CompileToString(str, tagOpen, tagClose)); // eslint-disable-line no-new-func
}
export default Compile;
// console.log(Compile('hi {{this}} hey', '{{', '}}').toString())
//# sourceMappingURL=compile.js.map