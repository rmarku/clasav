/**
* Item.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        nombre: {
            type: 'string',
            required: true
        },

        tipo_item: {
            type: 'string',
            //enum: ['',''] //agregar esto cuando se conozcan los tipos
            required: true
        },

        maximo: {
            type: 'integer',
            required: true
        },

        items_x_personajes:{
            collection: 'personaje_x_item',
            via: 'id',
            required: false
        },

        sprites: {
            collection: 'sprite',
            via:'items'
        }





    }
};
