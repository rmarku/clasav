/*
 * Created by Fabricio on 12/11/2014.
 */

var server = {

    updateMyplayer_counter: 0,
    updateMyplayer_timeOut: 15,     // (500  ms) Aproximadamente

    updatePersonaje_counter: 0,
    updatePersonaje_timeOut: 180,   // (6000 ms) Aproximadamente

    enviado_velZero: true,

    /**
     * Description
     * @return
     * @method send_Server_mainPlayer_update
     * @param {} local_coordenates
     * @return
     */
    update_myPlayer: function (local_coordenates) {
        this.update_myPlayer_in_OtherPlayers();
        this.update_Personaje();
    },

    update_myPlayer_in_OtherPlayers: function () {
        // Si hay algun estado activo (es decir si el jugador no esta quieto, y esta en movimiento), aumentar counter
        var p = game.mainPlayer;

        if (p.direccion !== 0) {
            this.updateMyplayer_counter++;
            this.enviado_velZero = false;
        }

        //Envio al servidor solo si: se agoto el counter, o si hubo algun cambio de estado (respecto al ultimo cambio de estado)
        if ((p.direccion !== 0 && (this.updateMyplayer_counter >= this.updateMyplayer_timeOut ||
            p.direccion != p.direccion_anterior)) ||
            (p.body.vel.length() === 0 && !this.enviado_velZero)) {

            io.socket.put('/api/personaje/updateStatus', {
                    mapa_instancia: p.data.mapa_instancia.id.toString(),
                    id: p.id,
                    estado: p.direccion,
                    animation: p.animationToUseThisFrame,
                    x: ~~p.pos.x,
                    y: ~~p.pos.y
                }
                , function (resdata) {
                }
            );

            if (p.body.vel.length() === 0)
                this.enviado_velZero = true;

            p.direccion_anterior = p.direccion;
            this.updateMyplayer_counter = 0;
        }

    },

    update_Personaje: function () {
        this.updatePersonaje_counter++;

        if (this.updatePersonaje_counter >= this.updatePersonaje_timeOut) {

            $.post('/api/personaje/' + game.mainPlayer.id, {
                    animation: game.mainPlayer.animationToUseThisFrame,
                    direccion: game.mainPlayer.direccion,
                    x: ~~game.mainPlayer.pos.x,
                    y: ~~game.mainPlayer.pos.y
                }
                , function (resdata) {
                }
            );
            this.updatePersonaje_counter = 0;
        }
    },

    join_mapa_instancia: function () {
        io.socket.get('/api/mapa_instancia/join',
            {
                personajeId: game.mainPlayer.data.id
            },
            function joinCB(data) {
            }
        );
    },

    leave_mapa_instancia: function () {
        io.socket.get('/api/mapa_instancia/leave',
            {
                personajeId: game.mainPlayer.data.id,
                mapa_instanciaId: game.mainPlayer.data.mapa_instancia.id
            },
            function joinCB(data) {
            }
        );
    },

    listen_events: function () {

        io.socket.on('otherPlayer_updateState', function messageReceived(obj) {

            game.players[obj.id].last_animation = obj.animation;
            game.players[obj.id].nextNode(new me.Vector2d(obj.x, obj.y));
            game.players[obj.id].updateBounds();
        });

        io.socket.on('otherPlayer_leave', function messageReceived(personajeId) {
            game.removeOtherPlayer(personajeId);
        });

        io.socket.on('otherPlayer_join', function messageReceived(data) {
            game.addOnlineOtherPlayer(data);
        });

    }
};
