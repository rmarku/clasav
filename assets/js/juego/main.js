/**
 *
 * Primeras pruebas
 */

var game = {
    mainPlayer: {},
    players: [],
    NPCPlayer: [],
    players: {},
    NPCs: {},
    items: {},
    sprites: {},

    /**
     * initialization
     * @return
     * @method onload
     * @return
     */
    onload: function () {
        me.sys.fps = 30;
        if (!me.video.init('jsapp', me.video.CANVAS, 800, 480)) {
            alert("Perdon pero su Navegador no soporta canvas de HTML5.Instale Firefox o Google Chrome!");
            return;
        }

        me.plugin.register(debugPanel, "debug");
        me.audio.init('ogg,mp3');

        // funcion a llamar cuando todos los recursos esten cargados
        me.loader.onload = this.loaded.bind(this);

        // Cargo los recursos desde la API
        $.getJSON("api/resources.json", function (data) {
            me.loader.preload(data);
            // Cargo todo y muestro pantalla de carga
            me.state.change(me.state.LOADING);
        });

        // Traigo todos los items
        io.socket.get('/api/item/getItems', function (data) {
            data.forEach(function (item) {
                game.items[item.id] = item;
            });
        });

        // Traigo todos los sprites.
        io.socket.get('/api/sprite/getSprites', function (data) {
            data.forEach(function (sprite) {
                game.sprites[sprite.id] = sprite;
            });
        });

    },

    /**
     * Llamo cuando todos los recursos estan cargados
     * @return
     * @method loaded
     * @return
     */
    loaded: function () {
        // set the "Play/Ingame" Screen Object
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("NPCPlayer", game.NPCPlayer);

        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.change(me.state.PLAY);         //Luego de esto se ejectuo play.js->onResetEvent()
    },

    server: {

        //Declaraciones temporales (deberian ser externas luego del loggin)
        update_counter: 0,
        update_timeOut: 200, // (5)segs aproximadamente

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

            //Envio al servidor solo si: hubieron 500 updates en el mismo estado, o si hubo algun cambio de estado (respecto al ultimo cambio de estado)
            var ant = this.mainPlayer_previous_estado;
            var act = this.mainPlayer_estado;
            if ((this.update_counter >= this.update_timeOut) || (game.mainPlayer.direccion != game.mainPlayer.direccion_anterior)) {

                io.socket.put('/api/personaje/' + game.mainPlayer.id, {
                        estado: game.mainPlayer.direccion,
                        x: ~~game.mainPlayer.pos.x, y: ~~game.mainPlayer.pos.y
                    }

                    , function (resdata) {
                    }
                );

                game.mainPlayer.direccion_anterior = game.mainPlayer.direccion;

                this.update_counter = 0;
            }
        },

        ///Funcion para suscribirnos al Mapa_instancia (es un Mapa_generico que pertenece a una determinada Clase),
        // y por lo tanto a todos los alumnos que participan de ese Mapa_intancia
        /**
         * Description
         * @return
         * @method subscribe_to_server_mapa_instance
         * @return
         */
        subscribe_to_mapa_instance: function () {

            // Listen to incoming Updates from Jugador_en_vivo we've just subscribed to
            //  io.socket.get('/api/personaje/' + game.mainPlayer.id, function messageReceived() {
            io.socket.on('personaje', function messageReceived(obj) {
                if (obj.id != game.mainPlayer.id)
                    switch (obj.verb) {
                        case 'updated':

                            if (typeof obj.data.direccion != 'undefined' && obj.data.direccion != game.players[obj.id].direccion) {
                                game.players[obj.id].direccion = obj.data.estado;
                                game.mainPlayer.direccion_anterior = game.mainPlayer.direccion;
                            }
                            if (typeof obj.data.x != 'undefined' && obj.data.x != ~~game.players[obj.id].x) {
                                game.players[obj.id].pos.x = obj.data.x;
                            }
                            if (typeof obj.data.y != 'undefined' && obj.data.y != ~~game.players[obj.id].y) {
                                game.players[obj.id].pos.y = obj.data.y;
                            }
                            break;
                        default:
                            break;
                    }
            });
            //    });
        },

        /**
         * Description
         * @return
         * @method unsubscribe_from_server_mapa_instance
         * @return
         */
        unsubscribe_from_server_mapa_instance: function () {
            io.socket.get('/api/jugador_en_vivo/desubscribirse_de_mapa_instancia/',
                {
                    id_mapa_instancia: this.id_mapa_instancia_cliente   // Valor para saber a que jugadores online desuscribirme
                },
                function messageReceived(json_lista_jugadores_mapa_instancia) {
                    // no hace falta hacer nada
                }
            );
        }
    }
}; // game
