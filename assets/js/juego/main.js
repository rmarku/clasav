toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

/**
 * Clase general del juego.
 * @class game
 */
var game = {
    mainPlayer: {},
    userId: 0,
    players: {},
    clavLevelEntity: {},
    NPCs: {},
    items: {},
    sprites: {},
    misClases: [],
    claseActual: {},
    claseActualId: '',
    logo: {},
    debug: false,
    nextxy: {x: 0, y: 0, direction: 0},


    /**
     * Funcion ejecutada al cargar la pagina.
     * Primero trae los datos del usuario y luego los datos del personaje y
     * verifica que el usuario este logueado y que posea un personaje, de no
     * ser así, redirecciona el navegador al Home
     * Si esta logueado, llama a la funcion on de esta clase.
     * @method start
     * @memberof game
     */
    start: function () {
        io.socket.get("/api/user/getUser", function (data) {
            if (typeof data.userId == 'undefined') {
                window.location.href = '/';
                return;
            }
            io.socket.get('/api/personaje/getPersonaje_masReciente', function (pj) {
                if (pj === null) {
                    window.location.href = '/#/personaje';
                    return;
                }
                this.userId = data.userId;
                setTimeout(function () {

                    game.onload();
                }, 1000);
            });
        });
    },
    /**
     * Funcion encargada de inicializar la biblioteca MelonJS, el hud y
     * cargar los recursos del juego (sprites, tilesets, maps,etc)
     * Al finalizar la carga de recursos, llama a la funcion loaded de
     * esta clase
     * @method onload
     * @memberof game
     */
    onload: function () {
        me.sys.pauseOnBlur = false;
        me.sys.resumeOnFocus = false;
        me.sys.stopOnAudioError = false;
        me.sys.fps = 20;
        //me.video.init("screen",32,32,!0,"auto",!0)
        var video = me.video.WEBGL;
        if (document.location.hash === "#debug" || document.location.hash === "#nogl") {
            video = me.video.CANVAS;
        }

        // Verifico si es un dispositivo movil para mostrar el HUD movil
        if (me.device.isMobile) {
            if (!me.video.init(400, 240, {
                    wrapper: "game",
                    renderer: video,
                    scaleMethod: "flex-width",
                    scale: 'auto'
                })) {
                alert("Perdon pero su Navegador no soporta canvas de HTML5. Instale Firefox o Google Chrome!");
                return;
            }
            hud.movil.init();
        } else {
            if (!me.video.init(1024, 315, {
                    wrapper: "game",
                    renderer: video,
                    scaleMethod: "flex-width",
                    scale: 'auto'
                })) {
                alert("Perdon pero su Navegador no soporta canvas de HTML5. Instale Firefox o Google Chrome!");
                return;
            }
        }

        // Inicializo plugin de debug si se solicita en la URI
        if (document.location.hash === "#debug") {
            this.debug = true;
            window.onReady(function () {
                me.plugin.register(me.debug.Panel, "debug");
            });
        }

        // Plugin: AStar pathfinding
        me.plugin.register(aStarPlugin, "astar");

        // Initialize the audio.
        me.audio.init("ogg,mp3,wav");

        // funcion a llamar cuando todos los recursos esten cargados
        me.loader.onload = this.loaded.bind(this);

        // Ordenar por posicion en Y del objeto
        me.game.world.sortOn = "y";

        // Cargo los recursos desde la API
        $.getJSON("api/resources.json", function (data) {
            // Cargo todo y muestro pantalla de carga
            game.logo = document.createElement('img');

            game.logo.onload = function () {
                me.loader.preload(data);
                me.state.set(me.state.LOADING, new game.CustomLoadingScreen());
                me.state.change(me.state.LOADING);
            };
            game.logo.src = "/images/logoLoader.png";
        });

        /// Traigo todos los items
        io.socket.get('/api/item/getItems', function (data) {
            data.forEach(function (item) {
                game.items[item.id] = item;
            });
        });

        /// Traigo todos los sprites.
        io.socket.get('/api/sprite/getSprites', function (data) {
            data.forEach(function (sprite) {
                game.sprites[sprite.id] = sprite;
            });
        });
    },

    /**
     * Agrega cada una de las entidades a la pila de melon para poder
     * ser utilizados rapidamente mas adelante.
     * Luego cambio el estado de melon a Juego.
     * @method loaded
     * @memberof game
     */
    loaded: function () {
        // set the "Play/Ingame" Screen Object
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("NPCPlayer", game.NPCPlayer);
        me.pool.register("otherPlayer", game.OtherPlayer);
        me.pool.register("clavLevelEntity", game.clavLevelEntity);

        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.change(me.state.PLAY);         //Luego de esto se ejectuo play.js->onResetEvent()
    },

    /**
     * Funcion llamada cuando hay cambio de mapa, se deben hacer varias tareas,
     * remover todas las entidades actuales, actualizar el minimapa al nuevo e
     * informar al server de que estamos en un nuevo mapa para recibir las notificaciones
     * de este nuevo mapa.
     * @method change_level
     * @memberof game
     * @param {string} target_mapa_generico - mapa al que debemos cambiar
     */
    change_level: function (target_mapa_generico) {

        //Guardo data para poder eliminar inmediatamente
        var data = game.mainPlayer.data;
        game.remove_AllPlayers();

        var map = me.game.currentLevel;
        minimap.updateMap(map.cols * map.tilewidth, map.cols * map.tilewidth, map.name);
        //Actualizo mi cambio de mapa_instancia en la BD, borrando mi suscripcion al Room anterior, suscribiendo al nuevo
        //Envio con socket para poder desuscribirlo
        io.socket.post('/api/mapa_instancia/change_level',
            {
                claseID: game.claseActualId,           //No importa que se mande vacio si esta en mapa principal. El server sabe! jaj
                mapa_generico: target_mapa_generico,    //target
                mapa_instancia: data.mapa_instancia.id, //room actual
                personajeId: data.id,
                change_level_new_x: game.nextxy.x,
                change_level_new_y: game.nextxy.y,
                change_level_new_animation: game.nextxy.direction
            },
            function changeLevelCB(data) {
                game.addMainPlayer(data);
                game.create_OtherPlayers();
                game.get_claseActual();
            });
    },


    /**
     * Trae los datos del servidor de otro personaje y crea la entidad otherplayer con sus datos.
     * @method create_OtherPlayers
     * @memberof game
     */
    create_OtherPlayers: function () {
        io.socket.get('/api/personaje?mapa_instancia=' + game.mainPlayer.data.mapa_instancia.id + '&&masRecientementeUtilizado=true&&conectado=true', function messageReceived(personajes) {

            while (personajes.length) {
                var personaje = personajes.pop();

                if (personaje.duenio.id != game.userId) {
                    game.addOnlineOtherPlayer(personaje);
                }
            }
        });
    },

    /**
     * Agrega al personaje del jugador al mapa con los datos data
     * @method addMainPlayer
     * @memberof game
     * @param {object} data - datos del personaje
     */
    addMainPlayer: function (data) {
        game.mainPlayer = me.pool.pull('mainPlayer', Number(data.x),
            Number(data.y), {
                width: 32,
                height: 48,
                data: data
            });
        me.game.world.addChild(game.mainPlayer, 6);
        me.game.world.sort();
        hud.update();
    },

    /**
     * funcion que crea una entidad para moverse de nivel a nivel
     * @method add_clavLevelEntity
     * @memberof game
     * @param {object} info - informacion del lvl entity
     */
    add_clavLevelEntity: function (info) {

        var data = {};
        data.duration = 250;
        data.fade = "#000000";
        data.height = 32;
        data.width = 32;
        data.isEllipse = false;
        data.isPolyLine = false;
        data.isPolygon = false;
        data.name = "clavLevelEntity";
        data.orientation = "orthogonal";
        data.points = "";
        data.rotation = 0;
        data.to = info.to;
        data.spawn = info.spawn;
        data.type = "";
        data.x = 0;
        data.y = 0;
        data.z = 9;

        game.clavLevelEntity = me.pool.pull('clavLevelEntity', Number(data.x),
            Number(data.y), data);
        me.game.world.addChild(game.clavLevelEntity, 10);
    },

    /**
     * Teletransporta al PJ utilizando un levelEntity
     * @method travel_by_genericClavLevelEntity
     * @memberof game
     * @param {object} data
     */
    travel_by_genericClavLevelEntity: function (data) {
        parent.game.add_clavLevelEntity(data);
        game.clavLevelEntity.goTo(game.clavLevelEntity.to);
    },

    /**
     * Agrega al mapa otros jugadores
     * @method addOnlineOtherPlayer
     * @memberof game
     * @param {object} data -  datos para crear el otro jugador
     */
    addOnlineOtherPlayer: function (data) {
        game.players[data.id] = me.pool.pull('otherPlayer',
            Number(data.x),
            Number(data.y),
            {
                width: 32,
                height: 48,
                data: data
            }
        );
        me.game.world.addChild(game.players[data.id], 6);
    }
    ,

    /**
     * elimina todos los players del juego
     * @method remove_AllPlayers
     * @memberof game
     */
    remove_AllPlayers: function () {
        game.removeMainPlayer();
        game.removeEveryOtherPlayer();
        game.removeNPCs();
    }
    ,

    /**
     * elimina el mainPlayer del juego
     * @method removeMainPlayer
     * @memberof game
     */
    removeMainPlayer: function () {
        me.game.world.removeChild(game.mainPlayer);
        game.mainPlayer = {};
    }
    ,

    /**
     * elimina todos los otros jugadores del juego
     * @method removeEveryOtherPlayer
     * @memberof game
     */
    removeEveryOtherPlayer: function () {
        while (game.players.length) {
            game.removeOtherPlayer(game.player.pop().id);
        }
        game.players = {};
    }
    ,

    /**
     * elimina otro jugador particular segun el ID
     * @method removeOtherPlayer
     * @memberof game
     * @param {string} id - Identificador del servidor
     */
    removeOtherPlayer: function (id) {
        if (game.players[id]) {
            console.log('Removing player: ', id);
            me.game.world.removeChild(game.players[id]);
            delete game.players[id];
        }
    }
    ,

    /**
     * elimina todos los NPCs del mapa
     * @method removeNPCs
     * @memberof game
     */
    removeNPCs: function () {
        for (var npc in game.NPCs) {
            delete game.NPCs[npc];
        }
    },

    /**
     * actualiza los datos de los NPCs que estan en la lista
     * @method updateNPCs
     * @memberof game
     * @param {array} lista - Lista de los NPCs que
     */
    updateNPCs: function (lista) {

        var npcs_id = [];
        if (Object.prototype.toString.call(lista) === '[object Array]')
            npcs_id = lista;
        else
            for (var npc in game.NPCs)
                npcs_id.push(npc);

        for (var idx = 0; idx < npcs_id.length; idx++)
            game.NPCs[npcs_id[idx]].updateInfo();
    },

    /**
     * Clase que engloba la logica de las misiones
     * @class mision
     */
    mision: {
        misiontxt: '',
        npc: null,
        /**
         * Metodo que prepara el cuadro de dialogo de misiones y realiza el pedido
         * de los datos de la mision para el NPC con el que se hablo
         * @method startMision
         * @memberof mision
         * @param {string} npc - El ID de algun NPC
         */
        startMision: function (npc) {
            $("#mision_aceptar").hide();
            $("#mision_siguiente").hide();
            $("#mision_cancelar").hide();
            $("#mision_salir").hide();
            $("#mision_espera").show();
            $("#mision_txt").html('');
            $("#mision_npc").html(npc.data.nombre);

            this.npc = npc;
            io.socket.get('/api/misiones/gettxt?npc=' + npc.data.nombre,
                function (data) {
                    // Si no hay error,
                    if (!data.err) {
                        $("#mision").fadeIn(600);
                        $("#mision_espera").hide();
                        // Si hay pregunta, muestro boton de siguiente y cancelar
                        $("#mision_titulo").html(data.titulo);
                        if (data.pregunta) {
                            $("#mision_siguiente").show();
                            $("#mision_cancelar").show();
                            $("#mision_txt").html(data.pregunta);
                            if (data.mision)
                                game.mision.misiontxt = data.mision;

                        } else if (data.falta) {
                            $("#mision_cancelar").show();
                            $("#mision_txt").html(data.falta);

                        } else if (data.mision) {
                            $("#mision_cancelar").show();
                            if (data.mision.substring(0, 4) == "URL:") {

                                $("#mision_txt").html('' +
                                    '<iframe sandbox="allow-same-origin allow-forms allow-scripts" src="' +
                                    document.URL.replace(/game.*/i, "") +
                                    'data/minijuegos/' +
                                    data.mision.substring(4) +
                                    '"></iframe>');
                                $("#mision_cancelar").show();

                            } else {
                                $("#mision_txt").html(data.mision);
                                $("#mision_siguiente").show();
                            }
                        } else {
                            game.mision.siguiente(1);
                        }
                    } else {
                        $("#mision").hide();
                    }
                });


            // Doy de baja el evento de la tecla
            me.input.triggerKeyEvent(me.input.KEY.SPACE, false);
        },

        /**
         * Accion tomada si el usuario cancela la mision.
         * @method cancelar
         * @memberof mision
         */
        cancelar: function () {
            this.mision = '';
            this.npc = null;
            $("#mision").fadeOut(600, function () {
                game.mainPlayer.hablandoCon = '';
                me.input.unlockKey('accion');
            });
            // Doy de baja el evento de la tecla
            me.input.triggerKeyEvent(me.input.KEY.SPACE, false);
        },

        /**
         * Ejecuta el siguiente paso de la mision enviando al servidor el resultado obtenido,
         * segun el si es correcto o no se tomara la desicion de mostrar el mensaje de error
         * o el mensaje de felicitacion
         * @method siguiente
         * @memberof mision
         * @param {string} resultado - Resultado de la mision

         */
        siguiente: function (resultado) {
            $("#mision_aceptar").hide();
            $("#mision_siguiente").hide();
            $("#mision_cancelar").hide();
            $("#mision_salir").hide();
            $("#mision_txt").html('');
            if (this.misiontxt !== '') {
                if (this.misiontxt.substring(0, 4) == "URL:") {

                    $("#mision_txt").html('<iframe sandbox="allow-same-origin allow-forms allow-scripts" src="' +
                        document.URL.replace(/game.*/i, "") +
                        'data/minijuegos/' +
                        this.misiontxt.substring(4) +
                        '"></iframe>');

                } else {
                    $("#mision_txt").html(this.misiontxt);
                }
                this.misiontxt = '';
            } else {
                if (typeof resultado == "undefined")
                    resultado = 1;

                io.socket.get('/api/misiones/finish?npc=' + this.npc.data.nombre + '&resultado=' + resultado + '&claseActualID=' + game.claseActualId,
                    function (data) {
                        $("#mision_espera").hide();
                        if (typeof data.txt !== 'undefined' && data.txt !== '') {
                            $("#mision_salir").show();
                            $("#mision_txt").html(data.txt);
                        } else if (data.cerrar) {
                            game.mision.cancelar();
                        }
                        game.updateNPCs(data.npcs);
                        game.mainPlayer.updateData();
                        if (data.cerrar === false)
                            game.mision.startMision(game.mision.npc);
                    });
            }
            // Doy de baja el evento de la tecla
            me.input.triggerKeyEvent(me.input.KEY.SPACE, false);
        }
    },

    /**
     * Obtiene todas las clases pertenecientes al usuario actual
     * @method get_misClases
     * @memberof game
     */
    get_misClases: function () {
        io.socket.get('/api/clase/get_misClases', function (clases) {
            game.misClases = clases;
        });

    },

    /**
     * Obtiene la clase en la que esta actualmente el personaje
     * @method get_claseActual
     * @memberof game
     */
    get_claseActual: function () {
        io.socket.get('/api/mapa_instancia/' + game.mainPlayer.data.mapa_instancia.id + '/clase', function (clase) {
            game.claseActual = clase;
            game.claseActualId = clase.id;
        });

    }
}; // game
