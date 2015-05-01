/**
* Logro.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      mision:{
          model: 'misiones'
      },

      nombre:'string',

      descripcion:'string',

      sprite: {
          model: 'sprite'
      },

      mapa_generico:{
          model:'mapa_generico'
      }
  }
};

