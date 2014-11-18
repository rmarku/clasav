game.OtherPlayer = game.Player.extend({
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
        this.body.setFriction(0.3, 0.3);
        this.id = settings.data.id;
        this.direccion = settings.data.direccion;
        this.last_animation = "run-down";
        this.target_pos = {x: x, y: y};
    },

    update: function (dt) {
        /* A* example
         this.myPath = me.astar.search(this.pos.x,this.pos.y,366,349);
         console.log("path:");
         console.log(this.myPath);
         */
        //
        this.direccion = 0;
        if (Math.abs(this.pos.x - this.target_pos.x) > 5) {
            this.body.vel.x = (1.5 ^ (this.target_pos.x - this.pos.x) - 1);

        } else {
            this.body.vel.x /= 1.55;
        }

        if (Math.abs(this.pos.y - this.target_pos.y) > 5) {
            this.body.vel.y = (1.5 ^ (this.target_pos.y - this.pos.y) - 1);

        } else {
            this.body.vel.y  /= 1.55;
        }




        if (this.body.vel.length() > this.body.maxVel.x) {
            // Now calc actual vel to prevent speeding by going diag..
            this.body.vel.normalize();
            this.body.vel.scale(this.body.maxVel.x);
        }

        if (Math.abs(this.body.vel.x) < Math.abs(this.body.vel.y)) {
            if (this.body.vel.y > 0.0)
                this.animationToUseThisFrame = "run-down";
            if (this.body.vel.y < 0.0)
                this.animationToUseThisFrame = "run-up";
        } else {
            if (this.body.vel.x > 0.0)
                this.animationToUseThisFrame = "run-right";
            if (this.body.vel.x < 0.0)
                this.animationToUseThisFrame = "run-left";
        }
        if (this.body.vel.length() === 0) {
            this.renderable.setAnimationFrame();
            this.animationToUseThisFrame = this.last_animation;
        }

        if (this.lastAnimationUsed != this.animationToUseThisFrame) {
            this.lastAnimationUsed = this.animationToUseThisFrame;
            this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
        }
        this.body.update();

        if (this.body.vel.x !== 0 || this.body.vel.y !== 0 || (this.renderable && this.renderable.isFlickering())) {
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
        return false;

    }
});
