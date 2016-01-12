( function () {
	'use strict';

		module.exports = function(grunt) {
			var jsDest = 'build/scripts', 
			 	cssDest = 'build/styles', 
			 	jsminExt = '.<%= pkg.version %>.min.js', 
			 	cssminExt = '.<%= pkg.version %>.min.css',
			 	appRoot = 'runner';

			//Project configuration.
			grunt.initConfig({
				pkg: grunt.file.readJSON('package.json'),
				clean: ['build', '.tmp'],
				useminPrepare: {
					html: 'runner/index.html',
					options: {
						dest: 'build'
					}
				},
				usemin: {
					html: ['build/index.html']
				},
				copy: {
					mainCopy: {
						src: 'runner/index.html', dest: 'build/index.html'
					},
					appCopy: {
						expand: true,
		                cwd: 'runner',
		                src: ['*.html'],
		                dest: 'build'
					},
					fontsCopy: {
						expand: true,
		                cwd: 'app/css',
		                src: ['*.css'],
		                dest: 'build/styles'
					},
					assetsCopy: {
						expand: true,
		                cwd: 'runner/assets',
		                src: ['**/*'],
		                dest: 'build/assets'
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
						files: ['runner/*.html','runner/**/*.js','runner/**/*.css', '!e2e-tests/*'],
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
					all: ['Gruntfile.js']
				}
			});
			
			grunt.event.on('watch', function(action, filepath, target) {
			  	grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
			  	grunt.config(['clean', 'copy', 'useminPrepare', 'cssmin', 'uglify', 'usemin'], filepath);
			});
			//Load the plugin that provides the "uglify" task
			require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
			
			//Default task(s).
			grunt.registerTask('default', ['jshint']);
			
			grunt.registerTask('build', ['clean', 'copy', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin']);
		};
}) ();