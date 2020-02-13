import { SqrlConfig, PartialConfig } from './config';
export declare type TemplateFunction = (data: object, config: SqrlConfig) => string;
declare function Compile(str: string, env?: PartialConfig): TemplateFunction;
export default Compile;
