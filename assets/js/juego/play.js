game.PlayScreen = me.ScreenObject.extend({

    /**
     * action to perform on state change
     * @method onResetEvent
     * @return
     */
    onResetEvent: function () {
        // load a level
        me.levelDirector.loadLevel("mapa");
        // subscribe to key down event
        me.audio.playTrack("snow", 0.7);
        me.audio.muteAll();


        io.socket.get('/api/user/getUser', function (user) {
            if (typeof user.userId != 'undefined') {

                io.socket.get('/api/personaje?where={"duenio":"' + user.userId + '"}', function (datos) {
                    if (datos.length == 1) {
                        data = datos[0];
                        game.mainPlayer = me.pool.pull('mainPlayer', Number(data.x),
                            Number(data.y), {
                                image: data.duenio.sexo + '/basic/1f.png',
                                spritewidth: 32,
                                spriteheight: 48,
                                width: 28,
                                height: 28,
                                data: data
                            });
                        me.game.world.addChild(game.mainPlayer, 10);
                        game.players[data.id] = game.mainPlayer;         //Se agrega a ala bolsa donde se van update
                        me.game.world.sort();

                    }
                    // start the game
                });
            } else {

            }
        });
    },

    /**
     * action to perform when leaving this screen (state change)
     * @method onDestroyEvent
     * @return
     */
    onDestroyEvent: function () {
        me.audio.stopTrack("snow");
    }
});
