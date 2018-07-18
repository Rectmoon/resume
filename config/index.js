const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  paths: {
    styles: resolve('src/**/*.styl'),
    scripts: resolve('src/**/*.js'),
    basis: resolve('src/app/**/*.html'),
    'dist-html': resolve('src/index.html')
  }
}
