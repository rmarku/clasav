/**
* Clase.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        institucion_instancia:{
            model:'institucion',
            required:false
        },

        integrantes: {
            collection: 'user',
            via:'clases',
            required: false
        },

        mapas_instancias: {
            collection: 'mapa_instancia',
            via:'clase_instancia',
            required: false
        },
        nombre:{
            type: "string"
        }
    }
};

