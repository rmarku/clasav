/**
* Jugador_en_vivo.js
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

        mapa_instancia: {
            model: 'mapa_instancia',
            required : false
        },

        alumno: {
            model: 'alumno',
            required : false //true
        },

        direccion: {
            type: "json",
            required:false
        },
        aceleracion: {
            type: "json",
            required:false
        },
        conectado: {
            type: "boolean",
            required:false
        }

    }
};

