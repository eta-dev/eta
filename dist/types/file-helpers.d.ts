import { HelperBlock } from './containers';
import { SqrlConfig } from './config';
interface IncludeHelperBlock extends HelperBlock {
    params: [string, object];
}
export declare function includeFileHelper(content: IncludeHelperBlock, blocks: Array<HelperBlock>, config: SqrlConfig): string;
export declare function includeHelper(content: IncludeHelperBlock, blocks: Array<HelperBlock>, config: SqrlConfig): string;
export {};
