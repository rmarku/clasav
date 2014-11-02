module.exports = function (grunt) {
	grunt.registerTask('default', ['hint','compileAssets', 'linkAssets',  'watch']);
};
