/**
* Institucion.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {


        id: {
            type: 'string',
            required: true,
            unique: true,
            primaryKey : true
        },

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

        calle: {
            type: 'string',
            required: false
        },

        altura_calle: {
            type: 'integer',
            required: false
        },

         clases:{
             collection: 'clase',
             via: 'institucion_instancia',
             required: false
         }

    }
};

