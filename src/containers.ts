import { Cacher } from './storage.js'

/* TYPES */

import type { TemplateFunction } from './compile.js'

/* END TYPES */

/**
 * Eta's template storage
 *
 * Stores partials and cached templates
 */

const templates = new Cacher<TemplateFunction>({})

export { templates }
