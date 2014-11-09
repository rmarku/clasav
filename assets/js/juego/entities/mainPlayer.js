
// Jugador principal
game.PlayerEntity = game.Player.extend({
  init: function (x, y, settings) {
    this._super(game.Player, 'init', [ x, y, settings ]);
    this.id = settings.data.id;
    // Camara sigue al main player
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);
    game.server.subscribe_to_mapa_instance();
  },

  update: function(dt){

    // Interpretacion de teclas
    this.direccion = 0;
    if (me.input.isKeyPressed('left')) {
      this.body.vel.x -= this.body.accel.x * me.timer.tick;
      this.direccion |= 8;
    }
    if (me.input.isKeyPressed('right')) {
      this.body.vel.x += this.body.accel.x * me.timer.tick;
      this.direccion |= 4;
    }
    if (me.input.isKeyPressed('up')) {
      this.body.vel.y -= this.body.accel.y * me.timer.tick;
      this.direccion |= 2;
    }
    if (me.input.isKeyPressed('down')) {
      this.body.vel.y += this.body.accel.y * me.timer.tick;
      this.direccion |= 1;
    }

    this._super(game.Player, 'update', [ dt ]);

    game.server.update_mainplayer();
  }
});
