import { Cacher } from './storage';
import { EtaConfig } from './config';
import { TemplateFunction } from './compile';
interface GenericData {
    [index: string]: any;
}
declare var templates: Cacher<TemplateFunction>;
declare function include(templateNameOrPath: string, data: GenericData, config: EtaConfig): string;
export { templates, include };
