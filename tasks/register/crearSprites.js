/**
 * Created by martin on 02/11/14.
 */

module.exports = function (grunt) {
    grunt.registerMultiTask('crearSprites', 'crea Sprites con todas las imagenes.', function () {
        var fs = require('fs');

        var gmagick;
        var isWin = /^win/.test(process.platform);
        if (!isWin)
            gmagick = require('gm').subClass({imageMagick: true});
        else
            gmagick = require('gm');

        var execFile = require('child_process').execFile;
        var optipng = require('optipng-bin').path;
        var done = this.async();
        var res = this.data;

        var gm = gmagick();

        for (var i = 1; i <= res.cantidad; i++) {

            for (var letra = 0; letra < res.filas.length; letra++) {
                if (grunt.file.exists(res.folder + res.sex + '/' + res.name + '/' + i + res.filas[letra] + '.png')) {
                    gm = gm.in('-page', '+' + (i - 1) * res.width + '+' + letra * res.height);
                    gm = gm.in(res.folder + res.sex + '/' + res.name + '/' + i + res.filas[letra] + '.png');
                }
            }
        }

        grunt.log.writeln(res.name + ".png");


        gm = gm.background('none').quality(100).mosaic();
        gm.write(res.folder + res.sex + '/' + res.name + ".png", function (err) {

            if (err) {
                grunt.log.writeln(err);
                done(false);
            } else {
                if (process.env.NODE_ENV != 'development') {
                    grunt.log.writeln('Sprite: OK');
                    execFile(optipng, ['-o7', res.folder + res.sex + '/' + res.name + ".png"], function (err) {
                        if (err) {
                            throw err;
                            done(false);
                        } else {
                            grunt.log.writeln('Opti: Ok');
                            done();
                        }
                    });
                } else {
                    done();
                }
            }
        });
    });
};
