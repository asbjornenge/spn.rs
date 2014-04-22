var gulp           = require('gulp')
var gutil          = require('gulp-util')
var uglify         = require('gulp-uglify')
var rename         = require('gulp-rename')
var size           = require('gulp-size')
var webpack        = require('webpack')
var webpack_config = require('./webpack.config.js')
var version        = require('./package.json').version

var _config   = Object.create(webpack_config)
_config.debug = true
var _compiler = webpack(_config)

gulp.task('webpack', function(callback) {
    _compiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }))
        if (typeof callback == 'function') callback()
    })
})

gulp.task('build', ['webpack'], function() {
    return gulp.src('dist/bundle.js')
        .pipe(size({showFiles:true}))
        .pipe(uglify())
        .pipe(rename('spn.rs.min.js'))
        .pipe(size({showFiles:true}))
        .pipe(gulp.dest('./dist/'+version))
})


module.exports = gulp