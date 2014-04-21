var gulp           = require('gulp')
var gutil          = require('gulp-util')
var webpack        = require('webpack')
var webpack_config = require('./webpack.config.js')

var _config   = Object.create(webpack_config)
_config.debug = true
var _compiler = webpack(_config)

gulp.task('webpack', function(callback) {
    _compiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }))
        callback()
    })
})