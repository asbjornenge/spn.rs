var gulp    = require('./gulpfile')
var express = require('express')
var gaze    = require('gaze')
var path    = require('path')
var tinylr  = require('tiny-lr-fork')()

var conf = {
    src  : 'src',
    dist : 'dist',
    port : 4000
}

/** Livereload */

tinylr.listen(35729)
var livereload = function (evt, filepath) {
    tinylr.changed({
        body: {
            files: path.relative(__dirname+'/dist', filepath)
        }
    })
}

/** Initial webpack */

gulp.tasks.webpack.fn()

/** Server */

var app = express()
    .use(express.static(__dirname + '/' + conf.dist))
    .listen(conf.port, function(){
        console.log('Server running at http://localhost:'+conf.port)
    })

/** Gaze */

gaze(['entry.js','modules/*.js'], function(err, watcher) {
    this.on('all', function(event, filepath) {
        gulp.tasks.webpack.fn()
    })
})

gaze('dist/bundle.js', function(err, watcher) {
    watcher.on('all', function(event, filepath) {
        livereload(event, filepath)
    })
})

