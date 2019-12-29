import Compile from './compile'

function Render (template: string, options: object): string {
  var templateFunc = Compile(template, '{{', '}}')
  return templateFunc(options, {})
}

export default Render
export type TemplateFunction = (options: object, Sqrl: object) => string
