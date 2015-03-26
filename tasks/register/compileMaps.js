/**
 * Created by martin on 02/11/14.
 */

module.exports = function (grunt) {
    grunt.registerTask('compileMaps', 'utiliza tmxLint para optimizar los mapas', function () {

        var async = require('async');
        var gruntdone = this.async();
        var tmxMaps = grunt.file.expand({filter: 'isFile'}, ['assets/data/map/*.tmx']);

        async.eachSeries(tmxMaps, function (tmx, callback) {
            var tmxLint = require('tmxLint').tmxLint;
            tmxLint(tmx, 'assets/data/map/compiled/', function (err) {
                if (err) {
                    return callback(err);
                    grunt.log.writeln("Error " + tmx );
                }
                grunt.log.writeln("Mapas " + tmx );
                callback();
            });
        }, gruntdone);
    });
};
