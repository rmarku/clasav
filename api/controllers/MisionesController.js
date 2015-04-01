/**
 * MisionesController
 *
 * @description :: Server-side logic for managing misiones
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    gettxt: function (req, res) {
        var userId = req.session.passport.user;
        var npcName = req.param('npc');
        if (!userId) {
            return res.json({err: 'No existe un usuario Logueado'});
        }

        Misiones.getMision(userId, npcName).then(function (datos) {
            var misi = datos.misi;
            //Verifico precondiciones
            if (misi.cond_nivel && mxp.personaje.nivel < misi.cond_nivel)
                return res.json({falta: misi.no_nivel});

            if (misi.cond_energia && mxp.personaje.energia < misi.cond_energia)
                return res.json({falta: misi.no_energia});

            if (misi.cond_oro && mxp.personaje.oro < misi.cond_oro)
                return res.json({falta: misi.no_oro});

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
        var npcName = req.param('npc');
        var resultado = req.param('resultado') || '0';
        if (!userId) {
            return res.json({err: 'No existe un usuario Logueado'});
        }

        Misiones.getMision(userId, npcName).then(function (datos) {
            var misi = datos.misi;
            var pj = datos.pj;

            //Verifico precondiciones
            if (resultado == '-1') {
                //No paso, resto la energia

                if (misi.cond_energia)
                    pj.energia -= misi.cond_energia;
                if (pj.energia < 0)
                    pj.energia = 0;

                return res.json({result: 'no', txt: misi.no_paso});
            }
            // Paso bien la mision!!!!
            // Ahora tengo que descontar y dar los premios

            // Descuento
            if (misi.cond_oro)
                pj.oro -= misi.cond_oro;

            // Doy
            if (misi.reco_oro)
                pj.oro += misi.reco_oro;
            if (misi.reco_energia)
                pj.energia += misi.reco_energia;
            if (misi.reco_experiencia)
                pj.experiencia += misi.reco_experiencia;
            if (misi.reco_item)
                Item_instancia.create({
                    item: misi.reco_item,
                    personaje: pj,
                    cantidad: misi.reco_item_cant
                });

            // habilito el flujo de misiones que siguen.
            var new_misiones = JSON.parse(misi.new_mission);
            console.log(JSON.stringify(new_misiones));

            new_misiones.forEach(function (valor) {
                if (typeof valor.resultado == 'undefined' || resultado == valor.resultado) {
                    Npcplayer.findOne({nombre: valor.npc}).exec(function (err, npc) {
                        if (err || !npc) return res.json({err: 'No se encontro el npc :('});

                        Misiones_x_Personaje.findOrCreate({
                            where: {
                                personaje: pj.id,
                                npc: npc.nombre,
                                mapa_instancia: pj.mapa_instancia.id
                            },
                            sort: 'qorder DESC',
                            limit: 1
                        }, {
                            personaje: pj.id,
                            npc: npc.nombre,
                            mapa_instancia: pj.mapa_instancia.id,
                            qorder: valor.qorder
                        }).exec(function (err, mxp) {
                            if (err) return res.json({err: 'Error sector 7'});
                            mxp.qorder = valor.qorder;
                            mxp.save();
                        });
                    });
                }
            });
            pj.save();
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
        var npcName = req.param('npc');

        if (!userId) {
            return res.json({err: 'No existe un usuario Logueado'});
        }

        Misiones.getMision(userId, npcName).then(function (datos) {
            var misi = datos.misi;
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

