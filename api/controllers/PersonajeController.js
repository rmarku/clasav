/**
 * PersonajeController
 *
 * @description :: Server-side logic for managing personajes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    update: function (req, res) {

        var user = req.session.passport.user;
        if(!user){
            return res.send('No existe un Usuario Logueado');
        }

        //Obtenemos el Nombre de la Room que coincide con el ID de mapa_instancia enviado
        var roomName = req.param('mapa_instanciaID');

        //Obtenemos todos los parametros enviados por el socket
        var parameters = req.allParams();

        //Enviamos update a todos menos al cliente que envio el cambio
        sails.sockets.broadcast(roomName,'otherPlayer_updateState',parameters,req.socket);

        return res.send(200);
    }
	
};

