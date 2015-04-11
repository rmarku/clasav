game.PlayScreen = me.ScreenObject.extend({

    /**
     * action to perform on state change
     * @return
     * @return
     * @method onResetEvent
     * @return
     */
    onResetEvent: function () {
        // load a level

        // subscribe to key down event

        //me.input.preventDefault();
        me.input.bindKey(me.input.KEY.LEFT, 'left');
        me.input.bindKey(me.input.KEY.A, 'left');
        me.input.bindKey(me.input.KEY.RIGHT, 'right');
        me.input.bindKey(me.input.KEY.D, 'right');
        me.input.bindKey(me.input.KEY.UP, 'up');
        me.input.bindKey(me.input.KEY.W, 'up');
        me.input.bindKey(me.input.KEY.DOWN, 'down');
        me.input.bindKey(me.input.KEY.S, 'down');
        me.input.bindKey(me.input.KEY.SPACE, 'accion', true);
        me.input.bindKey(me.input.KEY.M, 'accion', true);

        $.get('/api/user/getUser', function (user) {
            if (typeof user.userId != 'undefined') {
                game.userId = user.userId;

                $.get('/api/personaje/getPersonaje_masReciente', {duenio: game.userId}, function messageReceived(data) {

                    me.levelDirector.loadLevel(data.mapa_instancia.mapa_generico.nombre);
                    game.addMainPlayer(data);
                    game.create_OtherPlayers();
                    game.get_misClases();
                    game.get_claseActual();
                    server.listen_events();
                    server.join_mapa_instancia();
                    var map = me.game.currentLevel;

                    minimap.updateMap(map.cols * map.tilewidth, map.cols * map.tilewidth, map.name);
                    //me.event.subscribe(me.event.LEVEL_LOADED, game.change_level);
                });
            } else {
                console.log("No existe el usuario");
            }
        });
    },

    /**
     * action to perform when leaving this screen (state change)
     * @return
     * @return
     * @method onDestroyEvent
     * @return
     */
    onDestroyEvent: function () {
        me.audio.stopTrack("snow");
    }
});
