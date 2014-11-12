/**
 * Mapa_instanciaController
 *
 * @description :: Server-side logic for managing mapa_instancias
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    join: function (req, res) {
        var user = req.session.passport.user;

        var roomName = req.param('mapa_instancia');
        if(!roomName){
            return res.send('No se ha indicado una correcta Instancia de Mapa');
        }

        sails.sockets.join(req.socket, roomName);
        console.log('join to mapa_instancia.id:');
        console.log(roomName);

        sails.sockets.broadcast(roomName, 'NuevoJoin_Mapa_Instancia', {userID:user.id});
        return res.send(roomName);
    },

    leave: function (req,res) {
        var user = req.session.passport.user;
        if(!user){
            return res.send('No existe un Usuario Logueado');
        }

        var roomName = req.param('mapa_instancia');
        if(!roomName){
            return res.send('No se ha indicado una correcta Instancia de Mapa');
        }

        sails.sockets.leave(req.socket, roomName);
        sails.sockets.broadcast(roomName, 'NuevoPersonajeConectado', {userID:user.id});
        return res.send(200);
    }
	
};

