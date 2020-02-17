import { SqrlConfig } from './config';
import { HelperBlock } from './containers';
interface IncludeHelperBlock extends HelperBlock {
    params: [string, object];
}
export declare function includeFileHelper(content: IncludeHelperBlock, blocks: Array<HelperBlock>, config: SqrlConfig): string;
export declare function extendsFileHelper(content: IncludeHelperBlock, blocks: Array<HelperBlock>, config: SqrlConfig): string;
export {};
