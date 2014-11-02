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
        // set all ressources to be loaded
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
     * @method loaded
     * @return
     */
    loaded: function () {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.state.change(me.state.PLAY);         //Luego de esto se ejectuo play.js->onResetEvent()

        this.sockets_game.subscribe_to_server_mapa_instance();
    },

    sockets_game: {

        //Declaraciones temporales (deberian ser externas luego del loggin)
        id_alumno_cliente: 1,
        id_mapa_instancia_cliente: 1,
        conectarse_a_mapa_instancia_cliente: true,
        id_jugador_en_vivo: 1,
        update_counter: 0,
        update_timeOut: 200, // (5)segs aproximadamente

        // Fin declaraciones temporales

        mainPlayer_estado: {
            'left': false,
            'right': false,
            'up': false,
            'down': false
        },

        mainPlayer_previous_estado: {
            'left': false,
            'right': false,
            'up': false,
            'down': false
        },

        mainPlayer_coordenates: {
            'x': 0,
            'y': 0
        },

        //flag_stateChanged : false,

        /**
         * Description
         * @method reset_mainPlayer_estado
         * @return
         */
        reset_mainPlayer_estado: function () {
            this.mainPlayer_estado.left = false;
            this.mainPlayer_estado.right = false;
            this.mainPlayer_estado.up = false;
            this.mainPlayer_estado.down = false;
        },

        /**
         * Description
         * @method update_mainPlayer_estado
         * @param {} direction
         * @param {} boolean
         * @return
         */
        update_mainPlayer_estado: function (direction, boolean) {
            if (direction == 'left') {
                this.mainPlayer_estado.left = boolean;
            } else if (direction == 'right') {
                this.mainPlayer_estado.right = boolean;
            } else if (direction == 'up') {
                this.mainPlayer_estado.up = boolean;
            } else if (direction == 'down') {
                this.mainPlayer_estado.down = boolean;
            }

        },

        /**
         * Description
         * @method update_mainPlayer_coordenates
         * @param {} coordenates_mainPlayer
         * @return
         */
        update_mainPlayer_coordenates: function (coordenates_mainPlayer) {
            this.mainPlayer_coordenates.x = coordenates_mainPlayer.x;
            this.mainPlayer_coordenates.y = coordenates_mainPlayer.y;
        },

        /**
         * Description
         * @method send_Server_mainPlayer_update
         * @param {} local_coordenates
         * @return
         */
        send_Server_mainPlayer_update: function (local_coordenates) {


            // Si hay algun estado activo (es decir si el jugador no esta quieto, y esta en movimiento), aumentar counter
            if (this.mainPlayer_estado.left || this.mainPlayer_estado.right || this.mainPlayer_estado.up || this.mainPlayer_estado.down) {
                this.update_counter++;
            }

            //Envio al servidor solo si: hubieron 500 updates en el mismo estado, o si hubo algun cambio de estado (respecto al ultimo cambio de estado)
            var ant = this.mainPlayer_previous_estado;
            var act = this.mainPlayer_estado;
            if ((this.update_counter >= this.update_timeOut) || (act.left != ant.left) || (act.right != ant.right) || (act.down != ant.down) || (act.up != ant.up )) {

                io.socket.put('/api/jugador_en_vivo/' + this.id_jugador_en_vivo, {  estado: angular.toJson(this.mainPlayer_estado),
                        coordenadas: angular.toJson(this.mainPlayer_coordenates) }

                    , function (resdata) {
                    }
                );
                //if (!(this.update_counter >= 250)) {
                this.mainPlayer_previous_estado.left = this.mainPlayer_estado.left;
                this.mainPlayer_previous_estado.right = this.mainPlayer_estado.right;
                this.mainPlayer_previous_estado.up = this.mainPlayer_estado.up;
                this.mainPlayer_previous_estado.down = this.mainPlayer_estado.down;
                //}

                this.update_counter = 0;
            }
        },

        ///Funcion para suscribirnos al Mapa_instancia (es un Mapa_generico que pertenece a una determinada Clase),
        // y por lo tanto a todos los alumnos que participan de ese Mapa_intancia
        /**
         * Description
         * @method subscribe_to_server_mapa_instance
         * @return
         */
        subscribe_to_server_mapa_instance: function () {
            //alert('suscribing');

            io.socket.get('/api/jugador_en_vivo/subscribirse_a_mapa_instancia/',
                {       id_mapa_instancia: this.id_mapa_instancia_cliente,   // Valor para saber a que jugadores online suscribirme
                    id_alumno: this.id_alumno_cliente           // Valor para saber que jugador pasa a conectado (mi jugador)
                },

                function messageReceived(json_lista_jugadores_mapa_instancia) {

                    //console.log(json_lista_jugadores_mapa_instancia); //Muestro en consola para
                    while (json_lista_jugadores_mapa_instancia.length) {
                        var jugador = json_lista_jugadores_mapa_instancia.pop();

                    }
                }
            );

            // Listen to incoming Updates from Jugador_en_vivo we've just subscribed to
            io.socket.on('jugador_en_vivo', function messageReceived(jsonObject) {

                switch (jsonObject.verb) {
                    case 'updated':
                        break;
                    //console.log("socket.on:");
                    //console.log(angular.fromJson(jsonObject));
                    default:
                        break;
                }
            });

        },

        /**
         * Description
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
