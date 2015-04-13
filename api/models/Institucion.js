/**
 * Institucion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        nombre: {
            type: 'string',
            required: true
        },

        pais: {
            type: 'string',
            required: false
        },

        provincia: {
            type: 'string',
            required: false
        },

        ciudad: {
            type: 'string',
            required: false
        },

        direccion: {
            type: 'string',
            required: false
        },

        clases: {
            collection: 'clase',
            via: 'institucion',
            required: false
        },

        institucion_x_user: {
            collection: 'institucion_x_user',
            via: 'institucion',
            required: false
        },

        users: {
            collection: 'user',
            via: 'instituciones',
            required: false
        }



    }
};

