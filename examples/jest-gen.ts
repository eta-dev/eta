var Sqrl = require('../dist/squirrelly.cjs')

var str = Sqrl.Render('{{it.html}}', { html: '<script>Malicous XSS</script>' })
console.log(str)
