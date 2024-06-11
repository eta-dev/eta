require('node:fs').writeFileSync('jsr.json', JSON.stringify({
  ...require('./jsr.json'),
  "version": require('./package.json').version,
}, null, 2) + '\n');
