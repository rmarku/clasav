module.exports = function (grunt) {
    grunt.registerTask('test',
        [
            'crearJson',
            //'crearSprites',
            'jshint'
        ]);
};
