import { includeFile } from './file-handlers'

/* TYPES */

import type { EtaConfig } from './config'

interface GenericData {
  [index: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

/* END TYPES */

/**
 * Called with `includeFile(path, data)`
 */

export function includeFileHelper(this: EtaConfig, path: string, data: GenericData): string {
  const templateAndConfig = includeFile(path, this)
  return templateAndConfig[0](data, templateAndConfig[1])
}
