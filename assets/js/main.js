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


    },

    sockets_game : {

        //Declaraciones temporales (deberian ser externas luego del loggin)
        id_alumno_cliente: 'fabricio_collino@gmail.com',
        id_mapa_instancia_cliente: 'mapa_instancia1',
        conectarse_a_mapa_instancia_cliente: true,
        id_jugador_en_vivo: 'jugador_vivo_1',

        // Fin declaraciones temporales

        mainPlayer_direction: {
            'left':   false,
            'right':  false,
            'up':     false,
            'down':   false
        },

        mainPlayer_acceleration: {
            'acel_x': 0,
            'acel_y': 0
        },

        //flag_stateChanged : false,

        reset_mainPlayer_direction: function () {
            this.mainPlayer_direction.left = false;
            this.mainPlayer_direction.right = false;
            this.mainPlayer_direction.up = false;
            this.mainPlayer_direction.down = false;
        },

        update_mainPlayer_direction: function (localdata) {
            if (typeof localdata.left !== "undefined") {
                this.mainPlayer_direction['left'] = localdata.left;
            }else
            if (typeof localdata.right !== "undefined") {
                this.mainPlayer_direction['right']  = localdata.right;
            }else
            if (typeof localdata.up !== "undefined") {
                this.mainPlayer_direction['up']  = localdata.up;
            }else
            if (typeof localdata.down !== "undefined") {
                this.mainPlayer_direction['down']  = localdata.down;
            }else
            console.log(localdata);
            //flag_stateChanged = true;
        },
        update_mainPlayer_acceleration: function (data) {
            if (typeof data.x !== "undefined") {
                this.mainPlayer_acceleration.acel_x = data.x;
            }
            if (typeof data.y !== "undefined") {
                this.mainPlayer_acceleration.acel_y = data.y;
            }

            //flag_stateChanged = true;
        },

        send_Server_mainPlayer_update: function () {
            // if(this.flag_stateChanged){angular.toJson($scope.user);
            io.socket.put   ('/api/jugador_en_vivo/' + this.id_jugador_en_vivo,   { direccion   :    angular.toJson(this.mainPlayer_direction) ,
                                                                                    aceleracion :    angular.toJson(this.mainPlayer_acceleration)  }


                ,function (resdata){ console.log(resdata) });
                //console.log('direction:'+this.mainPlayer_direction+'aceleration'+this.mainPlayer_acceleration);

               // this.flag_stateChanged = false;
           // }
        },

        // ver si esto se ejecuta
        ///Funcion para suscribirnos al Mapa_instancia (es un Mapa_generico que pertenece a una determinada Clase),
        // y por lo tanto a todos los alumnos que participan de ese Mapa_intancia

        subscribe_to_server_mapa_instance : function () {
            //alert('suscribing');

            io.socket.get(  '/api/jugador_en_vivo/subscribirse_a_mapa_instancia/',
                            {       id_mapa_instancia:  this.id_mapa_instancia_cliente,   // Valor para saber a que jugadores online suscribirme
                                    id_alumno:          this.id_alumno_cliente           // Valor para saber que jugador pasa a conectado (mi jugador)
                            },

                            function messageReceived(json_lista_jugadores_mapa_instancia) {

                                console.log(json_lista_jugadores_mapa_instancia); //Muestro en consola para
                                while (json_lista_jugadores_mapa_instancia.length) {
                                    var jugador = json_lista_jugadores_mapa_instancia.pop();


                                    jugador.id;         //  id del jugador como jugador Online(no es el mismo que el id del alumno)
                                    jugador.alumno;     //  id del jugador como alumno
                                    jugador.conectado;  //  true or false)
                                    jugador.direccion;  //  array del tipo this.mainPlayer_direction
                                    jugador.aceleracion;//  array del tipo this.mainPlayer_acceleration

                                }

                            }
            );

            // Listen to incoming Updates from Jugador_en_vivo we just subscribed to
            io.socket.on('jugador_en_vivo',function messageReceived(jsonObject) {

                switch (jsonObject.verb) {
                    case 'updated':
                        console.log(jsonObject.data);
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
