/**
 *
 * Primeras pruebas
 */
var app = angular.module('juegoapl', ['ngSailsBind', 'toastr']);

app.config(['toastrConfig', function (toastrConfig) {
    angular.extend(toastrConfig, {
        allowHtml: true,
        closeButton: false,
        closeHtml: '<button>&times;</button>',
        containerId: 'toast-container',
        extendedTimeOut: 1000,
        iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        positionClass: 'toast-bottom-right',
        tapToDismiss: true,
        timeOut: 7000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });
}]);


var game = {
    mainPlayer: {},
    userId: 0,
    players: {},
    NPCs: {},
    items: {},
    sprites: {},

    nextxy: {x: 0, y: 0, direction: 0},


    start: function () {
        $.get("/api/user/getUser", function (data) {
            if (typeof data.userId == 'undefined') {
                window.location.href = '/';
                return;
            }
            $.get('/api/personaje/getPersonaje_masReciente', function (pj) {
                if (typeof pj.id == 'undefined') {
                    window.location.href = '/';
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
     * initialization
     * @return
     * @return
     * @method onload
     * @return
     */
    onload: function () {
        me.sys.fps = 30;
        me.sys.pauseOnBlur = false;
        me.sys.resumeOnFocus = false;
        me.sys.stopOnAudioError = false;
        //me.video.init("screen",32,32,!0,"auto",!0)


        if (me.device.isMobile) {
            me.sys.fps = 15;
            if (!me.video.init('game', me.video.AUTO, 480, 280, false, 'auto', true)) {
                alert("Perdon pero su Navegador no soporta canvas de HTML5.Instale Firefox o Google Chrome!");
                return;
            }
        } else {
            me.sys.fps = 30;
            if (!me.video.init('game', me.video.AUTO, 800, 480, false, 'auto', true)) {
                alert("Perdon pero su Navegador no soporta canvas de HTML5.Instale Firefox o Google Chrome!");
                return;
            }
        }

        if (document.location.hash === "#debug") {
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
            me.loader.preload(data);
            // Cargo todo y muestro pantalla de carga
            me.state.change(me.state.LOADING);
        });

        // Traigo todos los items
        $.get('/api/item/getItems', function (data) {
            data.forEach(function (item) {
                game.items[item.id] = item;
            });
        });

        // Traigo todos los sprites.
        $.get('/api/sprite/getSprites', function (data) {
            data.forEach(function (sprite) {
                game.sprites[sprite.id] = sprite;
            });
        });

    }

    ,

    /**
     * Llamo cuando todos los recursos estan cargados
     * @return
     * @return
     * @method loaded
     * @return
     */
    loaded: function () {
        // set the "Play/Ingame" Screen Object
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("NPCPlayer", game.NPCPlayer);
        me.pool.register("otherPlayer", game.OtherPlayer);
        me.pool.register("clavLevelEntity", game.clavLevelEntity);

        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.change(me.state.PLAY);         //Luego de esto se ejectuo play.js->onResetEvent()
    }
    ,

    /**
     * Description
     * @method change_level
     * @param {} target_mapa_generico
     * @return
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
                mapa_generico: target_mapa_generico,
                mapa_instancia: data.mapa_instancia.id,
                personajeId: data.id,
                change_level_new_x: game.nextxy.x,
                change_level_new_y: game.nextxy.y,
                change_level_new_animation: game.nextxy.direction
            },
            function changeLevelCB(data) {
                game.addMainPlayer(data);
                game.create_OtherPlayers();
            });
    }
    ,


    /**
     * Description
     * @method create_OtherPlayers
     * @return
     */
    create_OtherPlayers: function () {
        $.get('/api/personaje?mapa_instancia=' + game.mainPlayer.data.mapa_instancia.id + '&&masRecientementeUtilizado=true&&conectado=true', function messageReceived(personajes) {

            while (personajes.length) {
                var personaje = personajes.pop();

                if (personaje.duenio.id != game.userId) {
                    game.addOnlineOtherPlayer(personaje);
                }
            }
        });
    }
    ,

    /**
     * Description
     * @method addMainPlayer
     * @param {} data
     * @return
     */
    addMainPlayer: function (data) {
        game.mainPlayer = me.pool.pull('mainPlayer', Number(data.x),
            Number(data.y), {
                width: 32,
                height: 48,
                data: data
            });
        me.game.world.addChild(game.mainPlayer, 10);
        me.game.world.sort();
        hud.update();
    }
    ,

    /**
     * Description
     * @method addOnlineOtherPlayer
     * @param {} data
     * @return
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
        me.game.world.addChild(game.players[data.id], 10);
    }
    ,

    /**
     * Description
     * @method remove_AllPlayers
     * @return
     */
    remove_AllPlayers: function () {
        game.removeMainPlayer();
        game.removeEveryOtherPlayer();
        game.removeNPCs();
    }
    ,

    /**
     * Description
     * @method removeMainPlayer
     * @return
     */
    removeMainPlayer: function () {
        me.game.world.removeChild(game.mainPlayer);
        game.mainPlayer = {};
    }
    ,

    /**
     * Description
     * @method removeEveryOtherPlayer
     * @return
     */
    removeEveryOtherPlayer: function () {
        while (game.players.length) {
            game.removeOtherPlayer(game.player.pop().id);
        }
        game.players = {};
    }
    ,

    /**
     * Description
     * @method removeOtherPlayer
     * @param {} id
     * @return
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
     * Description
     * @method removeNPCs
     * @return
     */
    removeNPCs: function () {
        for (var npc in game.NPCs) {
            delete game.NPCs[npc];
        }
    }
    ,
    /**
     * Description
     * @method removeNPCs
     * @return
     */
    updateNPCs: function () {
        for (var npc in game.NPCs) {
            game.NPCs[npc].updateInfo();
        }
    }
    ,


    // Misiones
    mision: {
        misiontxt: '',
        npc: null,
        startMision: function (npc) {
            $("#mision_aceptar").hide();
            $("#mision_siguiente").hide();
            $("#mision_cancelar").hide();
            $("#mision_salir").hide();
            $("#mision_txt").html('');
            this.npc = npc;
            $.get('api/misiones/gettxt?npc=' + npc.data.nombre,
                function (data) {
                    // Si no hay error,
                    if (!data.err) {
                        // Si hay pregunta, muestro boton de siguiente y cancelar
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

                                $("#mision_txt").html('<iframe sandbox="allow-same-origin allow-forms allow-scripts" src="' +
                                document.URL.substring(0, document.URL.length - 4) +
                                'data/minijuegos/' +
                                data.mision.substring(4) +
                                '"></iframe>');

                            } else {
                                $("#mision_txt").html(data.mision);
                            }
                        }
                    } else {
                        $("#mision").hide();
                    }
                });

            $("#mision_npc").html(npc.data.nombre);
            $("#mision").fadeIn(600);

        }

        ,
        cancelar: function () {
            this.mision = '';
            this.npc = null;
            $("#mision").fadeOut(600, function () {
                game.mainPlayer.hablandoCon = '';
                me.input.unlockKey('accion');
            });
        }
        ,
        siguiente: function (resultado) {
            $("#mision_aceptar").hide();
            $("#mision_siguiente").hide();
            $("#mision_cancelar").hide();
            $("#mision_salir").hide();
            $("#mision_txt").html('');
            if (this.misiontxt !== '') {
                if (this.misiontxt.substring(0, 4) == "URL:") {

                    $("#mision_txt").html('<iframe sandbox="allow-same-origin allow-forms allow-scripts" src="' +
                    document.URL.substring(0, document.URL.length - 4) +
                    'data/minijuegos/' +
                    this.misiontxt.substring(4) +
                    '"></iframe>');

                } else {
                    $("#mision_txt").html(this.misiontxt);
                }
                this.misiontxt = '';
            } else {
                if (resultado)
                    resultado = 1;
                else
                    resultado = 0;

                $.get('api/misiones/finish?npc=' + this.npc.data.nombre + '&resultado=' + resultado,
                    function (data) {
                        if (typeof data.txt !== 'undefined' && data.txt !== '') {
                            $("#mision_salir").show();
                            $("#mision_txt").html(data.txt);
                        } else {
                            game.mision.cancelar();
                        }
                        game.updateNPCs();
                        game.mainPlayer.updateData();
                    });
            }
        }
    }

}; // game
