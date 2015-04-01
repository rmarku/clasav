/**
 * Created by martin on 02/11/14.
 */

module.exports = function (grunt) {
    grunt.registerTask('crearMisiones', 'limpia e inserta todas las misiones en la BD', function () {


        var misiones = [];
        var misfiles = grunt.file.expand({filter: 'isFile'}, ['test/fixtures/misiones/**/*.json']);

        misfiles.forEach(function (file) {
            var misi = JSON.parse(grunt.file.read(file));
            misi.forEach(function (mision) {
                if (mision.new_mission)
                    mision.new_mission = JSON.stringify(mision.new_mission);
                misiones.push(mision);
            });
            grunt.log.writeln("Mision:  \t" + file);
        });

        grunt.file.write('test/fixtures/Misiones.json', JSON.stringify(misiones));
    });
};
