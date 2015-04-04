module.exports = function(grunt) {
    grunt.initConfig({
		concat: {
			options: {
				// Replace all 'use strict' statements in the code with a single one at the top
				banner: "'use strict';\n",
				process: function(src, filepath) {
					return '// Source: ' + filepath + '\n' +
						src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
				},
				separator: ';\n'
			},

			all: {
				files: {
					'../web/js/dist/common.js': [
						'../web/js/css.escape.js',
						'../web/js/jquery/jquery.js',
						'../web/js/jquery/jquery.socialshareprivacy.js',
						'../web/js/bootstrap.js',
						'../web/js/socialshareprivacy.js'
					],

					'../web/js/dist/video.js': [
//						'../web/js/video-js/video.js',
						'../web/js/videojs-playlists.js'
					]
				}
			}
		},

		uglify: {
			options: {
				preserveComments: 'some',
//				banner: '/*! <%= gitinfo.local.branch.current.name %> / <%= gitinfo.local.branch.current.SHA %> */\n'
			},

			all: {
				files: [{
					expand: true,
					src: ['../web/js/dist/*.js', '!../web/js/dist/*.min.js'],
					ext: '.min.js',
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
		},

		cssmin: {
			all: {
				files: [{
					expand: true,
					src: [
						'../web/css/bootstrap.css',
						'../web/socialshareprivacy/socialshareprivacy.css',
						'../web/js/video-js/video-js.css',
					],
					ext: '.min.css',
					extDot: 'last'
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

	grunt.registerTask('default', ['gitinfo', 'concat', 'newer:uglify', 'newer:imagemin', 'newer:cssmin']);
}
