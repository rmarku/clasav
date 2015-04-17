/**
 * InstitucionController
 *
 * @description :: Server-side logic for managing institucions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    get_misInstituciones_conUsers: function (req,res) {

        var userID = req.session.passport.user;
        var misInstituciones = [];
        var mapas_genericos = [];

        Institucion.find().
            populate('users').
            populate('institucion_x_user',{user:userID}).
            populate('clases').
            exec(function(err,todasLasInstituciones) {


                if(err || !todasLasInstituciones){
                    console.log(err);
                    res.json(err);
                    return;
                }

                //Recorremos cada clase: obtenemos cuales pertenecen al usuario

                todasLasInstituciones.forEach(function(institucion){


                    //Recorremos  cada user de cada clase
                    institucion.users.forEach(function(user,index){

                        //Si el User esta dentro de la institucion.( Si es una de mis institucion)
                        if (user.id == userID){

                            misInstituciones.push(institucion);
                            //Me suscribo a actualizaciones de mi clase

                            sails.sockets.leave(req.socket, "institucion:" + institucion.id);
                            sails.sockets.join(req.socket, "institucion:" + institucion.id);

                            return;
                        }
                    });
                });

                res.send(misInstituciones);

            });
    },

    get_institucionesHabilitadas: function (req,res) {

        var userID = req.session.passport.user;
        var institucionesHabilitadas = [];
        var institucionesHabilitadas_sinSolicitudPrevia = [];

        Institucion.find().
            populate('institucion_x_user').
            exec(function(err,todasLasInstituciones) {

                if(err || !todasLasInstituciones){
                    console.log(err);
                    res.json(err);
                    return;
                }

                todasLasInstituciones.forEach(function(institucion){

                    //Recorremos cada institucion
                    institucion.institucion_x_user.forEach(function(institucion_x_user){

                        //Si la institucion ya fue ahbilitada para algun administrador
                        if (institucion_x_user.situacion == 'administrador'){

                            institucionesHabilitadas.push(institucion);
                            //Revisar que yo no la haya solicitado previamente
                            institucion.institucion_x_user.forEach(function(institucion_x_user) {
                                if((institucion_x_user.user == userID) && ((institucion_x_user.situacion != 'administrador')) ){ //Si soy administrador, tambien deberia poder solicitar ser un Profesor. COn el segundo parametro de comparacion saldria en la lista como opcion
                                    institucionesHabilitadas.pop();
                                    return;
                                }

                            });
                            return;
                        }
                    });
                });


                res.send(institucionesHabilitadas);

            });
    },
    get_institucionesConProfesores: function (req,res) {

        var userID = req.session.passport.user;
        var institucionesConProfesores = [];

        Institucion.find().
            populate('institucion_x_user').
            exec(function(err,todasLasInstituciones) {

                if(err || !todasLasInstituciones){
                    console.log(err);
                    res.json(err);
                    return;
                }

                todasLasInstituciones.forEach(function(institucion){

                    //Recorremos cada institucion
                    institucion.institucion_x_user.forEach(function(institucion_x_user){

                        //Si la institucion ya fue ahbilitada para algun administrador
                        if (institucion_x_user.situacion == 'profesor'){

                            institucionesConProfesores.push(institucion);

                            return;
                        }
                    });
                });


                res.send(institucionesConProfesores);

            });
    },



    crearInstitucionAdministrador: function (req,res) {

        var userID = req.session.passport.user;
        var nombre = req.param('nombre');
        var pais = req.param('pais');
        var ciudad = req.param('ciudad');
        var provincia = req.param('provincia');
        var direccion = req.param('direccion');

        //Crear Clase con Nombre e institucionci
        Institucion.create({nombre:nombre,pais:pais,ciudad:ciudad,provincia:provincia,direccion:direccion}).exec(function createCB(err, institucionCreada) {

            if(err || !institucionCreada){
                console.log(err);
                res.json(err);
                return;
            }

            ///////////////////// Generamos mapa_instancia central y secundarios/////////////
            //Asociamos la claseCreada con el User que la creó
            institucionCreada.users.add(userID);

            //Asociamos el User a la clase recien creada
            institucionCreada.save(function (err) {
                if(err){
                    console.log(err);
                    res.json(err);
                    return;
                }
                ///////////////////// /////////////
                //Crear la relacion institucion_x_user para conocer la situacion actual y futura de la condicion del solicitante
                Institucion_x_user.create({user:userID, institucion:institucionCreada.id, situacion:"esperaAdministrador"}).exec(function createCB(err,institucion_x_user) {

                    if (err || !institucion_x_user) {
                        console.log(err);
                        res.json(err);
                        return;
                    }

                    return res.json(institucionCreada);

                });
            });
        });
    },

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
                Institucion_x_user.create({user:userID, institucion:institucionID, situacion:"esperaProfesor"}).exec(function createCB(err,institucion_x_user) {


                    if (err || !institucion_x_user) {
                        console.log(err);
                        res.json(err);
                        return;
                    }

                    // Me suscribo a futuras modificaciones de la clase que acabo de crear

                    User.findOne({id:userID}).populate('institucion_x_user',{institucion:institucion.id}).exec(function afterwards(err,user) {

                        if (err || !user) {
                            console.log(err);
                            res.json(err);
                            return;
                        }
                        sails.sockets.join(req.socket,"institucion:"+institucion.id);
                        sails.sockets.broadcast("institucion:"+institucion.id,'nuevaSolicitudInstitucion',user,req.socket);

                        return res.json(institucion_x_user);
                    });

                });
            });
        });
    }

};

