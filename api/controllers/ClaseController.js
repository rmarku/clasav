/**
 * ClaseController
 *
 * @description :: Server-side logic for managing clases
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    crearClaseProfesor: function (req,res) {

        var userID = req.session.passport.user;
        var nombre = req.param('nombre');
        var mapa_genericoID = req.param('mapa_genericoID');
        var institucionID = req.param('institucionID');

        //Crear Mapa Instancia a partir de mapa_genericoID
        Mapa_instancia.create({mapa_generico: mapa_genericoID}).exec(function createCB(err, mapa_instanciaCreado) {

            if(err){
                res.json(err);
            }

            console.log('mapa_instancia creado a partir del mapa_generico: ', mapa_instanciaCreado.mapa_generico);

            //Crear Clase con: nombre, mapa_instanciaID (recien creada), institucionID, User (profesor que la creo)
            Clase.create({nombre: nombre, mapa_instancia: mapa_instanciaCreado.id, institucion: institucionID}).exec(function createCB(err, claseCreada) {

                if(err){
                    res.json(err);
                }

                Clase.findOne({id:claseCreada.id}).populate('users').populate('mapas_instancias').exec(function(err,claseEncontrada){

                    if(err){
                        res.json(err);
                    }
                    //Asociamos la claseCreada con el User que la creó
                    claseEncontrada.users.add(userID);
                    //Asociamos la claseCreada con el mapa_instanciaCreado
                    claseEncontrada.mapas_instancias.add(mapa_instanciaCreado.id);

                    //Guardamos los cambios y enviamos respuesta al Cliente
                    claseEncontrada.save(function (err) {
                        if(err){
                            res.json(err);
                        }

                        console.log('Clase creada: ' + claseCreada.nombre);
                        return res.json(claseEncontrada);


                    });
                });
            });
        });
    },


    solicitarClase: function (req,res) {


    }

};

