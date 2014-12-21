/**
 *
 * Primeras pruebas
 */

var game = {
    mainPlayer: {},
    players: {},
    playersOffline: {},
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

        me.plugin.register(me.debug.Panel, "debug");

        // Plugin: AStar pathfinding
        me.plugin.register(aStarPlugin, "astar");

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        me.sys.pauseOnBlur = false;

        // funcion a llamar cuando todos los recursos esten cargados
        me.loader.onload = this.loaded.bind(this);

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

    },

    /**
     * Llamo cuando todos los recursos estan cargados
     * @return
     * @method loaded
     * @return
     */
    loaded: function () {
        // set the "Play/Ingame" Screen Object
        me.pool.register("mainPlayer"   , game.PlayerEntity);
        me.pool.register("NPCPlayer"    , game.NPCPlayer);
        me.pool.register("otherPlayer"  , game.OtherPlayer);

        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.change(me.state.PLAY);         //Luego de esto se ejectuo play.js->onResetEvent()
    },

    change_level: function(nuevo_mapa_generico){

        //Guardo data de mi user para no tener que solicitarla
        var data = game.mainPlayer.data;
        me.game.world.removeChild(game.mainPlayer);
        game.mainPlayer = {};
        //Borro los datos de los Jugadores
        game.removeEveryOtherPlayer();

        //Actualizo mi cambio de mapa_instancia en la BD, borrando mi suscripcion al Room anterior, suscribiendo al nuevo
        io.socket.post('/api/mapa_instancia/change_level',
            {
                mapa_generico: nuevo_mapa_generico,
                mapa_instancia: data.mapa_instancia.id,
                personajeId: data.id
            },
            function changeLevelCB(nuevo_mapa_instancia) {

                data.x = nuevo_mapa_instancia.mapa_generico.posicion_inicial_x;
                data.y = nuevo_mapa_instancia.mapa_generico.posicion_inicial_y;

                game.saveMainPlayer(data);
                //Guardio el mapa_instancia al cual pertenece el mapa_generico que me indico el evento CHANGE-lEVEL
                game.mainPlayer.data.mapa_instancia = nuevo_mapa_instancia;

                me.game.world.addChild(game.mainPlayer, 9);
                me.game.world.sort();

                game.create_otherPlayers();
            });
    },

    init_otherPlayers: function () {
        game.create_otherPlayers();
        server.listen_events();
    },

    create_otherPlayers: function () {

        $.get('/api/personaje?mapa_instancia=' + game.mainPlayer.data.mapa_instancia.id + '&&masRecientementeUtilizado=true', function messageReceived(personajes) {
            while (personajes.length) {

                var personaje = personajes.pop();
                if (personaje.id != game.mainPlayer.id) {
                    if (personaje.conectado === true) {
                        game.saveOnlineOtherPlayer(personaje);
                        me.game.world.addChild(game.players[personaje.id], 9);
                    }
                    else {
                        game.saveOfflineOtherPlayer(personaje);
                    }
                }
            }
        });

    },

    get_otherPlayers: function (pjid) {

        $.get('/api/personaje/' + pjid, function messageReceived(personaje) {
            if (personaje) {

                if (personaje.conectado === true) {
                    game.saveOnlineOtherPlayer(personaje);
                    me.game.world.addChild(game.players[personaje.id], 9);
                }
                else {
                    game.saveOfflineOtherPlayer(personaje);
                }
            }
        });
    },

    saveMainPlayer: function (data) {
        game.mainPlayer = me.pool.pull('mainPlayer', Number(data.x),
            Number(data.y), {
                width: 28,
                height: 28,
                data: data
            });
        game.players[data.id] = game.mainPlayer;
    },

    saveOnlineOtherPlayer: function (data) {
        game.players[data.id] = me.pool.pull('otherPlayer',
            Number(data.x),
            Number(data.y),
            {
                width: 28,
                height: 28,
                data: data
            }
        );
    },
    saveOfflineOtherPlayer: function (data) {
        game.playersOffline[data.id] = data;
    },

    removeOtherPlayer: function (id) {
        if (game.players[id]) {
            console.log('Removing player: ', id);

            game.playersOffline[id] = game.players[id].data;

            me.game.world.removeChild(game.players[id]);
            delete game.players[id];
        }
    },

    removeEveryOtherPlayer: function(){
        while(game.players.length){
            game.removeOtherPlayer(game.player.pop().id);
        }
        game.players = {};
        game.playersOffline = {};
    },

    removeOfflineOtherPlayer: function (id) {
        console.log('Removing player: ', id);
        var player = game.playersOffline[id];
        delete game.playersOffline[id];
    },


    create_otherPlayer: function (id) {
        console.log('Adding player: ', id);

        if(game.players[id]){
            return;
        }


        if (game.playersOffline[id]) {
            game.saveOnlineOtherPlayer(game.playersOffline[id]);
            game.removeOfflineOtherPlayer(id);

            me.game.world.addChild(game.players[id], 9);
        }
        else {
            this.get_otherPlayers(id);
        }
    }

}; // game
