/**
 * 
 * Primeras pruebas
 */

var game = {
	mainPlayer : {},
	players : {},
	NPCs : {},
	players : {},

	/**
	 * initlization
	 */
	onload : function() {
		me.sys.fps = 60;
		if (!me.video.init('jsapp', me.video.CANVAS, 800,480 )) {
			alert("Perdon pero su Navegador no soporta canvas de HTML5.Instale Firefox o Google Chrome!");
			return;
		}

		me.plugin.register(debugPanel, "debug");
		me.audio.init('ogg,mp3');
		// set all ressources to be loaded
		me.loader.onload = this.loaded.bind(this);

		// Cargo los recursos desde la API
		$.getJSON("api/resources.json", function(data) {
			me.loader.preload(data);
			// Cargo todo y muestro pantalla de carga
			me.state.change(me.state.LOADING);
		});

	},

	/**
	 * Llamo cuando todos los recursos estan cargado
	 */
	loaded : function() {
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new game.PlayScreen());
		
		me.pool.register("mainPlayer", game.PlayerEntity);
		
		me.state.change(me.state.PLAY);

		
	},

}; // game

// bootstrap :)
window.onReady(function() {
	game.onload();
});
