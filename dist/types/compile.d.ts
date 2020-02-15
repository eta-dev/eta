import { SqrlConfig, PartialConfig } from './config';
export declare type TemplateFunction = (data: object, config: SqrlConfig) => string;
export default function compile(str: string, env?: PartialConfig): TemplateFunction;
