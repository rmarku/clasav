/**
 *
 * Primeras pruebas
 */

var game = {
    mainPlayer: {},
    players: [],
    playersOffline:[],
    NPCs: [],
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

        // Plugin: AStar pathfinding
        me.plugin.register(aStarPlugin, "astar");

        me.audio.init('ogg,mp3');
        me.sys.pauseOnBlur=false;

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

        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.change(me.state.PLAY);         //Luego de esto se ejectuo play.js->onResetEvent()
    },

    init_otherPlayers:function() {
        game.create_otherPlayers();
        server.join_mapa_instancia();
        server.listen_events();
    },

    create_otherPlayers: function () {

        $.get('/api/personaje?where={"mapa_instancia":"' + game.mainPlayer.data.mapa_instancia + '"',function messageReceived(personajes) {
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

    saveOnlineOtherPlayer: function (data){
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

    saveOfflineOtherPlayer: function (data){
        game.playersOffline[data.id] = me.pool.pull('otherPlayer',
            Number(data.x),
            Number(data.y),
            {
                width: 28,
                height: 28,
                data: data
            }
        );
    },
    removeOtherPlayer: function(id){
        console.log('Removing player: ', data.id);
        var player = game.players[id];
        me.game.world.removeChild(player);
        delete game.players[id];
    },

    removeOfflineOtherPlayer: function(id){
        console.log('Removing player: ', data.id);
        var player = game.playersOffline[id];
        delete game.playersOffline[id];
    }

}; // game
