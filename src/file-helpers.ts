import SqrlErr from './err'
import { Templates, HelperBlock } from './containers'
import { SqrlConfig } from './config'
import { includeFile } from './file-handlers'

interface IncludeHelperBlock extends HelperBlock {
  params: [string, object]
}

export function includeFileHelper (
  content: IncludeHelperBlock,
  blocks: Array<HelperBlock>,
  config: SqrlConfig
): string {
  // helperStart is called with (params, id) but id isn't needed
  if (blocks && blocks.length > 0) {
    throw SqrlErr("Helper 'include' doesn't accept blocks")
  }
  return includeFile(content.params[0], config)(content.params[1], config)
}

export function includeHelper (
  content: IncludeHelperBlock,
  blocks: Array<HelperBlock>,
  config: SqrlConfig
): string {
  // helperStart is called with (params, id) but id isn't needed
  if (blocks && blocks.length > 0) {
    throw SqrlErr("Helper 'include' doesn't accept blocks")
  }
  var template = Templates.get(content.params[0])
  if (!template) {
    throw SqrlErr('Could not fetch template "' + content.params[0] + '"')
  }
  return template(content.params[1], config)
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
