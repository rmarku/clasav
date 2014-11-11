game.OtherPlayer = game.Player.extend({
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
        this.id = settings.data.id;
         this.direccion = settings.data.direccion;
    },

    update: function (dt) {
        this._super(game.Player, 'update', [dt]);
    }
});
