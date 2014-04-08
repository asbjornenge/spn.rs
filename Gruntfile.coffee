#### GLOBALS ####

'use strict'

module.exports = (grunt) ->

    #### LOAD / CONFIG ####

    require('time-grunt')(grunt)
    require('load-grunt-tasks')(grunt)

    config =
        app  : 'assets/app'
        dist : 'assets/dist'
        test : 'assets/test'

    #### INITCONFIG ####

    @initConfig
        yeoman : config,
        pkg    : @file.readJSON 'package.json'

        ## STYLUS
        #

        stylus:
            app:
                files:
                    '.tmp/app/styles/main.css' : ['<%= yeoman.app %>/styles/*.styl']

        ## CONCAT
        #
        # Auto by useminPrepare


        ## CSSMIN
        #

        cssmin:
            options:
                banner : '/* BANNER */'

        ## REACT
        #

        react:
            app:
                options:
                    extension:    'jsx'
                    ignoreMTime:  false
                files:
                    '.tmp/app/components': '<%= yeoman.app %>/components'

        ## REQUIREJS
        #

        requirejs:
            app:
                options:
                    baseUrl        : '<%= yeoman.app %>/scripts/'
                    mainConfigFile : '<%= yeoman.app %>/scripts/main.js'
                    name           : 'main'
                    out            : '<%= yeoman.dist %>/main.min.js'
                    optimize       : 'uglify'
                    almond         : true
                    findNestedDependencies: true
                    preserveLicenseComments: false
                    paths:
                        'comp' : '../../../.tmp/app/components'


        ## USEMIN PREPARE
        #

        useminPrepare:
            html: '<%= yeoman.app %>/index.html'
            options:
                dest: '<%= yeoman.dist %>'

        ## HTMLREFS
        #

        htmlrefs:
            dist:
                src: '<%= yeoman.app %>/index.html'
                dest : '<%= yeoman.dist %>'

        ## WATCH
        #

        watch:
            styles:
                files: ['<%= yeoman.app %>/styles/{,*/}*.styl']
                tasks: []
            livereload:
                options:
                    livereload: '<%= connect.options.livereload %>'
                files : [
                    '<%= yeoman.test %>/{,*/}*.js',
                    '<%= yeoman.app %>/scripts/*.js',
                    '<%= yeoman.app %>/components/*.jsx',
                    '<%= yeoman.app %>/styles/{,*/}*.styl'
                ]
                tasks : ['stylus:app','react:app']

        ## SERVER
        #

        connect:
            options:
                port: 9000
                livereload: 35729
                # change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            livereload:
                options:
                    open: true
                    base: [
                        '.tmp'
                        'assets'
                    ]
                    middleware : (connect, options) -> [
                        connect.static(options.base[0])
                        connect.static(options.base[1])
                    ]

        ## CLEAN
        #

        clean:
            dist:
                files: [
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                ]
            tmp: '.tmp'

        ## COPY
        #

        copy:
            dist:
                files: [
                    {
                        src: '<%= yeoman.dist %>/main.min.js'
                        dest: '<%= yeoman.dist %>/<%= pkg.version %>/main.min.js'
                    }
                    {
                        src: '<%= yeoman.dist %>/main.min.css'
                        dest: '<%= yeoman.dist %>/<%= pkg.version %>/main.min.css'
                    }
                    {
                        src: '<%= yeoman.dist %>/index.html'
                        dest: '<%= yeoman.dist %>/<%= pkg.version %>/index.html'
                    }
                ]

    #### TASKS ####

    ## Server
    #

    @registerTask 'server', (target) =>
        @task.run 'clean:tmp'
        @task.run 'react:app'
        @task.run 'stylus:app'
        @task.run 'connect:livereload'
        @task.run 'watch'

    ## Build
    #

    @registerTask 'build', (target = 'all') =>
        @task.run 'clean:tmp'
        @task.run 'react:app'
        @task.run 'stylus:app'
        @task.run 'useminPrepare'
        @task.run 'concat'
        @task.run 'cssmin'
        @task.run 'requirejs'
        @task.run 'htmlrefs:dist'
        @task.run 'copy:dist'

    ## Default
    #

    @registerTask 'default', ['test']
