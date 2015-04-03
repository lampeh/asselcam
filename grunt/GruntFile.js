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
			common: {
				nonull: true,
				src: [
					'../web/js/css.escape.js',
					'../web/js/jquery.js',
					'../web/js/jquery.socialshareprivacy.js',
					'../web/bootstrap/js/bootstrap.js'
				],
				dest: '../web/js/common.js'
			},
			video: {
			}
		},

		uglify: {
			options: {
			},
			common: {
				files: {
					'../web/js/common.min.js': ['../web/js/common.js']
				}
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
			common: {
				files: [{
					expand: true,
					src: ['../web/**/*.{png,jpg,gif}']
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);
}
