/**
* Clase.js
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

        institucion_instancia:{
            model:'institucion',
            required:false
        },

        alumnos: {
            collection: 'alumno',
            via:'clases',
            required: false
        },

        profesores: {
            collection: 'profesor',
            via:'clases',
            required: false
        },

        mapas_instancias: {
            collection: 'mapa_instancia',
            via:'clase_instancia',
            required: false
        }


    }
};

