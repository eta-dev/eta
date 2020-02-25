import SqrlErr from './err'
import { includeFile } from './file-handlers'

/* TYPES */

import { SqrlConfig } from './config'
import { HelperBlock } from './containers'

interface IncludeHelperBlock extends HelperBlock {
  params: [string, object]
}

interface GenericData {
  [index: string]: any
}

/* END TYPES */

export function includeFileHelper (
  content: IncludeHelperBlock,
  blocks: Array<HelperBlock>,
  config: SqrlConfig
): string {
  if (blocks && blocks.length > 0) {
    throw SqrlErr("Helper 'includeFile' doesn't accept blocks")
  }
  return includeFile(content.params[0], config)(content.params[1], config)
}

export function extendsFileHelper (
  content: IncludeHelperBlock,
  blocks: Array<HelperBlock>,
  config: SqrlConfig
): string {
  var data: GenericData = content.params[1] || {}

  data.content = content.exec()
  for (var i = 0; i < blocks.length; i++) {
    var currentBlock = blocks[i]
    data[currentBlock.name] = currentBlock.exec()
  }

  return includeFile(content.params[0], config)(data, config)
}
