/**
 * Preguntas_coli.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var Promesa = require('bluebird');

module.exports = {

    attributes: {
        pregunta: 'string',
        respuesta1: 'string',
        respuesta2: 'string',
        respuesta3: 'string',
        respuesta4: 'string',
        respuesta5: 'string',
        respuesta6: 'string',
        respuesta7: 'string',
        respuesta8: 'string',
        clase: {
            model: 'clase'
        }
    },
    getPreguntas: function (userId) {
        return new Promesa(function (resolve, reject) {
            Clase_x_user.find({user: userId}).populate("clase").exec(function (err, claxuser) {
                var clases_id = [];
                for (var i = 0; i < claxuser.length; i++) {
                    clases_id.push(claxuser[i].clase.id);
                }
                Preguntas_coli.find({clase: clases_id}).exec(function (err, preguntas) {
                    if (err) return reject(err);
                    return resolve(preguntas);
                });
            });
        });
    }
};

