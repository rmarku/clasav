/**
 * Mapa_instanciaController
 *
 * @description :: Server-side logic for managing mapa_instancias
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    join: function (req, res) {
        var user = req.session.passport.user;
        if(!user){
            return res.send('No existe un Usuario Logueado');
        }

        var roomName = req.param('mapa_instanciaID');
        sails.sockets.join(req.socket, roomName);
        sails.sockets.broadcast(roomName, 'NuevoJoin_Mapa_Instancia', {userID:user.id});
        return res.send('Se ha unido a mapa_instancia.id:'+roomName);
    },

    leave: function (req,res) {
        var user = req.session.passport.user;
        if(!user){
            return res.send('No existe un Usuario Logueado');
        }

        var roomName = req.param('mapa_instanciaID');
        sails.sockets.leave(req.socket, roomName);
        sails.sockets.broadcast(roomName, 'NuevoPersonajeConectado', {userID:user.id});
        return res.send(200);
    }
	
};

