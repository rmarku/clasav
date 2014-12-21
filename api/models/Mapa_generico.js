/**
 * Mapa_generico.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        nombre: {
            type: 'string',
            required: false,
            unique: true
        },

        mapas_instancias: {
            collection: 'mapa_instancia',
            via: 'mapa_generico',
            required: false
        },

        posicion_inicial_x: {
            type: 'integer'
        },

        posicion_inicial_y: {
            type: 'integer'
        }
    }

};

