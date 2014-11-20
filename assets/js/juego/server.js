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
        var player = game.mainPlayer;

        if (player.direccion !== 0) {
            this.updateMyplayer_counter++;
            this.enviado_velZero = false;
        }

        //Envio al servidor solo si: se agoto el counter, o si hubo algun cambio de estado (respecto al ultimo cambio de estado)
        if ((this.updateMyplayer_counter >= this.updateMyplayer_timeOut) || (player.direccion != player.direccion_anterior || (player.body.vel.length() === 0 && !this.enviado_velZero))) {

            io.socket.put('/api/personaje/updateStatus', {
                    mapa_instancia:     player.data.mapa_instancia.id.toString(),
                    id:                 player.id,
                    estado:             player.direccion,
                    animation:          player.animationToUseThisFrame,
                    x:                  ~~player.pos.x,
                    y:                  ~~player.pos.y
                }
                , function (resdata) {
                }
            );

            if (player.body.vel.length() === 0)
                this.enviado_velZero = true;

            player.direccion_anterior = player.direccion;
            this.updateMyplayer_counter = 0;
        }

    },

    update_Personaje: function () {
        this.updatePersonaje_counter++;

        if(this.updatePersonaje_counter >= this.updatePersonaje_timeOut){

            $.post('/api/personaje/' + game.mainPlayer.id, {
                    animation:  game.mainPlayer.animationToUseThisFrame,
                    direccion:  game.mainPlayer.direccion,
                    x:          ~~game.mainPlayer.pos.x,
                    y:          ~~game.mainPlayer.pos.y
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
                personajeId:        game.mainPlayer.data.id
            },
            function joinCB(data) {
                console.log(data);
            }
        );
    },

    leave_mapa_instancia: function () {
        io.socket.get('/api/mapa_instancia/leave',
            {
                personajeId:        game.mainPlayer.data.id,
                mapa_instanciaId:   game.mainPlayer.data.mapa_instancia.id
            },
            function joinCB(data) {
                console.log(data);
            }
        );
    },

    listen_events: function () {

        io.socket.on('otherPlayer_updateState', function messageReceived(obj) {

            game.players[obj.id].target_pos.x = obj.x;
            game.players[obj.id].target_pos.y = obj.y;
            game.players[obj.id].newTarget = true;
            game.players[obj.id].original_target_pos.x = obj.x;
            game.players[obj.id].original_target_pos.y = obj.y;

            game.players[obj.id].last_animation = obj.animation;

            game.players[obj.id].updateBounds();

        });

        io.socket.on('otherPlayer_leave', function messageReceived(personajeId) {
            game.removeOtherPlayer(personajeId);
        });

        io.socket.on('otherPlayer_join', function messageReceived(data) {
            game.create_otherPlayer(data);
        });

    }
};
