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
        var userID = req.session.passport.user;
        var claseID = req.param('claseID');

        //realizar un update en clase_x_user

        Clase.findOne({id:claseID}).populate('users').exec(function afterwards(err,clase){

            if (err) {
                return;
            }

            clase.users.add(userID);

            claseEncontrada.save(function (err) {
                if(err){
                    res.json(err);
                }

                //Crear Mapa Instancia a partir de mapa_genericoID
                Clase_x_user.create({user:userID, clase:claseID}).exec(function createCB(err,clase_x_user) {

                    if (err) {
                        res.json(err);
                    }

                    res.json(clase_x_user);

                });
            });
        });
    },

    get_misClases_conUsers: function (req,res) {

        var userID = req.session.passport.user;
        var misClases = [];

        Clase.find().populate('users').exec(function(err,todasLasClases) {

            if (err) {
                res.json(err);
            }

            //Recorremos cada clase
            todasLasClases.forEach(function(clase){
                //Recorremos  cada user de cada clase
                clase.users.forEach(function(user,index){
                    //Si el User esta dentro de la clase
                    if (user.id == userID){
                        misClases.push(clase);
                        return;
                    }

                });
            });

            //Recorremos cada clase
            misClases.forEach(function(clase) {
                //Recorremos  cada user de cada clase
                clase.users.forEach(function (user, index) {

                    //Buscamos en cada User, la situacion en que se encuentra
                    // con respecto cada clase
                    //(dato que esta dentro del modelo Clase_x_user)
                    Clase_x_user.findOne({clase: clase.id, user: user.id}).exec(function (err, local_clase_x_user) {
                        if (err) {
                            res.json(err);
                        }

                        if (local_clase_x_user) {
                            //Asignamos a cada usuario su situacion con la clase
                            user.clase_x_user = local_clase_x_user;
                        }
                    });
                });
            });


            return res.json(misClases);
        });
    }

};

