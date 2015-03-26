/**
* Dependencia_mapa_generico.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    mapas_genericos: {
        collection: 'mapa_generico',
        via: 'dependencia_mapa_generico',
        required: false
    }

  }
};

