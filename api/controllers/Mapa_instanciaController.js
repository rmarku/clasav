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

                //Si el Room no existe todavia, se creata automaticamente con el Join.
                //Se establece como nombre de la Room, el id del Mapa instancia, para que sean unicos y cada Usuario sepa a donde mandar sus Updates
                var roomName = personaje.mapa_instancia;
                sails.sockets.join(req.socket,roomName);

                //Se enviadtodo el personaje para que se actualicen segun cambios que hayan podido suceder en modo Offline
                sails.sockets.broadcast(roomName, 'otherPlayer_join',personaje,req.socket);
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

        Personaje.update(personajeId,{conectado:true}).exec(function afterUpdate(updated){
            if(updated){
                sails.sockets.leave(req.socket, roomName);

                sails.sockets.broadcast(roomName, 'otherPlayer_join',personajeId,req.socket);
                return res.send(roomName);
            }
        });
        return ;
    }

};

