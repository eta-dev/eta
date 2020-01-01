import Compile from './compile'
import { Helpers, Filters } from './containers'

function Render (template: string, options: object): string {
  var templateFunc = Compile(template, '{{', '}}')
  return templateFunc(options, { H: Helpers, F: Filters })
}

export default Render
export type TemplateFunction = (options: object, Sqrl: object) => string
