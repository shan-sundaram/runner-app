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
					},
					fontsCopy: {
						expand: true,
		                cwd: 'app/css/fonts',
		                src: ['**/*'],
		                dest: 'build/styles/fonts'
					}
				},
				uglify: {
					options: {
						report: 'min',
						mangle: false
					}
				},
				watch: {
					scripts: {
						options: {
							spawn: false,
							event: ['all']
						},
						files: ['app/**/*.html','app/**/*.js','app/**/*.css', '!e2e-tests/*'],
					    tasks: ['build']
					    // , 'css/**/*.scss', '!lib/dontwatch.js'],
						// dev: {
						// 	options: {
						// 		livereload: true
						// 	},
						// 	files: ['**/*.html' , '**/*.js', '**/*.css'],
						// 	tasks: ['jshint','build']
						// }
					}
				},
				jshint: {
					all: ['Gruntfile.js', 'app/services/**/*.js', 'app/controllers/**/*.js']
				}
			});
			
			grunt.event.on('watch', function(action, filepath, target) {
			  	grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
			  	grunt.config(['clean', 'copy', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin'], filepath);
			});
			//Load the plugin that provides the "uglify" task
			require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
			
			//Default task(s).
			grunt.registerTask('default', ['jshint']);
			
			grunt.registerTask('build', ['clean', 'copy', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin']);
		};
}) ();