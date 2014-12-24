game.PlayScreen = me.ScreenObject.extend({

    /**
     * action to perform on state change
     * @return
     * @method onResetEvent
     * @return
     */
    onResetEvent: function () {
        // load a level

        // subscribe to key down event
        me.audio.playTrack("snow", 0.7);
        me.audio.muteAll();

        //me.input.preventDefault();
        me.input.bindKey(me.input.KEY.LEFT, 'left');
        me.input.bindKey(me.input.KEY.A, 'left');
        me.input.bindKey(me.input.KEY.RIGHT, 'right');
        me.input.bindKey(me.input.KEY.D, 'right');
        me.input.bindKey(me.input.KEY.UP, 'up');
        me.input.bindKey(me.input.KEY.W, 'up');
        me.input.bindKey(me.input.KEY.DOWN, 'down');
        me.input.bindKey(me.input.KEY.S, 'down');


        $.get('/api/user/getUser', function (user) {
            if (typeof user.userId!= 'undefined') {
                game.userId = user.userId;

                $.get('/api/personaje/getPersonaje_masReciente',{duenio: game.userId}, function messageReceived(data) {

                    me.levelDirector.loadLevel(data.mapa_instancia.mapa_generico.nombre);
                    game.addMainPlayer(data);
                        game.create_OtherPlayers();

                            server.listen_events();

                    server.join_mapa_instancia();
                    me.event.subscribe(me.event.LEVEL_LOADED, game.change_level);
                });

/*
              game.NPCs[1] = me.pool.pull('NPCPlayer', Number(36*32),
                Number(12*32), {
                  width: 28,
                  height: 28,
                  data: data
                });
              me.game.world.addChild(game.NPCs[1], 9);
                game.NPCs[2] = me.pool.pull('NPCPlayer', Number(35*32),
                    Number(21*32), {
                        width: 28,
                        height: 28,
                        data: data
                    });
                me.game.world.addChild(game.NPCs[2], 9);
              game.players[1] = me.pool.pull('otherPlayer', Number(8*32),
                    Number(15*32), {
                        width: 28,
                        height: 28,
                        data: data
                    });
*/
            } else {
                console.log("No existe el usuario");
            }
        });
    },

    /**
     * action to perform when leaving this screen (state change)
     * @return
     * @method onDestroyEvent
     * @return
     */
    onDestroyEvent: function () {
        me.audio.stopTrack("snow");
    }
});
