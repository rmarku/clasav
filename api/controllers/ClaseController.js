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
                ///////////////////// /////////////
                //Crear la relacion clase_x_user para conocer la situacion actual y futura de la condicion del solicitante
                Clase_x_user.create({user:userID, clase:claseCreada.id, situacion:"creador"}).exec(function createCB(err,clase_x_user) {

                    if (err) {
                        console.log(err);
                        res.json(err);
                        return;
                    }

                    ///////////////////// Generamos mapa_instancia central y secundarios////////////////////////////////////////////////////////////////////////////////////////////////
                    Mapa_generico.findOne({id: mapa_genericoID}).exec(function afterwards(err, mapa_generico) {

                        Dependencia_mapa_generico.findOne({id: mapa_generico.dependencia_mapa_generico}).populate('mapas_genericos').exec(function afterwards(err, dependencia_mapa_generico) {

                            if(!dependencia_mapa_generico || err){
                                console.log(err);
                                res.json(err);
                                return;
                            }
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
                                    });
                            });
                            ///////////////////// FIN Generamos mapa_instancia central y secundarios//////////////////////////////////////////////////
                            return res.json(claseCreada);
                        });
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
                console.log(err);
                res.json(err);
                return;
            }

            clase.users.add(userID);

            clase.save(function (err) {
                if(err){
                    console.log(err);
                    res.json(err);
                    return;
                }

                //Crear la relacion clase_x_user para conocer la situacion actual y futura de la condicion del solicitante
                Clase_x_user.create({user:userID, clase:claseID, situacion:"espera"}).exec(function createCB(err,clase_x_user) {

                    if (err) {
                        console.log(err);
                        res.json(err);
                        return;
                    }

                    return res.json(clase_x_user);

                });
            });
        });
    },

    get_misClases_conUsers: function (req,res) {

        var userID = req.session.passport.user;
        var misClases = [];
        var mapas_genericos = [];

        Clase.find().
            populate('users').
            populate('mapas_instancias').
            populate('clase_x_user',{user:userID}).
            populate('institucion').
            exec(function(err,todasLasClases) {

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


                /*
            for(var x =0; x<misClases.length ; x++){
                var clase = misClases[x];

                for(var y =0; y<clase.users.length ; y++){
                    console.log(clase);
                    var user = clase.users[y];
                    console.log(user);


                    User.findOne({id:user.id}).populate('clase_x_user',{user:user.id,clase:clase.id}).exec(function (err, local_user) {
                        console.log(x);
                        misClases[x].users[y].situacionAux_estaClase = local_user.clase_x_user[0].situacion;
                    });


                }
            }



                 //Recorremos cada clase: obtenemos la relacion del usuario con la clase
            misClases.forEach(function(clase) {
                //Recorremos  cada user de cada clase

                clase.users.forEach(function (user) {

                     User.findOne({id:user.id}).populate('clase_x_user',{user:user.id,clase:clase.id}).exec(function (err, local_user) {

                         //console.log(user);
                         //console.log(local_user.clase_x_user[0].situacion);
                         user.situacionAux_estaClase = local_user.clase_x_user[0].situacion;

                         //console.log(user);



                    });
                });

            });
                 */

            return res.send(misClases);
        });
    }

};

