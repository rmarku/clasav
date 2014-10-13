/**
 *
 * Primeras pruebas
 */

var game = {
    mainPlayer: {},
    players: {},
    NPCs: {},

    /*
     * initialization
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
     */
    loaded: function () {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.state.change(me.state.PLAY);         //Luego de esto se ejectuo play.js->onResetEvent()

        this.sockets_game.subscribe_to_server_mapa_instance();
    },

    sockets_game : {

        //Declaraciones temporales (deberian ser externas luego del loggin)
        id_alumno_cliente: 'fabricio_collino@gmail.com',
        id_mapa_instancia_cliente: 'mapa_instancia1',
        conectarse_a_mapa_instancia_cliente: true,
        id_jugador_en_vivo: 'jugador_vivo_1',
        update_counter:0,

        // Fin declaraciones temporales

        mainPlayer_estado: {
            'left':   false,
            'right':  false,
            'up':     false,
            'down':   false
        },

        mainPlayer_previous_estado: {
            'left':   false,
            'right':  false,
            'up':     false,
            'down':   false
        },

        mainPlayer_coordenates: {
            'x': 0,
            'y': 0
        },

        //flag_stateChanged : false,

        reset_mainPlayer_estado: function () {
            this.mainPlayer_estado['left'] = false;
            this.mainPlayer_estado['right']= false;
            this.mainPlayer_estado['up'] = false;
            this.mainPlayer_estado['down'] = false;
        },

        update_mainPlayer_estado: function (localdata) {
            if (typeof localdata.left !== "undefined") {
                this.mainPlayer_estado['left'] = localdata.left;
            }else
            if (typeof localdata.right !== "undefined") {
                this.mainPlayer_estado['right']  = localdata.right;
            }else
            if (typeof localdata.up !== "undefined") {
                this.mainPlayer_estado['up']  = localdata.up;
            }else
            if (typeof localdata.down !== "undefined") {
                this.mainPlayer_estado['down']  = localdata.down;
            }

        },

        update_mainPlayer_coordenates: function (coordenates_mainPlayer) {
            this.mainPlayer_coordenates.x = coordenates_mainPlayer.x;
            this.mainPlayer_coordenates.y = coordenates_mainPlayer.y;
        },

        send_Server_mainPlayer_update: function () {


            // Si hay algun estado activo (es decir si el jugador no esta quieto, y esta en movimiento), aumentar counter
            if(this.mainPlayer_estado['left'] || this.mainPlayer_estado['right']|| this.mainPlayer_estado['up']|| this.mainPlayer_estado['down']){
                this.update_counter++;
            }

            //Envio al servidor solo si: hubieron 500 updates en el mismo estado, o si hubo algun cambio de estado (respecto al ultimo cambio de estado)
            if( (this.update_counter >= 500)    ||      (this.mainPlayer_previous_estado['left']     !=     this.mainPlayer_estado['left'])

                                                ||      (this.mainPlayer_previous_estado['right']    !=     this.mainPlayer_estado['right'])

                                                ||      (this.mainPlayer_previous_estado['up']       !=     this.mainPlayer_estado['up'])

                                                ||      (this.mainPlayer_previous_estado['down']     !=     this.mainPlayer_estado['down'])    ){

                io.socket.put   ('/api/jugador_en_vivo/' + this.id_jugador_en_vivo,   { estado   :    angular.toJson(this.mainPlayer_estado) ,
                                                                                        coordenadas :    angular.toJson(this.mainPlayer_coordenates)  }

                        ,function (resdata){    console.log("socket.put:");
                                                console.log(resdata)            });



                //this.mainPlayer_previous_estado = ;
                //
                if(!(this.update_counter >= 500)) {
                    this.mainPlayer_previous_estado['left'] = this.mainPlayer_estado['left'];
                    this.mainPlayer_previous_estado['right'] = this.mainPlayer_estado['right'];
                    this.mainPlayer_previous_estado['up'] = this.mainPlayer_estado['up'];
                    this.mainPlayer_previous_estado['down'] = this.mainPlayer_estado['down'];
                    //this.reset_mainPlayer_estado();
                }
                this.update_counter = 0;
            }


        },

        ///Funcion para suscribirnos al Mapa_instancia (es un Mapa_generico que pertenece a una determinada Clase),
        // y por lo tanto a todos los alumnos que participan de ese Mapa_intancia
        subscribe_to_server_mapa_instance : function () {
            //alert('suscribing');

            io.socket.get(  '/api/jugador_en_vivo/subscribirse_a_mapa_instancia/',
                            {       id_mapa_instancia:  this.id_mapa_instancia_cliente,   // Valor para saber a que jugadores online suscribirme
                                    id_alumno:          this.id_alumno_cliente           // Valor para saber que jugador pasa a conectado (mi jugador)
                            },

                            function messageReceived(json_lista_jugadores_mapa_instancia) {

                                //console.log(json_lista_jugadores_mapa_instancia); //Muestro en consola para
                                while (json_lista_jugadores_mapa_instancia.length) {
                                    var jugador = json_lista_jugadores_mapa_instancia.pop();


                                    jugador.id;         //  id del jugador como jugador Online(no es el mismo que el id del alumno)
                                    jugador.alumno;     //  id del jugador como alumno
                                    jugador.conectado;  //  true or false)
                                    jugador.estado;  //  array del tipo this.mainPlayer_estado
                                    jugador.estad;//  array del tipo this.mainPlayer_coordenates

                                }

                            }
            );

            // Listen to incoming Updates from Jugador_en_vivo we just subscribed to
            io.socket.on('jugador_en_vivo',function messageReceived(jsonObject) {

                switch (jsonObject.verb) {
                    case 'updated':
                        console.log("socket.on:");
                        console.log(angular.fromJson(jsonObject));
                    default: break;
                }
            });

        },

        unsubscribe_from_server_mapa_instance : function () {
            io.socket.get(  '/api/jugador_en_vivo/desubscribirse_de_mapa_instancia/',
                            {       id_mapa_instancia:  this.id_mapa_instancia_cliente   // Valor para saber a que jugadores online desuscribirme
                            },
                            function messageReceived(json_lista_jugadores_mapa_instancia) {
                                                        // no hace falta hacer nada
                            }
            );
        }





    }







}; // game
