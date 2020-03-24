import { Cacher } from './storage'
import EtaErr from './err'

/* TYPES */

import { EtaConfig } from './config'
import { TemplateFunction } from './compile'

interface EscapeMap {
  '&': '&amp;'
  '<': '&lt;'
  '"': '&quot;'
  "'": '&#39;'
  [index: string]: string
}

interface GenericData {
  [index: string]: any
}

/* END TYPES */

var templates = new Cacher<TemplateFunction>({})

/* ASYNC LOOP FNs */

function include (templateNameOrPath: string, data: GenericData, config: EtaConfig): string {
  var template = config.storage.templates.get(templateNameOrPath)
  if (!template) {
    throw EtaErr('Could not fetch template "' + templateNameOrPath + '"')
  }
  return template(data, config)
}

export { templates, include }
