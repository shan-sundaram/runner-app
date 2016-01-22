'use strict';
var SERVER_PORT = 9000;
var TEST_PORT = 9000;
var LIVERELOAD_PORT = 35729;
// the livereload script is not inserted when running grunt test
// if the TEST_PORT is not 9000. You win a cookie if you find why

module.exports = function (grunt) {

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        wait: {
            longtime: {
                options: {
                    delay: 1000000
                }
            }
        },
        replace: {
            server: {
                src: 'app/assets/scss/main.scss',
                overwrite: true,
                replacements: [{
                    from: /\$icon\-font\-path:.*/g,
                    to: '$icon-font-path: \'../../bower_components/bootstrap-sass-official/assets/fonts/bootstrap\';'
                }, {
                    from: /\$fa\-font\-path:.*/g,
                    to: '$fa-font-path: \'../../bower_components/font-awesome/fonts\';'
                }]
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            js: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['app/assets/js/**/*.js']
            }
        },
        focus: {
            dev: {
                exclude: ['test']
            },
            test: {
                include: ['test']
            }
        },
        watch: {
            options: {
                livereload: LIVERELOAD_PORT
            },
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: [
                    '<%= jshint.js.src %>',
                    '/app/components/*/*.js',
                    '/app/scripts/*.js'
                ],
                tasks: ['jshint:js']
            },
            css: {
                files: 'app/assets/css/*.css'
            },
            html: {
                files: [
                    'app/*.html',
                    'app/views/*.html'
                ]
            },
            test: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: ['app/assets/js/{,*/}/*.js', 'test/spec/{,*/}/*.js'],
                tasks: ['test:true']
            }
        },
        open: {
            server: {
                path: 'http://localhost:' + SERVER_PORT
            },
            test: {
                path: 'http://localhost:' + TEST_PORT
            }
        },
        express: {
            /* jshint camelcase: false */
            options: {
                port: SERVER_PORT,
                script: 'server/server.js'
            },
            server: {
                options: {
                    debug: true,
                    node_env: 'development'
                }
            },
            dist: {
                options: {
                    debug: false,
                    node_env: 'production'
                }
            },
            test: {
                options: {
                    port: TEST_PORT,
                    debug: true,
                    node_env: 'test'
                }
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'jshint',
                'build',
                'express:dist',
                'open:server',
                'wait:longtime'
            ]);
        }

        grunt.task.run([
            'replace:server',
            'express:server',
            'open:server',
            'focus:dev'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        // isConnected is true when started from watch
        isConnected = Boolean(isConnected);
        var testTasks = [
            'replace:server',
            'express:test',
            'open:test',
            'focus:test'
        ];

        if (isConnected) {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('open:test'), 1);
            testTasks.splice(testTasks.indexOf('express:test'), 1);
        }

        return grunt.task.run(testTasks);
    });
};