import { SqrlConfig, PartialConfig } from './config';
import { CallbackFn } from './file-handlers';
export declare type TemplateFunction = (data: object, config: SqrlConfig, cb?: CallbackFn) => string;
export default function compile(str: string, env?: PartialConfig): TemplateFunction;
