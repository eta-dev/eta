import { PartialConfig } from './config';
import { TemplateFunction } from './compile';
import { CallbackFn } from './file-handlers';
export default function render(template: string | TemplateFunction, data: object, env?: PartialConfig, cb?: CallbackFn): any;
