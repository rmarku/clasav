game.PlayScreen = me.ScreenObject.extend({

	/**
	 * action to perform on state change
	 * @method onResetEvent
	 * @return 
	 */
	onResetEvent : function() {
		// load a level
		me.levelDirector.loadLevel("mapa");
		// subscribe to key down event
		me.audio.playTrack("snow", 0.7);

		$.getJSON("api/player.json", function(data) {
			game.mainPlayer = me.pool.pull('mainPlayer', Number(data.x),
					Number(data.y), {
						image : data.data.tipo,
						spritewidth : 32,
						spriteheight : 48,
						width : 30,
						height : 30,
						id : data.id,
						data : data.data
					});
			me.game.world.addChild(game.mainPlayer, 10);
			game.players[data.id] = game.mainPlayer;         //Se agrega a ala bolsa donde se van update
			me.game.world.sort();

			// start the game

		});
	},

	/**
	 * action to perform when leaving this screen (state change)
	 * @method onDestroyEvent
	 * @return 
	 */
	onDestroyEvent : function() {
		me.audio.stopTrack("snow");
	}
});
