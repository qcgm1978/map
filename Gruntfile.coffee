
'use strict'
module.exports = (grunt) ->
	require("load-grunt-tasks") grunt
	flynaviConfig = grunt.file.readJSON("package.json")
	grunt.initConfig(
		flynavi: flynaviConfig
		rev:
			dist:
				files:
					src: [
						'<%= flynavi.dist %>/{,*/}*.js'
						'!<%= flynavi.dist %>/*.js'
						'<%= flynavi.dist %>/{,*/}*.css'
						'<%= flynavi.dist %>/{,*/}*.{png,jpg,jpeg,gif}'
						'!<%= flynavi.dist %>/images/{positionLight,bg_loading,bg_positiong_no,cur_position}.png'
					]
		useminPrepare:
			html: [ '<%= flynavi.app %>/start.html']
			options:
				dest: 'dist/'
		usemin:
			html: [ '<%= flynavi.dist %>/start.html']
		jsdoc:
			dist:
				src: [ "app/scripts/**/*.js", "app/flynavi/app/**/*.js" ]
				options:
					destination: "jsdoc"

		yuidoc:
			scripts:
				name: "scripts"
				description: "<%= flynavi.description %>"
				version: "<%= flynavi.version %>"
				url: "<%= flynavi.homepage %>"
				options:
					paths: "app/scripts/"
					outdir: "yuidoc/scripts/"

			flynavi:
				name: "<%= flynavi.name %>"
				description: "<%= flynavi.description %>"
				version: "<%= flynavi.version %>"
				url: "<%= flynavi.homepage %>"
				options:
					paths: "app/flynavi/app/"
					outdir: "yuidoc/flynavi/"

		clean:
			dist:
				files: [
					dot: true
					src: [ "<%= flynavi.dist %>/**/*"]
				]

		htmlmin:
			usemin:
							expand: true,
							cwd: 'app/'
							dest: 'dist/',
							src: ['start.html']
			navi:
				options:
					removeComments: true
					collapseWhitespace: true

				files:
					"dist/navi.htm": "dist/navi.htm"
					"dist/start.html": "dist/start.html"

		autoprefixer:
			options:
				browsers: [ "> 0.1%" ]

			dist:
				files: [
					expand: true
					dest: ""
					src: [ "dist/styles/*.css" ]
				]

		requirejs:
			start:
				options:
					baseUrl: "<%= flynavi.app %>/scripts"
					optimize: "uglify2"
					generateSourceMaps: true
					preserveLicenseComments: false
					useStrict: true
					out: "dist/combination.js"
					name: "../flynavi/app/app_flynavi"
					mainConfigFile: "app/flynavi/app/app_flynavi.js"

			navi:
				options:
					baseUrl: "<%= flynavi.app %>/scripts"
					optimize: "uglify2"
					generateSourceMaps: true
					preserveLicenseComments: false
					useStrict: true
					out: "dist/combination_navi.js"
					name: "../flynavi/app/controller/controller_nav"
					mainConfigFile: "app/flynavi/app/controller/controller_nav.js"

		uglify:
			require:
				files:
					"dist/bower_components/requirejs/require.js": [ "<%= flynavi.app %>/bower_components/requirejs/require.js" ]

			raxtone:
				files:
					"dist/flynavi/app/model/networkCommunication-raxtone.js": [ "app/flynavi/app/model/networkCommunication-raxtone.js" ]

			navControl:
				files:
					"dist/flynavi/app/controller/controller_navControl.js": "app/flynavi/app/controller/controller_navControl.js"

			toolbar:
				files:
					"dist/flynavi/app/controller/controller_toolbar.js": "app/flynavi/app/controller/controller_toolbar.js"

			pathDrawing:
				files:
					"dist/scripts/model/pathDrawing.js": "app/scripts/model/pathDrawing.js"
			cache:
				files:
					"dist/scripts/util/cache.js": "app/scripts/util/cache.js"
		uncss :
			dist:
				options:
					compress: true
					ignore: ['body','html','.other']
				files:
					"dist/styles/combination.css": [
						"app/start.html"
					]
		csscss:
				dist:
								src: ['dist/**/*.css']

		imagemin:
			dist:
				files: [
					expand: true
					cwd: "<%= flynavi.dist %>/"
					src: [ "images/**/*.{png,gif}", '!images/*bottom_logo.png', "flynavi/resources/images/**/*.{png,gif}" ]
					dest: "<%= flynavi.dist %>/"
				]

		copy:
			flynavi:
				files: [
					expand: true
					cwd: "<%= flynavi.app %>/"
					dest: "<%= flynavi.dist %>/"
					src: [   "images/**/*" ,'flynavi/**/*','!flynavi/resources/images/img/**/*','!flynavi/app/test/**/*','!flynavi/resources/style/','!**/*.js']
				]

		htmlrefs:
			dist:
				src: [ "dist/start.html", "app/navi.htm" ]
				dest: "dist/"
		manifest :
          options:
            verbose: true
            timestamp: true

          generate:
            options:
              basePath: "dist"
              exclude: ["combination_navi.js"]
            src: [
	            "**/*.{css,png,jpg,jpeg,gif}"
	            'combination.js'
	            'flynavi/app/model/route-view.js'
	            'scripts/model/pathDrawing.js'
	            'flynavi/app/model/networkCommunication-raxtone.js'
	            'flynavi/app/controller/controller_navControl.js'
	            'flynavi/app/controller/controller_toolbar.js'
            ]
            dest: "dist/app.manifest"

          develop:
            options:
              basePath: "app"
              exclude:['scripts/util/cache.js','scripts/lib/mapApi.js']
            src: ["{flynavi,scripts,styles,images}/**/*.{js,css,png,jpg,jpeg,gif}",'bower_components/requirejs/require.js']
            dest: "app/app.manifest"



		"regex-replace":
			replaceAjaxParamSpecifiedFile:
				src: [ "<%= flynavi.dist %>/flynavi/app/model/networkCommunication-raxtone.js" ]
				actions: [
					name: "del environment param of the specified file"
					search: "http://testwww.flynavi.cn"
					replace: ""
				]
#todo no effect, perhaps escape character not work
#			delTestCode:
##				src: [ "<%= flynavi.dist %>/combination_navi.js" ]
#			    src:['app/flynavi/app/controller/controller_nav.js']
#				actions: [
#					search: "\/\/\s*insert\s*start.*\/\/\s*insert\s*end"
#					replace: ""
#					flags: "gmi"
#				]
			replaceCatchFileRef:
							src: [ "<%= flynavi.dist %>/scripts/util/cache.js" ]
							actions: [
								name: "replace the ref js file with combination.js in catch.js"
								search: "scripts\/lib\/mapApi\.js"
								replace: "combination.js"
							]

			replaceEnvironment:
				src: [ "dist/{,*/}*.{htm,js,css,html}" ]
				filter: "isFile"
				actions: [
					name: "correct errors introduced by previous replacement"
					search: "<script(?:((?!script).)+)arget-script-min.js.+</script>"
					replace: ""
					flags: "g"
				,
					name: "replace code environment variable"
					search: "(test|verify)?(www.flynavi.cn)"
					replace: "<%= grunt.config('state') %>www.flynavi.cn"
					flags: "g"
				,
					name: "cancel Comments To Manifest"
					search: "<!--(<html manifest='app.manifest'>)-->"
					replace: "$1"
					flags: "g"
				]

		compress:
			dist:
				options:
# grunt.config.get: Get a value from the project's Grunt configuration.
					archive: "flynavi-web-mobile-<%= grunt.config('state') %>-<%= grunt.config('date') %>.zip"

				files: [
					expand: true
					src: [ "**" ]
					dest: ""
					cwd: "dist/"
				]
		'gh-pages' :
          options:
            add: true
            base: "./" #specify the current dir
            branch: "master"
            repo: "https://github.com/qcgm1978/map.git"
            user:
              name: "ZhangHong-liang"
              email: "qcgm197874@gmail.com"

          src: [
            "**/*"
            "!node_modules/**/*"
            "!dist/**/*"
            '!app/bower_components'
          ]

	)
	grunt.loadTasks('tasks');

