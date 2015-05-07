/**
 * Preguntas_coliController
 *
 * @description :: Server-side logic for managing preguntas_colis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

module.exports = {
    getPreguntas: function (req, res) {
        var userId = req.session.passport.user;

        if (!userId) {
            return res.json({err: 'Usuario no logueado'});
        }

        Preguntas_coli.getPreguntas(userId).then(function (preguntas) {

            var pregunta = preguntas[Math.floor(preguntas.length * Math.random())];
            var respuestas = [];
            for (var i = 1; i <= 8; i++) {
                if (pregunta['respuesta' + i] !== '')
                    respuestas.push(pregunta['respuesta' + i]);
            }


            res.json({id: pregunta.id, pregunta: pregunta.pregunta, respuestas: shuffle(respuestas)});
        }).catch(function (err) {
            console.log(JSON.stringify(err));
            return res.json({err: 'No se encontro preguntas'});
        });
    },
    setRespuesta: function (req, res) {
        var userId = req.session.passport.user;
        var preguntaId = req.param('id');
        var respuesta = req.param('respuesta');

        if (!userId) {
            return res.json({err: 'Usuario no logueado'});
        }

        Preguntas_coli.findOne({id: preguntaId}).then(function (pregunta) {

            if (pregunta.respuesta1 === respuesta) {
                return res.json({respuesta: 'correcta', resp: true});
            } else {
                return res.json({respuesta: 'incorrecta', resp: false});
            }

        }).catch(function (err) {
            console.log(JSON.stringify(err));
            return res.json({err: 'No se encontro preguntas'});
        });
    }
};

