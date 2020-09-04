import { Cacher } from './storage';
import { TemplateFunction } from './compile';
/**
 * Eta's template storage
 *
 * Stores partials and cached templates
 */
declare var templates: Cacher<TemplateFunction>;
export { templates };
