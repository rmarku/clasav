/**
 * Created by Fabricio on 21/12/2014.
 */
module.exports = {

    leaveGame: function(userId,socket) {

            Personaje.findOne({duenio: userId, masRecientementeUtilizado: true}).exec(function (err, personaje) {
                if (personaje) {
                    Personaje.update(personaje.id, {conectado: false}).exec(function afterwards(err, updated) {
                        sails.log.warn("El personaje *" + personaje.nombre + "* (" + personaje.id + ") se ha desconectado.");
                        sails.sockets.leave(socket, personaje.mapa_instancia);
                        sails.sockets.broadcast(personaje.mapa_instancia, 'otherPlayer_leave', personaje.id, socket);
                    });
                }
            });

    }
};
