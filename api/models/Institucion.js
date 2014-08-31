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
      required: true
    },
    
    provincia: {
      type: 'string',
      required: false
    },
    
    ciudad: {
      type: 'string',
      required: true
    },
    
    calle: {
      type: 'string',
      required: false
    },
    
    altura_calle: {
      type: 'integer',
      required: false
    },
    
    
  	alumnos:{
  		collection: 'alumno',
  		via: 'instituciones',
  		required: true
  	},
  	
  	profesores:{
  		collection: 'profesor',
  		via: 'instituciones',
  		required: true
  	}
		

  }
};


