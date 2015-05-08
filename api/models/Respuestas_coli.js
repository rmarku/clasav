/**
 * Respuestas_coli.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        usuario: {
            model: 'user'
        },
        pregunta: {
            model: 'preguntas_coli'
        },
        respuesta: 'string',
        correcta: 'boolean'
    }
};

