module.exports = function (grunt) {
    grunt.registerTask('build', [
        'crearSprites',
        'crearJson',
        'compileAssets',
        'linkAssetsBuild',
        'clean:build',
        'copy:build'
    ]);
};
