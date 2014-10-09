/**
* Mapa_instancia.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes:{

      id: {
          type: 'string',
          required: true,
          unique: true,
          primaryKey : true
      },

      clase_instancia: {
          model: 'clase',
          required: false
      },

      jugador_en_vivo: {
          model: 'jugador_en_vivo',
          required : false
      },

      mapa_generico: {
          model: 'mapa_generico',
          required : false
      }

  }
};

