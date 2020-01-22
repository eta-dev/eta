import { Cacher } from './storage';
declare type TemplateFunction = (options: object, l: (container: 'T' | 'H' | 'F', name: string) => any) => string;
declare var Templates: Cacher<TemplateFunction>;
interface HelperBlock {
    exec: Function;
    params: Array<any>;
}
declare type HelperFunction = (content: HelperBlock, blocks: Array<HelperBlock>) => string;
declare var Helpers: Cacher<HelperFunction>;
declare var NativeHelpers: Cacher<Function>;
declare type FilterFunction = (str: string) => string;
declare var Filters: Cacher<FilterFunction>;
export { Templates, Helpers, NativeHelpers, Filters };
