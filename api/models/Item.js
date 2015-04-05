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
            enum: ['sombrero', 'torso', 'pantalon', 'zapatos', 'brazo', 'decoracion1', 'decoracion2', 'capa', 'anillo', 'espada'],
            required: true
        },

        maximo: {
            type: 'integer',
            required: true
        },

        instancias: {
            collection: 'item_instancia',
            via: 'item',
            required: false
        },
        sprite: {
            model: 'sprite'
        },
        // si empieza con # es un color, sino no se aplica tinte.
        color: {
            type: 'string',
            required: true
        }
    }
};
