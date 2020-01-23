import { SqrlConfig } from './config';
declare type TemplateFunction = (data: object, fetcher: Function) => string;
declare function Compile(str: string, env?: string | SqrlConfig): TemplateFunction;
export default Compile;
