gulp       = require 'gulp'
browserify = require 'browserify'
source     = require 'vinyl-source-stream'
mocha      = require 'gulp-mocha'
espower    = require 'gulp-espower'

gulp.task 'test', ->
  browserify
    entries: ['./test/enjo.js']
  .bundle()
  .pipe source('enjo.js')
  .pipe espower()
  .pipe gulp.dest('test/espowered/')
  .pipe mocha()

gulp.task 'default', ['test']
