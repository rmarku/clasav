/*
 * Created by Fabricio on 12/11/2014.
 */

var server = {

    update_counter: 0,
    update_counterLimit: 1,
    previous_position :{
        x:0,
        y:0
    },

    /**
     * Description
     * @return
     * @method send_Server_mainPlayer_update
     * @param {} local_coordenates
     * @return
     */

     update_mainplayer: function (local_coordenates) {

        //Envio al servidor solo si:  o si hubo algun cambio en la ultima posicion conocida
        if ( (game.mainPlayer.pos.x != this.previous_position.x)|| (game.mainPlayer.pos.y != this.previous_position.y)) {

            io.socket.put('/api/personaje/updateStatus', {
                    mapa_instancia : game.mainPlayer.data.mapa_instancia.id.toString(),
                    id      :   game.mainPlayer.id,
                    direccion  :   game.mainPlayer.direccion,
                    x       :   ~~game.mainPlayer.pos.x,
                    y       :   ~~game.mainPlayer.pos.y
                }
                , function (resdata) {
                }
            );

            this.previous_position.x = game.mainPlayer.pos.x;
            this.previous_position.y = game.mainPlayer.pos.y;
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
        var counter = 0;

        io.socket.on('otherPlayer_updateState', function messageReceived(obj) {


            game.players[obj.id].direccion = obj.direccion;
            game.players[obj.id].pos.x = obj.x;
            game.players[obj.id].pos.y = obj.y;


            game.players[obj.id].updateBounds();
        });

/*
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
*/
    }
};
