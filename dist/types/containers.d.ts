import { Cacher } from './storage';
declare type TemplateFunction = (options: object, Sqrl: object) => string;
declare var Templates: Cacher<TemplateFunction>;
declare var Layouts: Cacher<TemplateFunction>;
declare var Partials: Cacher<TemplateFunction>;
declare var Helpers: Cacher<Function>;
declare var NativeHelpers: Cacher<Function>;
declare var Filters: Cacher<Function>;
export { Templates, Layouts, Partials, Helpers, NativeHelpers, Filters };
