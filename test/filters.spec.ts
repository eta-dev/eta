import { render, filters } from '../src'

filters.define('capitalize', function (str: string) {
  return str.toUpperCase()
})

describe('Simple render checks', () => {
  describe('render works', () => {
    it('Simple filter works', () => {
      expect(render('Hi {{it.name | capitalize}}', { name: 'Ada Lovelace' })).toEqual(
        'Hi ADA LOVELACE'
      )
    })
    it('Escaping works', () => {
      expect(render('{{it.html}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '&lt;script>Malicious XSS&lt;/script>'
      )
    })
    it('Unescaping with * works', () => {
      expect(render('{{ * it.html}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '<script>Malicious XSS</script>'
      )
    })
    it('Unescaping with | safe works', () => {
      expect(render('{{it.html | safe}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '<script>Malicious XSS</script>'
      )
    })
  })
})
