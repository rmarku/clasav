/**
 * InstitucionController
 *
 * @description :: Server-side logic for managing institucions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    get_misInstituciones_conProfesores: function (req,res) {

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

                        //Si el User esta dentro de la clase.( Si es una de mis clases)
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

    //Pendiente
    crearInstitucionAdministrador: function (req,res) {

        var userID = req.session.passport.user;
        var nombre = req.param('nombre');
        var direccion = req.param('mapa_genericoID');
        var pais = req.param('institucionID');


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
    }

};

