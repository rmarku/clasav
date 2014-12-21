/**
 * Mapa_instanciaController
 *
 * @description :: Server-side logic for managing mapa_instancias
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    join: function (req, res) {


        var personajeId = req.param('personajeId');

        Personaje.findOne(personajeId).exec(function (err, personaje) {

            Personaje.update(personajeId,{conectado:true}).exec(function afterUpdate(){

                sails.log.warn("El personaje *" + personaje.nombre + "* (" + personaje.id + ") se ha conectado :smile:.");
                //Si el Room no existe todavia, se creata automaticamente con el Join.
                //Se establece como nombre de la Room, el id del Mapa instancia, para que sean unicos y cada Usuario sepa a donde mandar sus Updates
                var roomName = personaje.mapa_instancia;
                sails.sockets.join(req.socket,roomName);

                //Se enviadtodo el personaje para que se actualicen segun cambios que hayan podido suceder en modo Offline
                console.log("OtherPlayer Join. PlayerId: ",personajeId," to Mapa_instanciaId",personaje.mapa_instancia);
                sails.sockets.broadcast(roomName, 'otherPlayer_join',personajeId,req.socket);
                return res.send(roomName);
            });
        });

        return ;
    },

    leave: function (req,res) {
        //Reveer esta funcion, el broadcaste debe ser con la info del personaje no del user
        var roomName = req.param('mapa_instanciaId');
        var personajeId = req.param('personajeId');

        if(!roomName){
            return res.send('No se ha indicado una correcta Instancia de Mapa');
        }

        Personaje.update(personajeId,{conectado:false}).exec(function afterUpdate(updated){
            if(updated){
                sails.sockets.leave(req.socket, roomName);
                sails.sockets.broadcast(roomName, 'otherPlayer_leave',personajeId,req.socket);
                console.log("OtherPlayer Leave. PlayerId: ",personajeId," from Mapa_instanciaId",roomName);

                return res.send(roomName);
            }
        });
        return ;
    },

    change_level: function (req,res) {

        var previo_roomName = req.param('mapa_instancia');
        var nuevo_mapa_generico = req.param('mapa_generico');
        var personajeId = req.param('personajeId');

        sails.sockets.leave(req.socket, previo_roomName);
        sails.sockets.broadcast(previo_roomName, 'otherPlayer_leave',personajeId,req.socket);

        console.log("OtherPlayer Leave. PlayerId: ",personajeId);

        /*
        Mapa_instancia.findOne(previo_roomName).exec(function findCB(err,mapa_instancia){
            console.log("mapa_instancia encontrado: ");
            console.log(mapa_instancia);
            if(mapa_instancia) {
                var user = req.session.passport.user;
                console.log(user);
                mapa_instancia.personajes.remove(user);
                mapa_instancia.save(console.log);
            }
        });
        */

        Mapa_instancia.find().populate('mapa_generico').exec(function afterUpdate(err,mapas_instancias) {

            if(mapas_instancias) {
                var mapa_instancia;
                var succesfull;
                while (mapas_instancias.length) {
                    mapa_instancia = mapas_instancias.pop();

                    //Si el mapa_instancia es el que esta relacionado al mapa generico
                    if (mapa_instancia.mapa_generico.nombre.toLowerCase() === nuevo_mapa_generico.toLowerCase()) {
                        succesfull = true;
                        break;
                    }
                }
                //Variable hecha para que Grunt no se queje de que pongo una funcion dentro de un Loop
                if(succesfull){
                    //Cambio el mapa_instancia actual del personaje
                    Personaje.update(personajeId,
                        {
                            mapa_instancia:mapa_instancia.id,
                            x:mapa_instancia.mapa_generico.posicion_inicial_x,
                            y:mapa_instancia.mapa_generico.posicion_inicial_y
                        }
                    ).exec(function afterwards(err,updated){

                        //Una vez que se actualizo la base de datos
                        //Me agrego al Room Nuevo para que los demas obtengan mis actualizaciones
                        sails.sockets.join(req.socket, mapa_instancia.id);
                        console.log("OtherPlayer Join on LevelChange. PlayerId: ",personajeId," to Mapa_instanciaId",mapa_instancia.id);
                        //Hago broadcast a todos los que esten en la Room del Mapa_instancia que acabo de ingresar
                        sails.sockets.broadcast(mapa_instancia.id, 'otherPlayer_join', personajeId, req.socket);

                        console.log("se encontro este id de mapa_instancia:",mapa_instancia.id);
                        //Retorno el mapa_instancia que acabod e ingresar para agregar OtherPlayer que esten en ese mapa
                        return res.json(mapa_instancia);
                    });
                }
            }

        });






    }

};

