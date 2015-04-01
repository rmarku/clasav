module.exports = function (grunt) {
    grunt.registerTask('test',
        [
            'crearJson',
            'crearMisiones',
            //'crearSprites',
            'jshint'
        ]);
};
