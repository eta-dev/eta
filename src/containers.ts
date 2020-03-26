import { Cacher } from './storage'
import EtaErr from './err'

/* TYPES */

import { EtaConfig } from './config'
import { TemplateFunction } from './compile'

/* END TYPES */

var templates = new Cacher<TemplateFunction>({})

/* ASYNC LOOP FNs */

export { templates }
