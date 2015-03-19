/**
 * ClaseController
 *
 * @description :: Server-side logic for managing clases
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    crearClaseProfesor: function (req,res) {
        var nombre              = req.param('nombre');
        var mapa_genericoID     = req.param('mapa_genericoID');
        var institucionID       = req.param('institucionID');

        //Crear Mapa Instancia a partir de mapa_genericoID
        Mapa_instancia.create({mapa_generico:mapa_genericoID}).exec(function createCB(err,mapa_instanciaCreado){

            if(mapa_instanciaCreado){
                console.log('mapa_instancia creado a partir del mapa_generico: ',mapa_instanciaCreado.mapa_generico);


                //Crear Clase con: nombre, mapa_instanciaID (recien creada), institucionID, User (profesor que la creo)
                Clase.create({nombre:nombre, mapa_instancia:mapa_instanciaCreado.id, institucion:institucionID}).exec(function createCB(err,claseCreada){

                    if(claseCreada) {

                        //Asociamos la claseCreada con el mapa_instanciaCreado
                        Mapa_instancia.update({id: mapa_instanciaCreado.id}, {clase: claseCreada.id}).exec(function afterwards(err, updated) {

                            if (updated) {
                                console.log('Clase creada: ' + claseCreada.nombre);
                                return res.json(claseCreada);
                            }
                            else res.json(err);
                        });
                    }
                    else res.json(err);

                });

            }
        });

    }
};

