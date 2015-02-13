game.NPCPlayer = me.Entity.extend({
    init: function (x, y, settings) {
        var self = this;
        $.get('api/npc-player?nombre=' + settings.nombre,
            function (data) {
                self._super(me.Entity, 'init', [x, y, settings]);
                self.data = data[0];
                self.alwaysUpdate = false;
                self.body.gravity = 0;

                self.nombre();

                // lo visto.
                self.renderable = new me.AnimationSheet(0, 0, {
                    "image": me.loader.getImage('npc/' + self.data.sprite + '.png'),
                    "spritewidth": self.data.width,
                    "spriteheight": self.data.height
                });

                self.body.collisionType = me.collision.types.NPC_OBJECT;

                var anim = [];
                for (var i = 0; i < self.data.animation; i++)
                    anim.push(i);

                self.renderable.addAnimation('always', anim, 100);
                self.renderable.setCurrentAnimation('always');

                self.anchorPoint.set(0.5, 1);

                // Mas grande el shape por si coliciona y precionan tecla, que salte el Quest.
                self.body.addShape(new me.Rect(0, 0, self.data.height, self.data.width));
                game.NPCs[self.data.id] = self;
            });
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
            ~~(this.pos.x - this.canvasNombre.width / 2 + this.width / 2),
            ~~(this.pos.y + this.height + 5));
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
        ctx.fillStyle = '#ff0';
        ctx.strokeStyle = "#000";
        ctx.font = '11px "Short Stack" ';
        ctx.textBaseline = 'top';

        var txtw = ctx.measureText(this.data.nombre.trimRight()).width;

        ctx.strokeText(this.data.nombre, width / 2 - txtw / 2, 3);
        ctx.fillText(this.data.nombre, width / 2 - txtw / 2, 3);
    }
});
