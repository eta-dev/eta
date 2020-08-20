import { Cacher } from './storage'

/* TYPES */

import { TemplateFunction } from './compile'

/* END TYPES */

var templates = new Cacher<TemplateFunction>({})

/* ASYNC LOOP FNs */

export { templates }
