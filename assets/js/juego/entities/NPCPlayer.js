game.NPCPlayer = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.data = settings.data;

        this.alwaysUpdate = false;

        this.body.setVelocity(5.2, 5.2);
        this.body.setFriction(0.5, 0.5);
        this.body.gravity = 0;
        this.nombre();


        this.renderable.addAnimation('run-down', [0, 1, 2, 3], 100);
        this.renderable.addAnimation('run-left', [4, 5, 6, 7], 100);
        this.renderable.addAnimation('run-right', [8, 9, 10, 11], 100);
        this.renderable.addAnimation('run-up', [12, 13, 14, 15], 100);

        this.renderable.setCurrentAnimation('run-down');
        this.animationToUseThisFrame = 'run-down';
        this.lastAnimationUsed = 'run-down';

        this.anchorPoint.set(0.5, 1);

        // Mas grande el shape por si coliciona y precionan tecla, que salte el Quest.
        this.body.addShape(new me.Ellipse(0, 0, this.body.width * 1.6, this.body.width * 1.6));

    },

    update: function (dt) {
        this._super(me.Entity, 'update', [dt]);
    },

    onCollision: function (response, other) {
        if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            // Choque contra el mundo!
            return false;
        }
        // Make the object solid
        return true;
    },

    draw: function (renderer) {

        // Dibujo el personaje
        this._super(me.Entity, 'draw', [renderer]);

        //var context = renderer.getContext();
        // Dibujo el nombre
        renderer.drawImage(this.canvasNombre,
            ~~(this.pos.x - this.canvasNombre.width / 2),
            ~~(this.pos.y + this.height / 2),
            32 * 4,
            30);
    },

    nombre: function () {
        var width = 32 * 4;
        var height = 30;
        this.canvasNombre = document.createElement('canvas');
        this.canvasNombre.width = width;
        this.canvasNombre.height = height;
        var ctx = this.canvasNombre.getContext("2d");

        //Dibujo el nombre

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = "#000";
        ctx.font = '11px "Short Stack" ';
        ctx.textBaseline = 'top';

        var txtw = ctx.measureText(this.data.nombre.trimRight()).width;

        ctx.strokeText(this.data.nombre, width / 2 - txtw / 2, 3);
        ctx.fillText(this.data.nombre, width / 2 - txtw / 2, 3);
    }
});
