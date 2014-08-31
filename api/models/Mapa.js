/**
* Mapa.js
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
    
    
    alumnos: {
    	collection: 'alumno',
    	via: 'mapas',
    	required: false
    },
    
    profesores: {
    	collection: 'profesor', 
    	via: 'mapas',
    	required: false
    },
    
    materias:{
    	model: 'materia',
    	required: false	
    },
    
    personajes_x_items: {
    	collection: 'personaje_x_item',
    	via: 'mapas',
    	required: false 	
    }
    
  }
  
};

