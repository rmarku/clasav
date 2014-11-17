/**
 * Personaje.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var Promesa = require('bluebird');

module.exports = {

    attributes: {
        duenio: {
            model: 'user'
        },
        nombre: {
            type: "string"
        },
        x: {
            type: "integer"
        },
        y: {
            type: "integer"
        },
        direccion: {
            type: "integer"
        },
        mapa_instancia: {
            model: 'mapa_instancia'
        },
        conectado: {
            type: "boolean"
        },
        masRecientementeUtilizado: {
            type: "boolean"
        },
        pelo: {
            type: "string"
        },
        pelo_color: {
            type: "string"
        },
        pelo1: {
            type: "integer"
        },
        pelo1_color: {
            type: "string"
        },
        pelo2: {
            type: "integer"
        },
        pelo2_color: {
            type: "string"
        },
        barba: {
            type: "integer"
        },
        barba_color: {
            type: "string"
        },
        oreja: {
            model: "item_instancia"
        },
        sombrero: {
            model: "item_instancia"
        },
        anteojo: {
            model: "item_instancia"
        },
        aros: {
            model: "item_instancia"
        },
        colgante: {
            model: "item_instancia"
        },
        torso: {
            model: "item_instancia"
        },
        torso1: {
            model: "item_instancia"
        },
        capa: {
            model: "item_instancia"
        },
        ala: {
            model: "item_instancia"
        },
        espalda: {
            model: "item_instancia"
        },
        decoracion1: {
            model: "item_instancia"
        },
        decoracion2: {
            model: "item_instancia"
        },
        decoracion3: {
            model: "item_instancia"
        },
        hombro: {
            model: "item_instancia"
        },
        brazo: {
            model: "item_instancia"
        },
        cintura: {
            model: "item_instancia"
        },
        pantalon: {
            model: "item_instancia"
        },
        zapatos: {
            model: "item_instancia"
        }
    },
    afterCreate: function (newPJ, next) {
        // Para procesar todas las promesas que devuelven cada item create.
        Promesa.all([
            Item.findOne({"nombre": "Pantalon Corto"}).then(function (item) {
                return Item_instancia.create(
                    {
                        item: item,
                        seccion_inventario: 1,
                        cantidad: 1,
                        usando: 'true',
                        personaje: newPJ.id
                    });
            }),
            Item.findOne({"nombre": "Remera Corta"}).then(function (item) {
                return Item_instancia.create(
                    {
                        item: item,
                        seccion_inventario: 2,
                        cantidad: 1,
                        usando: 'true',
                        personaje: newPJ.id
                    });
            }),
            Item.findOne({"nombre": "Zapato"}).then(function (item) {
                return Item_instancia.create(
                    {
                        item: item,
                        seccion_inventario: 3,
                        cantidad: 1,
                        usando: 'true',
                        personaje: newPJ.id
                    });
            })
        ]).then(function (items) {

            Mapa_instancia.find({sort: 'createdAt DESC', limit:1}).then(function (mapa) {
 //               console.log('Mapa '+mapa[0]);
                // items es un array con el resultado de cada promesa en orden.
                Personaje.update({id: newPJ.id},
                    {
                        mapa_instancia: mapa[0],
                        pantalon: items[0],
                        torso: items[1],
                        zapatos: items[2]
                    }).exec(next);
            }).catch(function(err){
                console.log(err);
                next();
            });
        });
    }
};

