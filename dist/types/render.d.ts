import { SqrlConfig } from './config';
declare type TemplateFunction = (data: object, fetcher: Function) => string;
declare type DetermineEnvFunction = (options?: object) => string | SqrlConfig;
declare function Render(template: string | TemplateFunction, data: object, env?: string | DetermineEnvFunction | SqrlConfig, options?: object): any;
export default Render;
