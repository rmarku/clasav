/**
* Personaje_x_item.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

// Comprobar si es mas comodo hacer una relacion directa de muchos a muchos entre Personajes e items

module.exports = {

  attributes: {
  	 
  	id: {
      type: 'string',
      required: true,
      unique: true,
      primaryKey : true      
    },
    
    seccion_inventario: {
      type: 'string',
      required: 'true' 
      //,enum: ['',''] Completar una vez que se conozcan los posibles valores 
    },
    
    cantidad: {
      type: 'integer',
      required: 'true',
    },
    
    mapas: {
      collection: 'mapa',
      via: 'personajes_x_items',
      required: 'true'    	
    }

  }
};

