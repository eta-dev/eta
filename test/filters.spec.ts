import { Render, Filters } from '../src'

Filters.define('capitalize', function (str: string) {
  return str.toUpperCase()
})

describe('Simple Render checks', () => {
  describe('Render works', () => {
    it('Simple filter works', () => {
      expect(Render('Hi {{it.name | capitalize}}', { name: 'Ada Lovelace' })).toEqual(
        'Hi ADA LOVELACE'
      )
    })
    it('Escaping works', () => {
      expect(Render('{{it.html}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '&lt;script>Malicious XSS&lt;/script>'
      )
    })
    it('Unescaping with * works', () => {
      expect(Render('{{ * it.html}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '<script>Malicious XSS</script>'
      )
    })
    it('Unescaping with | safe works', () => {
      expect(Render('{{it.html | safe}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '<script>Malicious XSS</script>'
      )
    })
  })
})
