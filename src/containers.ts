import Storage from './storage'
type TemplateFunction = (options: object, Sqrl: object) => string

// interface ITemplate {
//   exec: (options: object, Sqrl: object) => string
// }

var Templates = new Storage<TemplateFunction>({})

// Templates.define("hey", function (it) {return "hey"})

var Layouts = new Storage<TemplateFunction>({})

var Partials = new Storage<TemplateFunction>({})

var Helpers = new Storage<Function>({})

var NativeHelpers = new Storage<Function>({})

var Filters = new Storage<Function>({})

export { Templates, Layouts, Partials, Helpers, NativeHelpers, Filters }
