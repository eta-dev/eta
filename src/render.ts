import Compile from './compile'

function Render (template: string, options: object) {
  var templateFunc = Compile(template, '{{', '}}')
  return templateFunc(options, {})
}

export default Render
