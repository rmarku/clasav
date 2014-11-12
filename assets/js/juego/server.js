/*
 * Created by Fabricio on 12/11/2014.
 */

server = {

    update_counter: 0,
    update_timeOut: 100, // (3)segs aproximadamente

    /**
     * Description
     * @return
     * @method send_Server_mainPlayer_update
     * @param {} local_coordenates
     * @return
     */
        update_mainplayer: function (local_coordenates) {
        // Si hay algun estado activo (es decir si el jugador no esta quieto, y esta en movimiento), aumentar counter
        if (game.mainPlayer.direccion !== 0) {
            game.update_counter++;
        }

        //Envio al servidor solo si: se agoto el counter, o si hubo algun cambio de estado (respecto al ultimo cambio de estado)
        if ((this.update_counter >= this.update_timeOut) || (game.mainPlayer.direccion != game.mainPlayer.direccion_anterior)) {

            io.socket.put('/api/personaje/updateStatus', {
                    id      :   game.mainPlayer.id,
                    estado  :   game.mainPlayer.direccion,
                    x       :   ~~game.mainPlayer.pos.x,
                    y       :   ~~game.mainPlayer.pos.y
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

            game.mainPlayer.direccion_anterior = game.mainPlayer.direccion;
            this.update_counter = 0;
        }
    },

    join_mapa_instancia: function () {
        io.socket.get('/api/mapa_instancia/join',
            {
                mapa_instanciaID: game.mainPlayer.mapa_instancia
            },
            function joinCB(data) {
                console.log(data);
            }
        );
    },

    leave_mapa_instancia: function () {
        io.socket.get('/api/mapa_instancia/leave',
            {
                mapa_instanciaID: game.mainPlayer.mapa_instancia
            },
            function joinCB(data) {
                console.log(data);
            }
        );
    },

    listen_events: function () {

        io.socket.on('otherPlayer_updateState', function messageReceived(obj) {
            game.players[obj.id].direccion = obj.estado;
        });


        // Listen to incoming Updates from Jugador_en_vivo we've just subscribed to
        io.socket.on('personaje', function messageReceived(obj) {
            if (obj.id != game.mainPlayer.id)
                switch (obj.verb) {
                    case 'updated':
                        if ((obj.data.conectado == 'conectado') && (typeof game.playersOffline[obj.data.id] != 'undefined') ){
                            game.saveOnlineOtherPlayer(game.playersOffline[id]);
                            game.removeOfflineOtherPlayer(obj.data.id);
                            me.game.world.addChild(game.players[obj.data.id], 9);
                        }else
                        if ((obj.data.conectado == 'desconectado') && (typeof game.players[obj.data.id] != 'undefined') ){
                            game.saveOfflineOtherPlayer(game.players[id]);
                            game.removeOtherPlayer(obj.data.id);
                        }
                        if (typeof obj.data.estado != 'undefined'){ //&& obj.data.estado != game.players[obj.id].direccion) {
                            game.players[obj.id].direccion = obj.data.estado;
                            //game.players[obj.id].direccion_anterior = game.players[obj.id].direccion;
                        }
                        if (typeof obj.data.x != 'undefined'){// && obj.data.x != ~~game.players[obj.id].x) {
                            game.players[obj.id].pos.x = obj.data.x;
                        }
                        if (typeof obj.data.y != 'undefined'){// && obj.data.y != ~~game.players[obj.id].y) {
                            game.players[obj.id].pos.y = obj.data.y;
                        }
                        game.players[obj.id].updateBounds();
                        break;

                    case 'created':
                        break;
                    default:
                        break;
                }
        });
    }
};