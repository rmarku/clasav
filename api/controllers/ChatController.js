/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    send: function (req, res) {
        var userId = req.session.passport.user;
        if (!userId) {
            return res.json({err: 'No existe un usuario Logueado'});
        }

        var msg = req.param('msg');

        Personaje.getPersonaje_masReciente(userId).then(function (pj) {
            if (pj.duenio.inscripto === false) {
                sails.sockets.broadcast(pj.mapa_instancia.id, 'chat_msg', {pj: pj.nombre, msg: msg}, req.socket);
                return res.json({msg: 1});
            }
            Chat.create({
                autor: pj.id,
                nick: pj.nombre,
                mensaje: msg,
                mapas: pj.mapa_instancia
            }).then(function (it_inst) {
                return res.json({ok: ''});
            });
        }).catch(function () {
            return res.json({err: 'No se encontro PJ'});
        });
    }
};

