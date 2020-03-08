import { Cacher } from './storage';
import { SqrlConfig } from './config';
import { TemplateFunction } from './compile';
export interface HelperContent {
    exec: Function;
    params: Array<any>;
    async?: boolean;
}
export interface HelperBlock extends HelperContent {
    name: string;
}
export declare type HelperFunction = (content: HelperContent, blocks: Array<HelperBlock>, config: SqrlConfig) => string | Promise<string>;
export declare type FilterFunction = (str: string) => any | Promise<any>;
declare var templates: Cacher<TemplateFunction>;
declare var helpers: Cacher<HelperFunction>;
declare var nativeHelpers: Cacher<Function>;
declare var filters: Cacher<FilterFunction>;
export { templates, helpers, nativeHelpers, filters };
