var gulp       = require('./gulpfile')
var express    = require('express')
var gaze       = require('gaze')
var bodyParser = require('body-parser')
var tinylr     = require('tiny-lr-fork')()

var conf = {
    src  : 'src',
    dist : 'dist',
    port : 4000
}

tinylr.listen(35729)

/**
 * App.
 */

// gulp.tasks.default.dep.forEach(function(task) {
//     gulp.tasks[task].fn()
// })

gulp.tasks.webpack.fn()

var app = express()
    .use(express.static(__dirname + '/' + conf.dist))
    .listen(conf.port, function(){
        console.log('Server running at http://localhost:'+conf.port)
    })

// livereload = require('livereload');
// server = livereload.createServer();
// server.watch(__dirname + '/' + conf.dist);

gaze(['entry.js','modules/*.js'], function(err, watcher) {
    this.on('all', function(event, filepath) {
        gulp.tasks.webpack.fn()
    })
})

// gaze(['src/sass/*.scss'], function(err, watcher) {
//     this.on('all', function(event, filepath) {
//         gulp.tasks.sass.fn()
//     })
// })
// gaze(['src/js/*.js'], function(err, watcher) {
//     this.on('all', function(event, filepath) {
//         gulp.tasks.browserify.fn()
//     })
// })