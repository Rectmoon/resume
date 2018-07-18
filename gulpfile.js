const gulp = require('gulp')
const del = require('del')
const stylus = require('gulp-stylus')
const postcss = require('gulp-postcss')
const gulpif = require('gulp-if')
const minCss = require('gulp-minify-css')
const browserSync = require('browser-sync')
const gulpSequence = require('gulp-sequence')
const rename = require('gulp-rename')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const config = require('./config')
const browFile = require('./browFile')

const isProduction = process.env.NODE_ENV === 'production'
const reload = browserSync.reload

function runTasks(tasks, sync) {
  return new Promise((resolve, reject) => {
    if (sync) {
      gulpSequence.apply(null, tasks)(() => {
        resolve('completed')
      })
    } else {
      gulpSequence(tasks, () => {
        resolve('completed')
      })
    }
  })
}

function onErr(err) {
  const title = err.plugin + ' ' + err.name
  const msg = err.message
  const errContent = msg.replace(/\n/g, '\\A ')
  notify.onError({
    title,
    message: errContent,
    sound: true
  })(err)
  this.emit('end')
}

function server(baseDir, browser = 'default') {
  browserSync.init({
    server: { baseDir },
    browser
  })
  console.log('server running')
}

gulp.task('default', () => {
  runTasks(['clean', 'basis', 'dist-html', 'styles', 'scripts', 'serve'], true).then(() => {
    gulp.start('watch')
  })
})

gulp.task('serve', () => {
  server('./dist')
})

gulp.task('clean', () => {
  del('dist/**/*').then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'))
  })
})

gulp.task('dist-html', () => {
  return gulp.src('src/index.html').pipe(gulp.dest('dist'))
})

gulp.task('basis', () => {
  return gulp.src('')
})

gulp.task('styles', () => {
  return gulp
    .src('src/index.styl')
    .pipe(stylus())
    .pipe(postcss('./.postcssrc.js'))
    .pipe(rename('style.css'))
    .pipe(gulpif(isProduction, minCss()))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('scripts', () => {
  return gulp
    .src('src/index.js')
    .pipe(plumber(onErr))
    .pipe(browFile())
    .pipe(gulp.dest(`dist/js/`))
})

gulp.task('watch', () => {
  Object.keys(config.paths).forEach(key => {
    gulp.watch(config.paths[key]).on('change', () => {
      gulp.start(key, reload)
    })
  })
})

gulp.task('build', () => {
  return runTasks(['clean', 'basis', 'dist-html', 'styles', 'scripts'], true)
})
