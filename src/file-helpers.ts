import SqrlErr from './err'
import { templates } from './containers'
import { includeFile } from './file-handlers'

/* TYPES */

import { SqrlConfig } from './config'
import { HelperBlock } from './containers'

interface IncludeHelperBlock extends HelperBlock {
  params: [string, object]
}

/* END TYPES */

export function includeFileHelper (
  content: IncludeHelperBlock,
  blocks: Array<HelperBlock>,
  config: SqrlConfig
): string {
  // helperStart is called with (params, id) but id isn't needed
  if (blocks && blocks.length > 0) {
    throw SqrlErr("Helper 'includeFile' doesn't accept blocks")
  }
  return includeFile(content.params[0], config)(content.params[1], config)
}

// interface ExtendsHelperBlock extends HelperBlock {
//   params: [string, object]
// }

// interface ExtendsHelperNameBlock extends HelperBlock {
//   params: [string]
// }

// export function extendsHelper (
//   content: ExtendsHelperBlock,
//   blocks: Array<ExtendsHelperNameBlock>
// ): string {
//   // helperStart is called with (params, id) but id isn't needed
//   if (blocks && blocks.length > 0) {
//     throw SqrlErr("Helper 'extends' doesn't accept blocks")
//   }
//   var res = ''
//   var param = content.params[0]
//   for (var i = 0; i < param.length; i++) {
//     res += content.exec(param[i], i)
//   }
//   return res
// }

// export function extendsFileHelper (
//   content: ExtendsHelperBlock,
//   blocks: Array<ExtendsHelperNameBlock>
// ): string {
//   // helperStart is called with (params, id) but id isn't needed
//   if (blocks && blocks.length > 0) {
//     throw SqrlErr("Helper 'extends' doesn't accept blocks")
//   }
//   var res = ''
//   var param = content.params[0]
//   for (var i = 0; i < param.length; i++) {
//     res += content.exec(param[i], i)
//   }
//   return res
// }
