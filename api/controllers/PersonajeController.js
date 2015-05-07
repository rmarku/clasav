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
        sails.sockets.broadcast(req.param('mapa_instancia'), 'otherPlayer_updateState', req.allParams(), req.socket);

        return res.send(200);
    },

    getPersonaje_masReciente: function (req, res) {
        var userId = req.session.passport.user;
        if (!userId) {
            return res.json({err: 'No existe un usuario Logueado'});
        }

        Personaje.getPersonaje_masReciente(userId).then(function (pj) {

            // Reveo si esta inscripto en alguna clase
            Clase_x_user.count({user: userId, situacion: 'aceptado'}).exec(function (err, count) {
                if (count > 0)
                    pj.duenio.inscripto = true;
                else
                    pj.duenio.inscripto = true;
                console.log('inscripto: ' + pj.duenio.inscripto);
                pj.duenio.save();
                return res.json(pj);
            });
        });
    }
};

