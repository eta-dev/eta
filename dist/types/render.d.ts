import { PartialConfig } from './config';
declare type TemplateFunction = (data: object, fetcher: Function) => string;
declare type DetermineEnvFunction = (options?: object) => string | PartialConfig;
declare function Render(template: string | TemplateFunction, data: object, env?: string | DetermineEnvFunction | PartialConfig, options?: object): string;
export default Render;
