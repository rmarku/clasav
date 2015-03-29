module.exports = function (grunt) {
    grunt.registerTask('build', [
        'crearSprites',
        'crearJson',
        'crearMisiones',
        'compileAssets',
        'linkAssetsBuild',
        'clean:build',
        'copy:build'
    ]);
};
