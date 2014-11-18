game.OtherPlayer = game.Player.extend({
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
        this.body.setFriction(0.5, 0.5);
        this.id = settings.data.id;
        this.direccion = settings.data.direccion;
        this.target_pos = {x:x,y:y};
    },

    update: function (dt) {
/* A* example
        this.myPath = me.astar.search(this.pos.x,this.pos.y,366,349);
        console.log("path:");
        console.log(this.myPath);
*/
        //
        this.direccion = 0;

        if (this.pos.distance(this.target_pos) > 1) {

            var direction = this.pos.clone();
            var angule_radians = direction.sub(this.target_pos).angle(new me.Vector2d(1, 0));

            //Left
            if (Math.abs(angule_radians) > Math.PI/2){
                if (this.pos.distance(this.target_pos) >= 20)
                    this.body.vel.x -= this.body.accel.x * dt / 200;
                else
                    this.body.vel.x += this.body.vel.x*.1;
            }
            //Right
            else{
                if (this.pos.distance(this.target_pos) >= 20)
                    this.body.vel.x += this.body.accel.x * dt / 200;
                else
                    this.body.vel.x -= this.body.vel.x*.1;
            }
            //Up
            if (angule_radians > 0){
                if (this.pos.distance(this.target_pos) >= 20)
                    this.body.vel.y += this.body.accel.y * dt / 200;
                else
                    this.body.vel.y -= this.body.vel.y*.1;
            }
            //Down
            else{
                if (this.pos.distance(this.target_pos) >= 20)
                    this.body.vel.y -= this.body.accel.y * dt / 200;
                else
                    this.body.vel.y += this.body.vel.y*.1;
            }

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
