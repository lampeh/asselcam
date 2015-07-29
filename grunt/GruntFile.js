module.exports = function(grunt) {
    grunt.initConfig({
		gitinfo: {
			commands: {
				describe : ['describe', '--all', '--always', '--tags', '--long', '--dirty']
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
					'../web/js/common.js': [
						'../bower_components/jquery/dist/jquery.js',
						'../bower_components/bootstrap/dist/js/bootstrap.js',
						'../web/js/misc/css.escape.js',
						'../web/js/misc/jquery.socialshareprivacy.js',
						'../web/js/misc/socialshareprivacy.js'
					],

					'../web/js/video.js': [
//						'../bower_components/videojs/dist/video-js/video.dev.js',
						'../bower_components/videojs-playlists/dist/videojs-playlists.js'
					]
				}
			},

			css: {
				files: {
					'../web/css/common.css': [
						'../bower_components/bootstrap/dist/css/bootstrap.css',
						'../bower_components/bootstrap/dist/css/bootstrap-theme.css'
					]
				}
			}
		},

		uglify: {
			options: {
				preserveComments: 'some',
				banner: '/*! <%= gitinfo.describe %> */\n'
//				banner: '/*! <%= gitinfo.local.branch.current.name %> / <%= gitinfo.local.branch.current.SHA %> */\n'
			},

			all: {
				files: [{
					expand: true,
					src: ['../web/js/*.js', '!../web/js/*.min.js'],
					ext: '.min.js',
					extDot: 'last'
				}]
			}
		},

		cssmin: {
			all: {
				files: [{
					expand: true,
					src: [
						'../web/css/common.css',
						'../web/socialshareprivacy/socialshareprivacy.css',
						'../web/js/video-js/video-js.css',
					],
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
					src: ['../web/**/*.{png,jpg,gif}']
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-gitinfo');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['gitinfo', 'newer:imagemin', 'newer:concat', 'newer:uglify', 'newer:cssmin']);
}
