/**
 * Mapa_instancia.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        clase_instancia: {
            model: 'clase',
            required: false
        },

        /*
        personajes: {
            collection: 'personaje',
            via:'mapa_instancia',
            required: false
        },*/

        mapa_generico: {
            model: 'mapa_generico',
            required: false
        }
    }
};

