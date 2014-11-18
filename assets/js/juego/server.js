/*
 * Created by Fabricio on 12/11/2014.
 */

var server = {

    update_counter: 0,
    update_timeOut: 15, // (500ms) aproximadamente
    enviado_velZero: true,

    /**
     * Description
     * @return
     * @method send_Server_mainPlayer_update
     * @param {} local_coordenates
     * @return
     */
    update_mainplayer: function (local_coordenates) {
        // Si hay algun estado activo (es decir si el jugador no esta quieto, y esta en movimiento), aumentar counter

        var player = game.mainPlayer;

        if (player.direccion !== 0) {
            this.update_counter++;
            this.enviado_velZero = false;
        }

        //Envio al servidor solo si: se agoto el counter, o si hubo algun cambio de estado (respecto al ultimo cambio de estado)
        if ((this.update_counter >= this.update_timeOut) || (player.direccion != player.direccion_anterior || (player.body.vel.length() === 0 && !this.enviado_velZero))) {

            io.socket.put('/api/personaje/updateStatus', {
                    mapa_instancia: player.data.mapa_instancia.id.toString(),
                    id: player.id,
                    estado: player.direccion,
                    animation: player.animationToUseThisFrame,
                    x: ~~player.pos.x,
                    y: ~~player.pos.y
                }
                , function (resdata) {
                }
            );
            /*
             io.socket.put('/api/personaje/' + game.mainPlayer.id, {
             estado: game.mainPlayer.direccion,
             x: ~~game.mainPlayer.pos.x, y: ~~game.mainPlayer.pos.y
             }
             , function (resdata) {
             }
             );
             */
            if (player.body.vel.length() === 0)
                this.enviado_velZero = true;
            player.direccion_anterior = player.direccion;
            this.update_counter = 0;
        }
    },

    join_mapa_instancia: function () {
        io.socket.get('/api/mapa_instancia/join',
            {
                mapa_instancia: game.mainPlayer.data.mapa_instancia.id.toString()
            },
            function joinCB(data) {
                console.log(data);
            }
        );
    },

    leave_mapa_instancia: function () {
        io.socket.get('/api/mapa_instancia/leave',
            {
                mapa_instancia: game.mainPlayer.data.mapa_instancia.id.toString()
            },
            function joinCB(data) {
                console.log(data);
            }
        );
    },

    listen_events: function () {

        io.socket.on('otherPlayer_updateState', function messageReceived(obj) {

            /*
             if ( obj.estado & 0 ||  game.players[obj.id].pos.x+15 < obj.x ||
             game.players[obj.id].pos.x-15 > obj.x ||
             game.players[obj.id].pos.y+15 < obj.y ||
             game.players[obj.id].pos.y-15 > obj.y) {
             game.players[obj.id].pos.x = obj.x;
             game.players[obj.id].pos.y = obj.y;
             game.players[obj.id].direccion = obj.estado;
             game.players[obj.id].updateBounds();
             return;
             }
             */
            game.players[obj.id].target_pos.x = obj.x;
            game.players[obj.id].target_pos.y = obj.y;

            game.players[obj.id].last_animation = obj.animation;

            game.players[obj.id].updateBounds();

        });

    }
};
