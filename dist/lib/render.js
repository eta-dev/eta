import Compile from './compile';
import { Helpers, Filters } from './containers';
function Render(template, options) {
    var templateFunc = Compile(template, '{{', '}}');
    return templateFunc(options, { H: Helpers, F: Filters });
}
export default Render;
//# sourceMappingURL=render.js.map