module.exports = function (grunt) {
  grunt.registerTask('build', ['crearJson',
    'compileAssets',
    'linkAssetsBuild',
    'clean:build',
    'copy:build'
  ]);
};
