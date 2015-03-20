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
        var mapa_instanciaCentralCreado = "";


        //Crear Clase con Nombre e institucion
        Clase.create({nombre: nombre, institucion: institucionID}).exec(function createCB(err, claseCreada) {

            if(err){
                console.log(err);
                res.json(err);
                return;
            }

            ///////////////////// Generamos mapa_instancia central y secundarios/////////////
            //Asociamos la claseCreada con el User que la creó
            claseCreada.users.add(userID);

            //Asociamos el User a la clase recien creada
            claseCreada.save(function (err) {
                if(err){
                    console.log(err);
                    res.json(err);
                    return;
                }
                ///////////////////// FIN Generamos mapa_instancia central y secundarios/////////////

                ///////////////////// Generamos mapa_instancia central y secundarios////////////////////////////////////////////////////////////////////////////////////////////////
                Mapa_generico.findOne({id: mapa_genericoID}).exec(function afterwards(err, mapa_generico) {

                    Dependencia_mapa_generico.findOne({id: mapa_generico.dependencia_mapa_generico}).populate('mapas_genericos').exec(function afterwards(err, dependencia_mapa_generico) {

                        dependencia_mapa_generico.mapas_genericos.forEach(function (mapa_generico) {

                            //Creo los mapas secundarios y el central inclusive
                            Mapa_instancia.create(
                                {
                                    mapa_generico: mapa_generico.id,
                                    nombre: mapa_generico.nombre,
                                    tipo: mapa_generico.tipo,
                                    clase: claseCreada
                                }
                            ).exec(function createCB(err, mapa_instancia) {

                                    if (err) {
                                        console.log(err);
                                        res.json(err);
                                        return;
                                    }

                                    if(mapa_instancia.mapa_generico == mapa_genericoID){

                                        mapa_instanciaCentralCreado = mapa_instancia;
                                    }
                                });
                        });
                        ///////////////////// FIN Generamos mapa_instancia central y secundarios//////////////////////////////////////////////////
                        return res.json(claseCreada);

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

                //Crear la relacion clase_x_user para conocer la situacion actual y futura de la condicion del solicitante
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
        var mapas_genericos = [];

        Clase.find().populate('users').populate('mapas_instancias').populate('institucion').exec(function(err,todasLasClases) {

            if(err){
                console.log(err);
                res.json(err);
                return;
            }
            //Recorremos cada clase: obtenemos cuales pertenecen al usuario
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
            //Recorremos cada clase: obtenemos la relacion del usuario con la clase
            misClases.forEach(function(clase) {
                //Recorremos  cada user de cada clase
                clase.users.forEach(function (user) {
                    //Buscamos en cada User, la situacion en que se encuentra
                    // con respecto cada clase
                    //(dato que esta dentro del modelo Clase_x_user)
                    Clase_x_user.findOne({clase: clase.id, user: user.id}).exec(function (err, local_clase_x_user) {
                        if(err){
                            console.log(err);
                            res.json(err);
                            return;
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

