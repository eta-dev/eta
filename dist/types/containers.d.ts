import { Cacher } from './storage';
declare type TemplateFunction = (options: object, Sqrl: object) => string;
declare var Templates: Cacher<TemplateFunction>;
declare var Layouts: Cacher<TemplateFunction>;
declare var Partials: Cacher<TemplateFunction>;
interface HelperBlock {
    exec: Function;
    params: Array<any>;
}
declare type HelperFunction = (content: HelperBlock, blocks: Array<HelperBlock>) => string;
declare var Helpers: Cacher<HelperFunction>;
declare var NativeHelpers: Cacher<Function>;
declare type FilterFunction = (str: string) => string;
declare var Filters: Cacher<FilterFunction>;
export { Templates, Layouts, Partials, Helpers, NativeHelpers, Filters };
