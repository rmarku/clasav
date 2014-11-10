/**
 * Jugador_en_vivo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        mapa_instancia: {
            model: 'mapa_instancia',
            required: false
        },

        user: {
            model: 'user',
            required: false //true
        },

        personaje: {
            model: 'personaje',
            required: false //true
        },
        estado: {
            type: "json",
            required: false
        },
        coordenadas: {
            type: "json",
            required: false
        },
        conectado: {
            type: "boolean",
            required: false
        }

    }
};

