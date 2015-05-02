/**
 * ClaseController
 *
 * @description :: Server-side logic for managing clases
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    //PROFESORES
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


            //Creamos instancias de los logros genericos, que pertenezcan unicamente a esta clase. A partir del mapa_genericoCentral
            Logro.find({mapa_generico:mapa_genericoID}).exec(function CB(err,logros_genericos){

                logros_genericos.forEach(function (logro_generico){

                        Logro_instancia.create({
                            clase:claseCreada,
                            nombre:logro_generico.nombre,
                            descripcion:logro_generico.descripcion,
                            sprite:logro_generico.sprite,
                            mapa_generico:logro_generico.mapa_generico,
                            logro:logro_generico.id
                        }).exec(function cb(err,created){
                            if(err){
                                console.log(err);
                            }
                        });
                });

            });


            //Asociamos el User a la clase recien creada
            claseCreada.save(function (err) {
                if(err){
                    console.log(err);
                    res.json(err);
                    return;
                }
                ///////////////////// /////////////
                //Crear la relacion clase_x_user para conocer la situacion actual y futura de la condicion del solicitante
                Clase_x_user.create({user:userID, clase:claseCreada.id, situacion:"administrador"}).exec(function createCB(err,clase_x_user) {

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

                                console.log('mapa generico');
                                console.log(mapa_generico);
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
                                        console.log('mapa instancia');
                                        console.log(mapa_instancia);

                                        return res.json(claseCreada);

                                    });
                            });
                            ///////////////////// FIN Generamos mapa_instancia central y secundarios//////////////////////////////////////////////////

                        });
                    });

                });
            });
        });
    },

    /*
    solicitarInstitucion: function (req,res) {
        var userID = req.session.passport.user;
        var institucionID = req.param('institucionID');

        //realizar un update en clase_x_user

        Institucion.findOne({id:institucionID}).populate('users').exec(function afterwards(err,institucion){

            if (err || !institucion) {
                console.log(err);
                res.json(err);
                return;
            }

            institucion.users.add(userID);

            institucion.save(function (err) {
                if(err){
                    console.log(err);
                    res.json(err);
                    return;
                }

                //Crear la relacion clase_x_user para conocer la situacion actual y futura de la condicion del solicitante
                Institucion_x_user.create({user:userID, institucion:claseID, situacion:"espera"}).exec(function createCB(err,institucion_x_user) {


                    if (err || !institucion_x_user) {
                        console.log(err);
                        res.json(err);
                        return;
                    }

                    // Me suscribo a futuras modificaciones de la clase que acabo de crear

                    User.findOne({id:userID}).populate('institucion_x_user',{clase:institucion.id}).exec(function afterwards(err,user) {

                        if (err || !user) {
                            console.log(err);
                            res.json(err);
                            return;
                        }
                        sails.sockets.join(req.socket,"institucion:"+clase.id);
                        sails.sockets.broadcast("institucion:"+institucion.id,'nuevaSolicitud',user,req.socket);

                        return res.json(institucion_x_user);
                    });

                });
            });
        });
    },
*/


    //ALUMNOS

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


                    if (err || !clase_x_user) {
                        console.log(err);
                        res.json(err);
                        return;
                    }

                    // Me suscribo a futuras modificaciones de la clase que acabo de crear

                    User.findOne({id:userID}).populate('clase_x_user',{clase:clase.id}).exec(function afterwards(err,user) {

                        if (err || !user) {
                            console.log(err);
                            res.json(err);
                            return;
                        }
                        sails.sockets.join(req.socket,"clase:"+clase.id);
                        sails.sockets.broadcast("clase:"+clase.id,'nuevaSolicitud',user,req.socket);

                        return res.json(clase_x_user);
                    });

                });
            });
        });
    },

    //PJS
    get_misclases:function (req,res){

        var userID = req.session.passport.user;
        var misClases = [];

        if (!userID) {
            console.log(err);
            res.json(err);
            return;
        }

        Clase.find().
            populate('users').
            populate('mapas_instancias').
            populate('clase_x_user',{user:userID}).
            exec(function(err,todasLasClases) {

                if (err || !todasLasClases) {
                    console.log(err);
                    res.json(err);
                    return;
                }

                //Recorremos cada clase: obtenemos cuales pertenecen al usuario

                todasLasClases.forEach(function(clase){

                    if (err || !clase) {
                        console.log(err);
                        res.json(err);
                        return;
                    }

                    //Si es una clase de prueba que no tiene generado un clase_x_user. Por ej.: Matematicas que esta en el test clase.JSON
                    if(!clase.clase_x_user[0]){
                        return;
                    }

                    if(clase.clase_x_user[0].situacion == 'aceptado') {
                        //Recorremos  cada user de cada clase
                        clase.users.forEach(function (user, index) {

                            //Si el User esta dentro de la clase.( Si es una de mis clases)
                            if (user.id == userID) {

                                clase.users = [];
                                clase.clase_x_user = [];
                                misClases.push(clase);
                                //Me suscribo a actualizaciones de mi clase
                                return;
                            }
                        });

                    }
                });

                misClases.forEach(function(clase){
                    clase.mapas_instancias.forEach(function (mapa, index) {

                        //Si el User esta dentro de la clase.( Si es una de mis clases)
                        if (mapa.tipo == 'central'){
                            clase.mapaCentral = mapa;
                            clase.mapas_instancias = [];
                            return;
                        }

                    });

                });

                res.send(misClases);

            });

    },


    //PROFESORES/ALUMNOS

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

                        //Si el User esta dentro de la clase.( Si es una de mis clases)
                        if (user.id == userID){

                            misClases.push(clase);
                            //Me suscribo a actualizaciones de mi clase

                            sails.sockets.leave(req.socket, "clase:" + clase.id);
                            sails.sockets.join(req.socket, "clase:" + clase.id);


                            return;
                        }
                    });
                });

                res.send(misClases);

        });
    }

};

