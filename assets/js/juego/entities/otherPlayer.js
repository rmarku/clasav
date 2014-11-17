game.OtherPlayer = game.Player.extend({
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
        this.body.setFriction(0.5, 0.5);
        this.id = settings.data.id;
        this.direccion = settings.data.direccion;
    },

    update: function (dt) {
        this.direccion = 0;

        if (this.pos.distance(this.target_pos) > 1) {
            var direction = this.pos.clone();
            var angule_radians = direction.sub(this.target_pos).angle(new me.Vector2d(1, 0));

            //Left
            if (Math.abs(angule_radians) > Math.PI/2)
                this.direccion |= 8;
            else
                this.direccion |= 4;

            //Up
            if (angule_radians > 0)
                this.direccion |= 1;
            else
                this.direccion |= 2;
        }
        this._super(game.Player, 'update', [dt]);
    }
});
