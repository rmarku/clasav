/**
 * Clase.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        institucion: {
            model: 'institucion',
            required: false
        },

        users: {
            collection: 'user',
            via: 'clases',
            required: false
        },

        mapas_instancias: {
            collection: 'mapa_instancia',
            via: 'clase',
            required: false
        },

        nombre: {
            type: "string"
        },

        personajes:{
            collection: "personaje",
            via: "clases"
        },

        clase_x_user: {
            collection: 'clase_x_user',
            via: 'clase',
            required: false
        },


        logros_instancias:{
            collection: 'logro_instancia',
            via: 'clase',
            required: false
        }

    }
};

