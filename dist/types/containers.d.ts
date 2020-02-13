import { Cacher } from './storage';
import { SqrlConfig } from './config';
import { TemplateFunction } from './compile';
declare var Templates: Cacher<TemplateFunction>;
export interface HelperBlock {
    exec: Function;
    params: Array<any>;
}
export declare type HelperFunction = (content: HelperBlock, blocks: Array<HelperBlock>, config: SqrlConfig) => string;
declare var Helpers: Cacher<HelperFunction>;
declare var NativeHelpers: Cacher<Function>;
declare type FilterFunction = (str: string) => string;
declare var Filters: Cacher<FilterFunction>;
export { Templates, Helpers, NativeHelpers, Filters };
