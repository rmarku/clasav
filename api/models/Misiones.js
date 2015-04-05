/**
 * Misiones.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var Promesa = require('bluebird');
module.exports = {

    attributes: {
        // Info
        npc: "string",
        qorder: 'integer',
        img_quest: 'string',
        npc_visible: 'boolean',
        titulo: 'string',
        mapa: 'string',
        descripcion: 'string',

        // Precondiciones
        cond_nivel: 'integer',
        cond_energia: 'integer',
        cond_item: "string",
        cond_item_cant: 'integer',
        cond_oro: 'integer',

        // Textos
        no_oro: 'string',
        no_nivel: 'string',
        no_energia: 'string',
        no_item: 'string',

        pregunta: 'string',
        mision: 'string',   // URL:www.google.com.ar

        no_paso: 'string',
        paso: 'string',
        no_cerrar: 'boolean',

        // Recompensas
        reco_energia: 'integer',
        reco_experiencia: 'integer',
        reco_item: 'string',
        reco_item_cant: 'integer',
        reco_oro: 'integer',

        // Acciones
        new_mission: 'string'
        /* Array
         [ {
         "resultado":"4",   // Solo lo  hace si el resultado es 4
         "npc": "anna",
         "qorder": 5
         }, {
         "npc": "kitty",
         "qorder": 2
         } ]
         */

    },
    getMision: function (userId, npcNombre) {

        return new Promesa(function (resolve, reject) {
            Personaje.getPersonaje_masReciente(userId).then(function (pj) {

                // Se busca el estado de la mision por personaje y npc, si no existe se crea
                Misiones_x_Personaje.findOrCreate({
                    where: {
                        personaje: pj.id,
                        npc: npcNombre,
                        mapa_instancia: pj.mapa_instancia.id
                    },
                    sort: 'qorder DESC',
                    limit: 1
                }, {
                    qorder: 0,
                    personaje: pj.id,
                    npc: npcNombre,
                    mapa_instancia: pj.mapa_instancia.id
                }).exec(function (err, mxp) {

                    if (err) return reject(err);
                    if (!mxp) return reject("Mision no encontrada");

                    // obtengo el orden y el npc
                    Misiones.findOne({npc: npcNombre, qorder: mxp.qorder}).exec(function (err, misi) {
                        if (!misi) return reject('Mision no encontrada');
                        resolve({misi: misi, mxp: mxp, pj: pj});
                    });
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    getMisionsInfo: function () {
        return new Promesa(function (resolve, reject) {
            Misiones.find({titulo: {'!': null}}).populateAll().exec(function (err, mis) {
                if (err) return reject(err);
                var res = [];

                for (var i = 0; i < mis.length; i++) {
                    var reco = '';
                    if (mis[i].reco_energia)
                        reco += mis[i].reco_energia + ' de energia, ';
                    if (mis[i].reco_item)
                        reco += mis[i].reco_item_cant + ' de ' + mis[i].reco_item + ', ';
                    if (mis[i].reco_item)
                        reco += mis[i].reco_oro + ' de oro';
                    if (mis[i].reco_experiencia)
                        reco += mis[i].reco_experiencia + ' de experiencia.';

                    res.push({
                        id: mis.id,
                        mapa: mis.mapa,
                        tituloMision: mis.titulo,
                        inicioNPC: mis.npc,
                        descripcion: mis.descripcion,
                        recompensa: reco

                    });
                }
                resolve(res);
            });
        });
    }
};

