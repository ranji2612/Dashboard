module.exports = function(grunt) {
	grunt.initConfig({
		
		//------------Start the server
		express :  {
			options : {
				spawn : false
			},
			dev : {
				options : {
					script : 'server.js',
					background: false
				}
			},
			prod : {
			}
		},
		
		//------------Check all js files for errors
		jshint: {
			all : ['app/**/*.js','scripts/**/*.js']
		},
		
		//Run Tests using mocha
		mochaTest: {
		  test: {
		    options: {
			  reporter: 'min',
			  quiet: true
		    }
  		  },
		  src: ['app/**/*.test.js','scripts/**/*.test.js']
		},		
		
		//------------Clean the previous files
		clean: ['dist/js/app.min.js','scripts/fullAppWithAnnotation.js'],
		
		//------------Annotate First
		//Stroing the annotated files in scripts/fullAppWithAnnotation.js
		//which is then ugligied and moved to dist/js/app.min.js
		ngAnnotate : {
			demo : {
				files : {
					'scripts/fullAppWithAnnotation.js' : ['scripts/*.js','scripts/**/*.js']
				}
			}
		},
		
		//------------Uglify all js files and put into app.min.js
		uglify : {
			build : {
				files : {
					'dist/js/app.min.js' : ['scripts/fullAppWithAnnotation.js']//,'public/js/*.js']
				}
			}
		}
		
		
		//------------Ugligy all the css files
		
		
	});
	
	//Load task before registering
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-express-server');
	
	
	//Register the Grunt task with required modules
	grunt.registerTask('default',['clean','jshint','ngAnnotate','uglify','express:dev']);
	grunt.registerTask('dev',['clean','jshint','express:dev']);
	grunt.registerTask('test',['clean','jshint','mochaTest']);
};