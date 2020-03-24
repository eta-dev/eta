import { includeFile } from './file-handlers'

/* TYPES */

import { EtaConfig } from './config'

interface GenericData {
  [index: string]: any
}

/* END TYPES */

export function includeFileHelper (path: string, data: GenericData, config: EtaConfig): string {
  return includeFile(path, config)(data, config)
}

// export function extendsFileHelper(path: string, data: GenericData, config: EtaConfig): string {
//   var data: GenericData = content.params[1] || {}

//   data.content = content.exec()
//   for (var i = 0; i < blocks.length; i++) {
//     var currentBlock = blocks[i]
//     data[currentBlock.name] = currentBlock.exec()
//   }

//   return includeFile(content.params[0], config)(data, config)
// }
