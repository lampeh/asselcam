module.exports = function(grunt) {
	require('jit-grunt')(grunt);

	grunt.initConfig({
		gitinfo: {
			commands: {
				describe : ['describe', '--all', '--always', '--tags', '--long', '--dirty']
			}
		},

		copy: {
			static: {
				files: [{
					expand: true,
					cwd: 'src/static/',
					src: ['**'],
					dest: 'dist/'
				}]
			},

			videojs: {
				files: [{
					expand: true,
					cwd: 'bower_components/videojs/dist/video-js/',
					src: ['**'],
					dest: 'dist/video-js/'
				}]
			},

			bootfonts: {
				files: [{
					expand: true,
					cwd: 'bower_components/bootstrap/dist/fonts/',
					src: ['**'],
					dest: 'dist/fonts/'
				}]
			}
		},

		concat: {
			js: {
				options: {
					// Replace all 'use strict' statements in the code with a single one at the top
					banner: "'use strict';\n",
					process: function(src, filepath) {
						return '// Source: ' + filepath + '\n' +
							src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
					},
					separator: ';\n'
				},

				files: {
					'dist/js/common.js': [
						'bower_components/jquery/dist/jquery.js',
						'bower_components/bootstrap/dist/js/bootstrap.js',
						'src/js/misc/css.escape.js',
						'src/js/misc/jquery.socialshareprivacy.js',
						'src/js/misc/socialshareprivacy.js'
					],

					'dist/js/video.js': [
//						'bower_components/videojs/dist/video-js/video.dev.js',
						'bower_components/videojs-playlists/dist/videojs-playlists.js'
					]
				}
			}
		},

		uglify: {
			options: {
				preserveComments: /(?:^!|@(?:license|preserve|cc_on))/,
				banner: '/*! <%= gitinfo.describe %> */\n'
			},

			all: {
				files: [{
					expand: true,
					src: ['dist/js/*.js', '!dist/js/*.min.js'],
					ext: '.min.js',
					extDot: 'last'
				}]
			}
		},

		less: {
			options: {
				banner: '/*! <%= gitinfo.describe %> */\n',
				paths: ['bower_components'],
				report: 'min'
			},

			all: {
				files: {
					'dist/css/common.css': [
						'src/css/common.less'
					]
				}
			}
		},

		cssmin: {
			all: {
				files: [{
					expand: true,
					src: ['dist/**/*.css', '!dist/**/*.min.css'],
					ext: '.min.css',
					extDot: 'last'
				}]
			}
		},

		imagemin: {
			options: {
				use: [
					(require('imagemin-mozjpeg'))(),
					(require('imagemin-pngquant'))(),
					(require('imagemin-zopfli'))({ more: true })
				]
			},

			all: {
				files: [{
					expand: true,
					src: ['dist/**/*.{png,jpg,gif}']
				}]
			}
		},

		htmlmin: {
			options: {
				removeComments: true,
				collapseWhitespace: true
			},

			all: {
				files: [{
					expand: true,
					src: ['dist/**/*.html']
				}]
			}
		}
	});

//	grunt.registerTask('default', ['gitinfo', 'newer:copy', 'newer:less', 'newer:concat', 'newer:imagemin', 'newer:uglify', 'newer:cssmin', 'newer:htmlmin']);
	grunt.registerTask('default', ['gitinfo', 'newer:copy', 'newer:less', 'newer:concat', 'newer:imagemin', 'newer:uglify', 'newer:cssmin']);
}
