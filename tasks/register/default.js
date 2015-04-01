module.exports = function (grunt) {
    grunt.registerTask('default', [
        'crearSprites',
        'crearMisiones',
        'hint',
        'crearJson',
        'compileAssets',
        'linkAssets',
        'watch'
    ]);
};
