/**
 *
 * Primeras pruebas
 */

var game = {
    mainPlayer: {},
    players: {},
    NPCs: {},

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

                io.socket.put('/api/personaje/' + game.mainPlayer.id, {  estado: game.mainPlayer.direccion,
                        x: game.mainPlayer.pos.x, y: game.mainPlayer.pos.y }

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
            io.socket.get('/api/personaje/' + game.mainPlayer.id, function messageReceived(jsonObject) {
                io.socket.on('/api/personaje/' + game.mainPlayer.id, function messageReceived(jsonObject) {

                    switch (jsonObject.verb) {
                        case 'updated':
                            break;
                        //console.log("socket.on:");
                        //console.log(angular.fromJson(jsonObject));
                        default:
                            break;
                    }
                });
            });
        },

        /**
         * Description
         * @return
         * @method unsubscribe_from_server_mapa_instance
         * @return
         */
        unsubscribe_from_server_mapa_instance: function () {
            io.socket.get('/api/jugador_en_vivo/desubscribirse_de_mapa_instancia/',
                {       id_mapa_instancia: this.id_mapa_instancia_cliente   // Valor para saber a que jugadores online desuscribirme
                },
                function messageReceived(json_lista_jugadores_mapa_instancia) {
                    // no hace falta hacer nada
                }
            );
        }
    }
}; // game
