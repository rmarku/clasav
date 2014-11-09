
// Jugador principal
game.PlayerEntity = game.Player.extend({
  init: function (x, y, settings) {
    this._super(game.Player, 'init', [ x, y, settings ]);

    // Camara sigue al main player
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);
  },

  update: function(dt){

    // Interpretacion de teclas
    [{dire: 'left',eje:'x',dir:-1},
      {dire: 'right',eje:'x',dir:1},
      {dire: 'down',eje:'y',dir:1},
      {dire: 'up',eje:'y',dir:-1}].forEach(function(mov){
        if (me.input.isKeyPressed(mov.dire)) {
          this.body.vel[mov.eje] = mov.dir * this.body.accel[mov.eje] * me.timer.tick;

          // Almaceno estado actual de mi Personaje Principal
          game.sockets_game.update_mainPlayer_estado(mov.dire, true);
        } else {
          // Almaceno estado actual de mi Personaje Principal
          game.sockets_game.update_mainPlayer_estado(mov.dire, false);
        }
      },this);
    this._super(game.Player, 'update', [ dt ]);
  }
});
