/**
 * Clase_x_user.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        user: {
            model: 'user',
            required: false
        },

        clase: {
            model: 'clase',
            required: false
        },

        situacion: {
            type: 'string',
            enum: ['espera', 'aceptado', 'rechazado', 'administrador']
        }
    }
};

