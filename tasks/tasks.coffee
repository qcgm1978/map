"use strict"
module.exports = (grunt) ->
	grunt.registerTask "generateJsDoc", [
	  "clean:jsdoc"
	  "jsdoc"
	]
	grunt.registerTask "generateYuiDoc", [
	  "clean:yuidoc"
	  "yuidoc"
	]

	grunt.task.registerTask "uncssTest", "A sample task that logs stuff.", (arg) ->
		if arguments.length is 0
			grunt.log.writeln @name + ", no args"
		else
			arg = arg ? ''
			arg = ""  if arg is "formal"
			grunt.config.set('state',arg)
			grunt.log.writeln grunt.config.get 'state'
			grunt.task.run [ 'clean','useminPrepare', "copy", "requirejs", "uglify",'uncss', "autoprefixer",'imagemin', 'htmlmin:usemin',"htmlrefs", "regex-replace",'rev','usemin', "htmlmin:navi",'manifest:generate',"compress" ]

	#	grunt.task.registerTask "default", "A sample task that logs stuff.", (arg) ->
	#			if arguments.length is 0
	#				grunt.log.writeln @name + ", no args"
	#			else
	#				arg = arg ? ''
	#				arg = ""  if arg is "formal"
	#				grunt.config.set('state',arg)
	#				grunt.log.writeln grunt.config.get 'state'
	#				grunt.task.run [ 'clean','useminPrepare', "copy", "requirejs", "uglify",'concat', "autoprefixer",'cssmin','imagemin', 'htmlmin:usemin',"htmlrefs", "regex-replace",'rev','usemin', "htmlmin:navi",'manifest:generate',"compress" ]

	getTasksArr= ->
	        arr = [
		        "regex-replace",'rev','usemin', "htmlmin:navi",'manifest:generate'
	        ]

	grunt.task.registerTask('default', 'execute tasks by param by grunt cli', (arg, arg1) ->
      grunt.config.get('executeCustomTasks')(arg, arg1,getTasksArr())

	)
