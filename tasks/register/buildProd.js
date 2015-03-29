module.exports = function (grunt) {
    grunt.registerTask('buildProd', [
        'crearSprites',
        'crearJson',
        'compileAssets',
        'crearMisiones',
        'concat',
        'uglify',
        'cssmin',
        'linkAssetsBuildProd',
        'clean:build',
        'copy:build'
    ]);
};
