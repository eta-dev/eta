import { includeFile } from './file-handlers'

/* TYPES */

import { EtaConfig } from './config'

interface GenericData {
  [index: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

/* END TYPES */

export function includeFileHelper (this: EtaConfig, path: string, data: GenericData): string {
  return includeFile(path, this)(data, this)
}
