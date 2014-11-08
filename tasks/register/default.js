module.exports = function (grunt) {
  grunt.registerTask('default', ['hint', 'crearJson', 'compileAssets', 'linkAssets', 'watch']);
};
