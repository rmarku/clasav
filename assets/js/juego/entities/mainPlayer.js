// Jugador principal
game.PlayerEntity = game.Player.extend({
  init: function (x, y, settings) {
    this._super(game.Player, 'init', [x, y, settings]);
    this.id = settings.data.id;
    // Camara sigue al main player
    me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);
    this.direccion = settings.data.direccion;

    this.keys = {left: false, right: false, up: false, down: false};
  },

  update: function (dt) {

    // Interpretacion de teclas
    //this.direccion = 0;
    if (me.input.keyStatus('left') != this.keys.left) {
      this.keys.left = me.input.keyStatus('left') ;
      if(this.keys.left)
        this.direccion |= 8;
      else
        this.direccion &= ~8;
    }
    if (me.input.keyStatus('right') != this.keys.right) {
      this.keys.right = me.input.keyStatus('right') ;
      if(this.keys.right)
        this.direccion |= 4;
      else
        this.direccion &= ~4;
    }
    if (me.input.keyStatus('up') != this.keys.up) {
      this.keys.up = me.input.keyStatus('up') ;
      if(this.keys.up)
        this.direccion |= 2;
      else
        this.direccion &= ~2;
    }
    if (me.input.keyStatus('down') != this.keys.down) {
      this.keys.down = me.input.keyStatus('down') ;
      if(this.keys.down)
        this.direccion |= 1;
      else
        this.direccion &= ~1;
    }

    this._super(game.Player, 'update', [dt]);

    game.server.update_mainplayer();
  }
});
