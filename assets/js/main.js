/**
 *
 * Primeras pruebas
 */

var game;
game = {
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
        this.sockets();
    },

    sockets: {

        //Declaraciones temporales (deberian ser externas luego del loggin)
        id_alumno_cliente: 'ABC123',
        id_mapa_instacia_cliente: 'mapa_instancia_1',
        conectarse_a_mapa_instancia_cliente: true,
        // Fin declaraciones temporales

        mainPlayer_direction: {
            'left': false,
            'right': false,
            'up': false,
            'down': false
        },

        mainPlayer_acceleration: {
            'acel_x': 0,
            'acel_y': 0
        },

        flag_stateChanged : false,

        reset_mainPlayer_direction: function () {
            this.mainPlayer_direction.left = false;
            this.mainPlayer_direction.right = false;
            this.mainPlayer_direction.up = false;
            this.mainPlayer_direction.down = false;
        },

        update_mainPlayer_direction: function (data) {
            if (data = 'left') {
                this.mainPlayer_direction.left = true;
            } else if (data = 'left') {
                this.mainPlayer_direction.right = true;
            } else if (data = 'left') {
                this.mainPlayer_direction.up = true;
            } else if (data = 'left') {
                this.mainPlayer_direction.down = true;
            }

            flag_stateChanged = true;
        },
        update_mainPlayer_acceleration: function (data) {
            if (typeof data.x !== "undefined") {
                this.mainPlayer_acceleration.acel_x = data.x;
            }
            if (typeof data.y !== "undefined") {
                this.mainPlayer_acceleration.acel_y = data.y;
            }

            flag_stateChanged = true;
        },

        send_Server_mainPlayer_update: function () {

            if(this.flag_stateChanged){
                io.socket.put   ('/api/jugador_en_vivo/' + this.id_alumno_cliente, {    cireccion:         this.mainPlayer_direction,
                                                                                        aceleracion:    this.mainPlayer_acceleration }
                );

                this.flag_stateChanged = false;
            }
        },

        // ver si esto se ejecuta
        ///Funcion para suscribirnos al Mapa_instancia (es un Mapa_generico que pertenece a una determinada Clase),
        // y por lo tanto a todos los alumnos que participan de ese Mapa_intancia

        subscribe_to_server_mapa_instance : function () {
            io.socket.get(  '/api/jugador_en_vivo/subscribirse_a_mapa_instancia/',
                            {       id_mapa_instancia:  this.id_mapa_instacia_cliente,   // Valor para saber a que jugadores online suscribirme
                                    id_alumno:          this.id_alumno_cliente           // Valor para saber que jugador pasa a conectado (mi jugador)
                            },      //Valores a aenviar

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

                })
        },

       a:  subscribe_to_server_mapa_instance() // ver si se ejecuta esta funcion



    }







}; // game
