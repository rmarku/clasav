module.exports = function (grunt) {
	grunt.registerTask('buildProd', ['crearJson',
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};
