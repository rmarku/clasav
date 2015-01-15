/**
 *
 * Primeras pruebas
 */

var game = {
    mainPlayer: {},
    userId: 0,
    players: {},
    NPCs: {},
    items: {},
    sprites: {},

    nextxy: {x: 0, y: 0, direction: 0},

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
        me.audio.init("ogg");

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
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("NPCPlayer", game.NPCPlayer);
        me.pool.register("otherPlayer", game.OtherPlayer);
        me.pool.register("clavLevelEntity", game.clavLevelEntity);

        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.change(me.state.PLAY);         //Luego de esto se ejectuo play.js->onResetEvent()
    },

    change_level: function (target_mapa_generico) {
        //Guardo data para poder eliminar inmediatamente
        var data = game.mainPlayer.data;
        game.remove_AllPlayers();

        //Actualizo mi cambio de mapa_instancia en la BD, borrando mi suscripcion al Room anterior, suscribiendo al nuevo
        //Envio con socket para poder desuscribirlo
        io.socket.post('/api/mapa_instancia/change_level',
            {
                mapa_generico: target_mapa_generico,
                mapa_instancia: data.mapa_instancia.id,
                personajeId: data.id
            },
            function changeLevelCB(data) {
                game.addMainPlayer(data);
                game.create_OtherPlayers();
            });
    },


    create_OtherPlayers: function () {
        $.get('/api/personaje?mapa_instancia=' + game.mainPlayer.data.mapa_instancia.id + '&&masRecientementeUtilizado=true', function messageReceived(personajes) {

            while (personajes.length) {
                var personaje = personajes.pop();

                if (personaje.duenio.id != game.userId) {
                    game.addOnlineOtherPlayer(personaje);
                }
            }
        });
    },

    addMainPlayer: function (data) {
        game.mainPlayer = me.pool.pull('mainPlayer', Number(data.x),
            Number(data.y), {
                width: 28,
                height: 28,
                data: data
            });
        me.game.world.addChild(game.mainPlayer, 9);
        me.game.world.sort();
    },

    addOnlineOtherPlayer: function (data) {
        game.players[data.id] = me.pool.pull('otherPlayer',
            Number(data.x),
            Number(data.y),
            {
                width: 28,
                height: 28,
                data: data
            }
        );
        me.game.world.addChild(game.players[data.id], 9);
    },

    remove_AllPlayers: function () {
        game.removeMainPlayer();
        game.removeEveryOtherPlayer();
    },

    removeMainPlayer: function () {
        me.game.world.removeChild(game.mainPlayer);
        game.mainPlayer = {};
    },

    removeEveryOtherPlayer: function () {
        while (game.players.length) {
            game.removeOtherPlayer(game.player.pop().id);
        }
        game.players = {};
    },

    removeOtherPlayer: function (id) {
        if (game.players[id]) {
            console.log('Removing player: ', id);
            me.game.world.removeChild(game.players[id]);
            delete game.players[id];
        }
    }

}; // game
