/**
 * MisionesController
 *
 * @description :: Server-side logic for managing misiones
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    gettxt: function (req, res) {
        var userId = req.session.passport.user;
        var npcId = req.param('npc');
        if (!userId) {
            return res.json({err:'No existe un usuario Logueado'});
        }

        Misiones.getMision(userId, npcId).then(function (misi) {
            //Verifico precondiciones
            if (misi.cond_nivel && mxp.personaje.nivel < misi.cond_nivel)
                return res.json({error: misi.no_nivel});

            if (misi.cond_energia && mxp.personaje.energia < misi.cond_energia)
                return res.json({error: misi.no_energia});

            if (misi.cond_oro && mxp.personaje.oro < misi.cond_oro)
                return res.json({error: misi.no_oro});

            // TODO: Ver como hacer con la busqueda de un item como condicion

            // Si paso es que cumple condiciones.mando datos de la mision
            var mision = {};
            if (misi.pregunta)
                mision.pregunta = misi.pregunta;

            if (misi.mision)
                mision.mision = misi.mision;

            return res.json(mision);
        }).catch(function (err) {
            return res.json({err: err});
        });
    },

    // Informo que temino la mision y el resultado.
    finish: function (req, res) {
        var userId = req.session.passport.user;
        var npcId = req.param('npc');
        var resultado = req.param('resultado') || '0';
        if (!userId) {
            return res.json({err:'No existe un usuario Logueado'});
        }

        Misiones.getMision(userId, npcId).then(function (misi, mxp, pj) {
            //Verifico precondiciones
            if (resultado == '0')
                return res.json({result: 'no', txt: misi.no_paso});

            // Paso bien la mision!!!!
            


            return res.json({result: 'si', txt: misi.paso});
        }).catch(function (err) {
            return res.json({
                err: 'no tiene mision'
            });
        });
    },

    // Informo que temino la mision y el resultado.
    info: function (req, res) {
        var userId = req.session.passport.user;
        var npcId = req.param('npc');
        if (!userId) {
            return res.json({err:'No existe un usuario Logueado'});
        }

        Misiones.getMision(userId, npcId).then(function (misi) {
            // Doy informacion general del quest

            return res.json({
                img_quest: misi.img_quest,
                npc_visible: misi.npc_visible
            });

        }).catch(function (err) {
            return res.json({
                err: 'no tiene mision',
                img_quest: '',
                npc_visible: true
            });
        });
    }
};

