/**
 * Misiones_x_usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        npc: {
            model: 'npcplayer'
        },
        qorder: 'integer',
        personaje: {
            model: 'personaje'
        }
    }
};

