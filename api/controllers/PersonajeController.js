/**
 * PersonajeController
 *
 * @description :: Server-side logic for managing personajes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    updateStatus: function (req, res) {

        //Obtenemos el Nombre de la Room que coincide con el ID de mapa_instancia enviado
        //var roomName = req.param('mapa_instancia');
        //console.log('update hacia mapa_instancia.id:')
        //console.log(roomName);
        //if(!roomName){
         //   return res.send('No se ha indicado una correcta Instancia de Mapa');
        //}

        //Obtenemos todos los parametros enviados por el socket
        //var parameters = req.allParams();
        //console.log('updated params:')
        //console.log(parameters);

        //Enviamos update a todos menos al cliente que envio el cambio
        sails.sockets.broadcast(req.param('mapa_instancia'),'otherPlayer_updateState',req.allParams(),req.socket);

        return res.send(200);
    }
	
};

