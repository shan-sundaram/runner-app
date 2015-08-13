( function () {
	'use strict';

		module.exports = function(grunt) {
			var jsDest = 'build/scripts', 
			 	cssDest = 'build/styles', 
			 	jsminExt = '.<%= pkg.version %>.min.js', 
			 	cssminExt = '.<%= pkg.version %>.min.css',
			 	appRoot = 'app';

			//Project configuration.
			grunt.initConfig({
				pkg: grunt.file.readJSON('package.json'),
				clean: ['build', '.tmp'],
				useminPrepare: {
					html: 'app/index.html',
					options: {
						dest: 'build'
					}
				},
				usemin: {
					html: ['build/index.html']
				},
				copy: {
					mainCopy: {
						src: 'app/index.html', dest: 'build/index.html'
					},
					appCopy: {
						expand: true,
		                cwd: 'app/views',
		                src: ['**/*.html'],
		                dest: 'build/views'
					}
				},
				uglify: {
					options: {
						report: 'min',
						mangle: false
					}
				},
				watch: {
					dev: {
						options: {
							livereload: true
						},
						files: ['**/*.html' , '**/*.js', '**/*.css'],
						tasks: ['jshint','build']
					}
				},
				jshint: {
					all: ['Gruntfile.js', 'app/services/**/*.js', 'app/controllers/**/*.js']
				}
			});

			//Load the plugin that provides the "uglify" task
			require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
			
			//Default task(s).
			grunt.registerTask('default', ['jshint']);
			grunt.registerTask('watch', ['watch']);
			grunt.registerTask('build', ['clean', 'copy', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin']);
		};
}) ();