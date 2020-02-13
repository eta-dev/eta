import { SqrlConfig, PartialConfig } from './config';
declare type TemplateFunction = (data: object, config: SqrlConfig) => string;
declare function Render(template: string | TemplateFunction, data: object, env?: PartialConfig): string;
export default Render;
