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
        clases:{
            collection: "clase",
            via: "personajes"
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
        animation: {
            type: "string"
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

            Mapa_instancia.find().populate('mapa_generico').exec(function afterUpdate(err,mapas_instancias) {

                if(mapas_instancias) {
                    var mapa_instancia;
                    var succesfull;
                    while (mapas_instancias.length) {
                        mapa_instancia = mapas_instancias.pop();
                        //Si el mapa_instancia es el que esta relacionado al mapa generico
                        if (mapa_instancia.mapa_generico.nombre.toLowerCase() === "island") {
                            succesfull = true;
                            break;
                        }
                    }
                    //Variable hecha para que Grunt no se queje de que pongo una funcion dentro de un Loop
                    if(succesfull) {
                        sails.log.warn(":smile: *Personaje Creado:* ", newPJ.nombre);

                        // items es un array con el resultado de cada promesa en orden.
                        Personaje.update({id: newPJ.id},
                            {
                                mapa_instancia: mapa_instancia,
                                pantalon: items[0],
                                torso: items[1],
                                zapatos: items[2]
                            }).exec(next);
                    }
                }
            }).catch(function(err){
                sails.log.error(err);
                next();
            });
        });
    }
};

