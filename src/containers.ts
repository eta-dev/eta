import { Cacher } from './storage'
type TemplateFunction = (options: object, Sqrl: object) => string

// interface ITemplate {
//   exec: (options: object, Sqrl: object) => string
// }

var Templates = new Cacher<TemplateFunction>({})

// Templates.define("hey", function (it) {return "hey"})

var Layouts = new Cacher<TemplateFunction>({})

var Partials = new Cacher<TemplateFunction>({})

var Helpers = new Cacher<Function>({})

var NativeHelpers = new Cacher<Function>({})

var Filters = new Cacher<Function>({})

export { Templates, Layouts, Partials, Helpers, NativeHelpers, Filters }
