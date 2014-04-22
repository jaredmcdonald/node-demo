module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			compile: {
				options: {
					baseUrl: './public/js',
					mainConfigFile: './public/js/main-dev.js',
					name: 'main-dev',
					out: './public/js/main.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.registerTask('default', ['requirejs']);

};