/**
* Alumno.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    e_mail: {
      type: 'string',
      required: true,
      unique: true,
      primaryKey : true
      
    },

    contrasena: {
      type: 'string',
      minLength: 6,
      required: true,
    },
    
    nombre: {
      type: 'string',
      required: true
    },
    
    apellido: {
      type: 'string',
      required: true
    },
    
    sexo: {
      type: 'string',
      enum:['masculino','femenino'],
      required: true
    },
    
    fecha_nacimiento: {
      type: 'date',
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
    
    numero_calle: {
      type: 'integer',
      required: false
    },
    
    departamento: {
      type: 'string',
      size: 1,
      required: false
    },
            
    id_personaje: {
      type: 'string',
      required: true
    },
    
    escuela:{
   	  model:'escuela',          
      required: true
    	
    },
     
    mapas:{
   	  collection: 'mapa',
   	  via: 'alumnos',
	  required: false
    	
    },
    
    talentos:{
      collection: 'talento',
      via: 'alumnos',
      required: false 	
    }
	
  }
  
};

