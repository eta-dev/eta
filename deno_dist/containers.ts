import { Cacher } from './storage.ts'

/* TYPES */

import { TemplateFunction } from './compile.ts'

/* END TYPES */

var templates = new Cacher<TemplateFunction>({})

export { templates }
