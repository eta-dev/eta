import { PartialConfig } from './config';
import { TemplateFunction } from './compile';
declare function Render(template: string | TemplateFunction, data: object, env?: PartialConfig): string;
export default Render;
