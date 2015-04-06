/**
 * MisionesController
 *
 * @description :: Server-side logic for managing misiones
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Promesa = require('bluebird');


module.exports = {
    gettxt: function (req, res) {
        var userId = req.session.passport.user;
        var npcName = req.param('npc');
        if (!userId) {
            return res.json({err: 'Usuario no logueado'});
        }

        Misiones.getMision(userId, npcName).then(function (datos) {
            var misi = datos.misi;
            var mxp = datos.mxp;
            var pj = datos.pj;

            //Verifico precondiciones
            if (misi.cond_nivel && mxp.personaje.nivel < misi.cond_nivel)
                return res.json({falta: misi.no_nivel});

            if (misi.cond_energia && mxp.personaje.energia < misi.cond_energia)
                return res.json({falta: misi.no_energia});

            if (misi.cond_oro && mxp.personaje.oro < misi.cond_oro)
                return res.json({falta: misi.no_oro});

            // TODO: Ver como hacer con la busqueda de un item como condicion
            Item.findOne({nombre: misi.cond_item}).exec(function (err, it) {
                if (err) {
                    sails.log.error('error el item: ' + misi.cond_item + ' no existe');
                    return res.json({err: err});
                }
                var search = {};
                if (typeof it !== 'undefined')
                    search.item = it.id;
                search.personaje = pj.id;
                search.usando = false;

                // Si encuentro el item
                Item_instancia.findOne(search).exec(function (err, inst) {
                    if (err) {
                        sails.log.error('error item_instancia: ' + misi.cond_item + ' no existe');
                        return res.json({err: err});
                    }
                    // si hay condicion y no hay item
                    if (misi.cond_item && (typeof inst.id === 'undefined' || (misi.cond_item_cant && misi.cond_item_cant < inst.cantidad )))
                        return res.json({falta: misi.no_item});


                    // Si paso es que cumple condiciones.mando datos de la mision
                    var mision = {};

                    if (misi.titulo)
                        mision.titulo = misi.titulo;

                    if (misi.pregunta)
                        mision.pregunta = misi.pregunta;

                    if (misi.mision)
                        mision.mision = misi.mision;

                    return res.json(mision);
                });
            });

        }).catch(function (err) {
            sails.log.error('error en gettext - getMision user:' + userId + ' NPC: ' + npcName);
            return res.json({err: err});
        });
    },

    // Informo que temino la mision y el resultado.
    finish: function (req, res) {
        var userId = req.session.passport.user;
        var npcName = req.param('npc');
        var resultado = req.param('resultado') || '-1';
        if (!userId) {
            return res.json({err: 'Usuario no logueado'});
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

            // TODO: ver como descontar item async

            // Doy
            if (misi.reco_oro)
                pj.oro += misi.reco_oro;
            if (misi.reco_energia)
                pj.energia += misi.reco_energia;
            if (misi.reco_experiencia) {
                var max = (pj.nivel + pj.nivel / 2) * 100;
                pj.experiencia += misi.reco_experiencia;

                while (pj.experiencia > max) {
                    pj.nivel++;
                    pj.experiencia -= max;
                    max = (pj.nivel + pj.nivel / 2) * 100;
                }
            }
            if (misi.reco_item)
                Item.findOne({nombre: misi.reco_item}).exec(function (err, item) {
                    if (err || !npc) {
                        sails.log.warn('No se encontro el item recompensa "' + misi.reco_item +
                        '" en la mision de  ' + npcName + ', qorder ' + misi.qorder);
                        return res.json({err: 'No se encontro el item ' + err});
                    }
                    Item_instancia.create({
                        item: item.id,
                        personaje: pj,
                        cantidad: misi.reco_item_cant
                    });
                });

            // habilito el flujo de misiones que siguen.
            var new_misiones = JSON.parse(misi.new_mission);

            var npc_promises = [];
            var npc_changed = [];

            new_misiones.forEach(function (valor) {

                // Solo si no requiere resultado o si el resultado es el de sta mision
                if (typeof valor.resultado == 'undefined' || resultado == valor.resultado) {
                    npc_promises.push(new Promesa(function (resolve, reject) {
                        Npcplayer.findOne({nombre: valor.npc}).then(function (npc) {
                            if (!npc) return reject('No se encontro el NPC :(');

                            sails.log(npc.nombre + ' con ' + pj.id + ' cambiada a ' + valor.qorder);
                            // Busco el estado de esa mision o lo creo con el qoder
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
                            }).then(function (mxp) {
                                if (!mxp) {
                                    sails.log.error('Error al cambiar de mision ' + npc.nombre + ' pj:' + pj.nombre + ' qorder:' + valor.qorder);
                                    return reject('Error MisionXPj no encontrada por ahí');
                                }
                                npc_changed.push(npc.id);

                                mxp.qorder = valor.qorder;
                                mxp.save();
                                return resolve(npc);
                            });
                        });
                    }));
                }
            });
            Promesa.all(npc_promises).then(function () {
                pj.save();
                return res.json({result: 'si', txt: misi.paso, cerrar: !misi.no_cerrar, npcs: npc_changed});
            });
        }).catch(function (err) {
            sails.log.error('error en gettext - getMision user:' + userId + ' NPC: ' + npcName);
            return res.json({err: err});
        });
    },

// Informo que temino la mision y el resultado.
    info: function (req, res) {
        var userId = req.session.passport.user;
        var npcName = req.param('npc');

        if (!userId) {
            return res.json({err: 'Usuario no logueado'});
        }

        Misiones.getMision(userId, npcName).then(function (datos) {
            var misi = datos.misi;
            // Doy informacion general del quest

            sails.log.warn('Fin ' + npcName);
            return res.json({
                img_quest: misi.img_quest,
                npc_visible: misi.npc_visible
            });

        }).catch(function (err) {
            sails.log.warn('Fin ' + npcName);
            return res.json({
                err: 'no tiene mision',
                img_quest: '',
                npc_visible: true
            });
        });
    }
}
;

