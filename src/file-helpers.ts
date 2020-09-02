import { includeFile } from './file-handlers'

/* TYPES */

import { EtaConfig } from './config'

interface GenericData {
  [index: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

/* END TYPES */

export function includeFileHelper(this: EtaConfig, path: string, data: GenericData): string {
  var templateAndConfig = includeFile(path, this)
  return templateAndConfig[0](data, templateAndConfig[1])
}
