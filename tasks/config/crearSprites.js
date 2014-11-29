module.exports = function (grunt) {

    grunt.config.set('crearSprites', {
        cabezaH: {
            name: 'hairFront',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['a', 'b', 'c'],
            cantidad: 15,
            sex: 'masculino'
        },
        cabezaM: {
            name: 'hairFront',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['a', 'b', 'c'],
            cantidad: 15,
            sex: 'femenino'
        },
        basicH: {
            name: 'basic',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['f', 'b'],
            cantidad: 3,
            sex: 'masculino'
        },
        basicM: {
            name: 'basic',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['f', 'b'],
            cantidad: 3,
            sex: 'femenino'
        },
        pantsH: {
            name: 'pants',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['a', 'm'],
            cantidad: 8,
            sex: 'masculino'
        },
        pantsM: {
            name: 'pants',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['a', 'm'],
            cantidad: 10,
            sex: 'femenino'
        },
        shirtH: {
            name: 'shirt',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['a', 'm'],
            cantidad: 13,
            sex: 'masculino'
        },
        shirtM: {
            name: 'shirt',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['a', 'm'],
            cantidad: 27,
            sex: 'femenino'
        },
        footH: {
            name: 'foot',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['a', 'm'],
            cantidad: 3,
            sex: 'masculino'
        },
        footM: {
            name: 'foot',
            ambos: true,
            folder: 'assets/data/sprites/characters/',
            width: 128,
            height: 192,
            filas: ['a', 'm'],
            cantidad: 4,
            sex: 'femenino'
        }

    });

    //grunt.loadNpmTasks('crearSprites');
};
