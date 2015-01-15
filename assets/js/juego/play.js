game.PlayScreen = me.ScreenObject.extend({

    /**
     * action to perform on state change
     * @return
     * @method onResetEvent
     * @return
     */
    onResetEvent: function () {
        // load a level
        me.levelDirector.loadLevel("Inicio");
        // subscribe to key down event
        //me.audio.playTrack("snow", 0.7);
        //me.audio.muteAll();


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
            if (typeof user.userId != 'undefined') {

                $.get('/api/personaje?where={"duenio":"' + user.userId + '","masRecientementeUtilizado":true}', function CB(datos) {
                    if (datos.length == 1) {
                        data = datos[0];
                        game.mainPlayer = me.pool.pull('mainPlayer', Number(data.x),
                            Number(data.y), {
                                width: 28,
                                height: 28,
                                data: data
                            });
                        me.game.world.addChild(game.mainPlayer, 9);
                        game.players[data.id] = game.mainPlayer;         //Se agrega a ala bolsa donde se van update

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
                        me.game.world.sort();

                        //Nos Unimos al Mapa, pasando nuestro personaje a Conectado, y lo hacemos disponible a otros Users
                        server.join_mapa_instancia();
                        game.init_otherPlayers();



                    } else {
                        console.log("No existe el personaje");
                    }
                    // start the game
                });
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
