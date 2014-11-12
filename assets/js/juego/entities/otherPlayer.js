game.OtherPlayer = game.Player.extend({
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
        this.id = settings.data.id;
        this.direccion = settings.data.direccion;
    },

    update: function (dt) {
        //this._super(game.Player, 'update', [dt]);
        if (this.direccion & 1)
            this.animationToUseThisFrame = "run-down";
        else if (this.direccion & 2)
            this.animationToUseThisFrame = "run-up";
        else if (this.direccion & 4)
            this.animationToUseThisFrame = "run-right";
        else if (this.direccion & 8)
            this.animationToUseThisFrame = "run-left";


        if (this.lastAnimationUsed != this.animationToUseThisFrame) {
            this.lastAnimationUsed = this.animationToUseThisFrame;
            this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
        }
        this.body.update();

        if (this.direccion != 0) {
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
        return false;
    }
});
