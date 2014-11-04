/**
 * Created by martin on 02/11/14.
 */
module.exports = function (grunt) {

    grunt.config.set('jshint', {
        all: ['api/**/*.js', 'test/**/*.js', 'data/**/*.js',
            'assets/js/controladores/**/*.js',
            'assets/js/juego/**/*.js',
            'assets/js/app.js',
            'assets/js/helpers.js'
        ],
        options:{
            laxcomma: true
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};