module.exports = function (grunt) {
    grunt.registerTask('default', ['crearSprites', 'hint', 'crearJson', 'compileAssets', 'linkAssets', 'watch']);
};
