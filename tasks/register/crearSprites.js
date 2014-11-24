/**
 * Created by martin on 02/11/14.
 */

module.exports = function (grunt) {
    grunt.registerTask('crearSprites', 'crea el archivo resources.json para melon', function () {
        var fs = require('fs');
        var gmagick = require('gm');
        var execFile = require('child_process').execFile;
        var optipng = require('optipng-bin').path;

        var resource = [
            {
                name: 'hairFront',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['a', 'b', 'c'],
                cantidad: 15,
                sex: 'masculino'
            },
            {
                name: 'hairFront',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['a', 'b', 'c'],
                cantidad: 15,
                sex: 'femenino'
            },
            {
                name: 'basic',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['f', 'b'],
                cantidad: 3,
                sex: 'masculino'
            },
            {
                name: 'basic',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['f', 'b'],
                cantidad: 3,
                sex: 'femenino'
            },
            {
                name: 'pants',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['a', 'm'],
                cantidad: 8,
                sex: 'masculino'
            },
            {
                name: 'pants',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['a', 'm'],
                cantidad: 10,
                sex: 'femenino'
            },
            {
                name: 'shirt',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['a', 'm'],
                cantidad: 13,
                sex: 'masculino'
            },
            {
                name: 'shirt',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['a', 'm'],
                cantidad: 27,
                sex: 'femenino'
            },
            {
                name: 'foot',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['a', 'm'],
                cantidad: 3,
                sex: 'masculino'
            },
            {
                name: 'foot',
                ambos: true,
                folder: 'assets/data/sprites/characters/',
                width: 128,
                height: 192,
                filas: ['a', 'm'],
                cantidad: 4,
                sex: 'femenino'
            }
        ];

        resource.forEach(function (res) {
            var gm = gmagick();

            grunt.log.writeln(res.folder + res.sex + '/' + res.name + ".png");

            for (var i = 1; i <= res.cantidad; i++) {

                for (var letra = 0; letra < res.filas.length; letra++) {
                    if (grunt.file.exists(res.folder + res.sex + '/' + res.name + '/' + i + res.filas[letra] + '.png')) {
                        gm = gm.in('-page', '+' + (i - 1) * res.width + '+' + letra * res.height);
                        gm = gm.in(res.folder + res.sex + '/' + res.name + '/' + i + res.filas[letra] + '.png');
                    }
                }
            }

            gm = gm.background('none').quality(100);
            gm.write(res.folder + res.sex + '/' + res.name + ".png", function (err) {
                if (err)
                    grunt.log.writeln(err);
                else
                    execFile(optipng, ['-o7', res.folder + res.sex + '/' + res.name + ".png"], function (err) {
                        if (err) {
                            throw err;
                        } else {
                            grunt.log.writeln('Ok');
                        }
                    });

            });
        });
    });
};
