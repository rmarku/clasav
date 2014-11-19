game.OtherPlayer = game.Player.extend({
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
        this.body.setFriction(0, 0);
        this.id = settings.data.id;
        this.direccion = settings.data.direccion;
        this.last_animation = "run-down";
        this.target_pos = {x: x, y: y};
    },

    update: function (dt) {
        // Si existe nuevo target
        if (this.newTarget) {
            this.pathIsRunning = false;
            this.newTarget = false;
            this.myPath = [];

            //Si esta suficientemente lejos, calcular path, sino se actua normalemnte con el target_pos enviado por el servidor
            if (Math.abs(this.pos.x - this.target_pos.x) > me.game.collisionMap.tilewidth ||
                Math.abs(this.pos.y - this.target_pos.y) > me.game.collisionMap.tileheight) {
                me.astar.init();
                this.myPath = me.astar.search(this.pos.x, this.pos.y, this.target_pos.x, this.target_pos.y);
                this.myPath[0].pos = this.target_pos; // al ultimo objetivo le pongo la target_pos original para tener precision
                this.target_pos = this.myPath.pop().pos;
                this.target_pos.x += 4;
                this.target_pos.y += 7;

                this.pathIsRunning = true;
            }
        }

        //  Si hay targets pendientes de myPath && Si ya me acerque lo suficiente al target actual de myPath, setear nuevo target
        if (this.myPath.length > 0 && (this.pos.distance(this.target_pos) < 2)) {
            this.target_pos = this.myPath.pop().pos;
            this.target_pos.x += 4;
            this.target_pos.y += 7;
        }
        else // Si termino el Path, y todavia sigo lejos del objetivo, setearlo nuevamente
        if (this.pathIsRunning &&
            this.myPath.length === 0 &&
            (Math.abs(this.pos.x - this.target_pos.x) > 5) &&
            (Math.abs(this.pos.y - this.target_pos.y) > 5)) {

            this.target_pos = this.original_target_pos;
            this.newTarget = true;
            return false;
        }

        // Actuar Normalmente con target_pos actual
        this.direccion = 0;
        this.body.vel.x = Math.pow((this.target_pos.x - this.pos.x), 3) / 25;
        this.body.vel.y = Math.pow((this.target_pos.y - this.pos.y), 3) / 25;

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
        if (this.body.vel.length() < 0.1) {
            this.body.vel.setZero();
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

    },
    draw: function (renderer) {
        var context = renderer.getContext();
        this._super(me.Entity, 'draw', [renderer]);

        for (var i = 0; i < this.myPath.length; i++) {
            context.fillStyle = 'white';
            context.fillRect(this.myPath[i].pos.x + 16 - 5, this.myPath[i].pos.y + 16 - 5, 10, 10);
            context.fillStyle = 'red';
            context.fillRect(this.myPath[i].pos.x + 16, this.myPath[i].pos.y + 16, 1, 1);
        }
        context.fillStyle = 'blue';
        context.fillRect(this.pos.x + 12, this.pos.y + 7, 2, 2);
    }
});
