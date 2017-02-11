/**
 * Created by martin on 02/11/14.
 */

module.exports = function (grunt) {
    grunt.registerTask('crearJson', 'crea el archivo resources.json para melon', function () {

        var Resources = [];

        function baseName(str) {
            str = str.replace(/\\/g, '/');
            var base = new String(str).substring(str.lastIndexOf('/') + 1);
            if (base.lastIndexOf(".") != -1)
                base = base.substring(0, base.lastIndexOf("."));
            return base;
        }

        var tmxMaps = grunt.file.expand({filter: 'isFile'}, ['assets/data/map/*.tmx']);
        var tileImages = grunt.file.expand({filter: 'isFile'}, ['assets/data/map/**/*.png']);
        var music = grunt.file.expand({filter: 'isFile'}, ['assets/data/music/**/*.ogg']);
        var sfx = grunt.file.expand({filter: 'isFile'}, ['assets/data/sfx/**/*.ogg']);
        // var sprites = grunt.file.expand({filter: 'isFile'}, ['assets/data/sprites/characters/**/*.png']);
        var sprites = grunt.file.expand({filter: 'isFile'},
            [
                'assets/data/sprites/characters/masculino/*.png',
                'assets/data/sprites/characters/femenino/*.png',
                'assets/data/sprites/characters/npc/*.png'
            ]);

        tmxMaps.forEach(function (tmx) {
            var data = {};
            data['name'] = baseName(tmx);
            data['type'] = 'tmx';
            data['src'] = tmx.replace('assets/', '');
            Resources.push(data);
        });

        tileImages.forEach(function (tile) {
            var data = {};
            data['name'] = baseName(tile);
            data['type'] = 'image';
            data['src'] = tile.replace('assets/', '');
            Resources.push(data);
        });

        music.forEach(function (mu) {
            var data = {};
            data['name'] = baseName(mu);
            data['type'] = 'audio';
            data['src'] = mu.replace('assets/', '').replace(baseName(mu) + '.ogg', '');
            Resources.push(data);
        });

        sfx.forEach(function (sf) {
            var data = {};
            data['name'] = baseName(sf);
            data['type'] = 'audio';
            data['src'] = sf.replace('assets/', '').replace(baseName(sf) + '.ogg', '');
            Resources.push(data);
        });

        sprites.forEach(function (sp) {
            var data = {};
            data['name'] = sp.replace('assets/data/sprites/characters/', '');
            data['type'] = 'image';
            data['src'] = sp.replace('assets/', '');
            Resources.push(data);
        });
        grunt.log.writeln("Mapas:  \t" + tmxMaps.length);
        grunt.log.writeln("Tiles:  \t" + tileImages.length);
        grunt.log.writeln("Musica: \t" + music.length);
        grunt.log.writeln("Sprites:\t" + sprites.length);

        grunt.file.write('assets/api/resources.json', JSON.stringify(Resources));
    });
};
