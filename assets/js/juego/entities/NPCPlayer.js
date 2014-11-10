game.NPCPlayer = game.Player.extend({
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
    },

    update: function (dt) {
        this._super(game.Player, 'update', [dt]);
    }
});
