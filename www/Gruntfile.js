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
		},
		compass: {
	    dist: {
	      options: {
	      	force: true,
	      	noLineComments: true,
	      	//outputStyle: "expanded",
	      	outputStyle: "compressed",
	        sassDir: './public/sass',
	        cssDir: './public/css'
	      }
	    }
	  }
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.registerTask('default', ['requirejs', 'compass']);

};