/**
* Personaje.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        duenio:{
            model: 'user'
        },
        nombre:{
            type:"string"
        },
        x:{
            type: "integer"
        },
        y:{
            type: "integer"
        },
        direccion:{
            type: "integer"
        },
        mapa_instancia: {
            model: 'mapa_instancia'
        },
        conectado: {
            type: "boolean"
        },
        pelo:{
            type: "string"
        },
        pelo_color:{
            type: "string"
        },
        pelo1:{
            type: "integer"
        },
        pelo1_color:{
            type: "string"
        },
        pelo2:{
            type: "integer"
        },
        pelo2_color:{
            type: "string"
        },
        barba:{
            type: "integer"
        },
        barba_color:{
            type: "string"
        },
        oreja:{
            model: "item_instancia"
        },
        sombrero:{
            model: "item_instancia"
        },
        anteojo:{
            model: "item_instancia"
        },
        aros:{
            model: "item_instancia"
        },
        colgante:{
            model: "item_instancia"
        },
        torso:{
            model: "item_instancia"
        },
        torso1:{
            model: "item_instancia"
        },
        capa:{
            model: "item_instancia"
        },
        ala:{
            model: "item_instancia"
        },
        espalda:{
            model: "item_instancia"
        },
        decoracion1:{
            model: "item_instancia"
        },
        decoracion2:{
            model: "item_instancia"
        },
        decoracion3:{
            model: "item_instancia"
        },
        hombro:{
            model: "item_instancia"
        },
        brazo:{
            model: "item_instancia"
        },
        cintura:{
            model: "item_instancia"
        },
        pantalon:{
            model: "item_instancia"
        },
        zapatos:{
            model: "item_instancia"
        }
    }
};

