/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

	//var materias = [{id:'M987ke',nombre:'ciencias naturales'},{id:'M9234',nombre:'ciencias naturales2'},{id:'M23423',nombre:'ciencias naturales3'}];

	//var materia_callback = function(err,newUsers){
    //cb();
	//};
    //Materia.create(materias).exec(materia_callback);


    var after_clase = function(err,new_clase) {

        console.log(new_clase);
        new_clase.mapas_instancias.add({ id:'mapa_instancia1'});
        new_clase.save();
        new_clase.mapas_instancias.add({ id:'mapa_instancia2'});
        new_clase.save();


        Alumno.create([{ e_mail:'fabricio_collino@gmail.com'},{ e_mail:'arrobado@mockeado.com'}]).exec(function ag(err,alumnos_creados){
            console.log(alumnos_creados);
            console.log(err);
            while(alumnos_creados.lenght){
                alumnos_creados.pop().clases.add({id: 'clase1'});
            };

            Jugador_en_vivo.create( {id:'jugador_vivo_1',mapa_instancia:'mapa_instancia1',alumno:'fabricio_collino@gmail.com'   },
                                    {id:'jugador_vivo_2',mapa_instancia:'mapa_instancia2',alumno:'arrobado@mockeado.com'        }).exec(cb);


        });

    }
    var after_mapa_instancia = function(err,new_mapas_instancias){

        Mapa_generico.create({id:'mapa_generico1',nombre:'calabozo siniestro'}).
            exec(function after(err,createdInstance_mapa_generico){
                //console.log(createdInstance);

                createdInstance_mapa_generico.mapas_instancias.add({ id:'mapa_instancia1'}); // .add no acepta arryas, no probar
                createdInstance_mapa_generico.mapas_instancias.add({ id:'mapa_instancia2'});
                createdInstance_mapa_generico.save();

                Clase.create({id:'clase1'}).exec(after_clase);
                console.log(createdInstance_mapa_generico);

            }
        );
    }

    Mapa_instancia.create([{ id:'mapa_instancia1'},{id:'mapa_instancia2'}]).exec(after_mapa_instancia);
};