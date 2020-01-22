declare type TemplateFunction = (data: object, fetcher: Function) => string;
declare type DetermineEnvFunction = (options?: object) => string;
declare function Render(template: string | TemplateFunction, data: object, env?: string | DetermineEnvFunction, options?: object): any;
export default Render;
