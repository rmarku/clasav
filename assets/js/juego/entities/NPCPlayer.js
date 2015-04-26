game.NPCPlayer = me.Entity.extend({
    /**
     * Description
     * @method init
     * @param {} x
     * @param {} y
     * @param {} settings
     * @return
     */
    init: function (x, y, settings) {
        var self = this;
        $.get('api/npcplayer?nombre=' + settings.nombre,
            function (data) {
                self.data = data[0];
                var sett = {
                    width: self.data.width,
                    height: self.data.height
                };
                self._super(me.Entity, 'init', [x, y, sett]);

                self.alwaysUpdate = false;
                self.body.gravity = 0;

                self.nombre();
                self.z = 6;
                // lo visto.
                self.renderable = new me.AnimationSheet(0, 0, {
                    "image": me.loader.getImage('npc/' + self.data.sprite + '.png'),
                    "spritewidth": self.data.width,
                    "spriteheight": self.data.height,
                    "framewidth": self.data.width,
                    "frameheight": self.data.height
                });

                self.body.collisionType = me.collision.types.NPC_OBJECT;

                var anim = [];
                for (var i = 0; i < self.data.animation; i++)
                    anim.push(i);

                self.renderable.addAnimation('always', anim, 100);
                self.renderable.setCurrentAnimation('always');

                self.updateInfo();


                self.anchorPoint.set(0.5, 0.5);

                // Mas grande el shape por si coliciona y precionan tecla, que salte el Quest.
                self.body.addShape(new me.Ellipse(0, self.body.width * -0.3, self.body.width * 2, self.body.height * 2));
                game.NPCs[self.data.id] = self;
            });
    },

    /**
     * Description
     * @method update
     * @param {} dt
     * @return
     */
    update: function (dt) {
        this._super(me.Entity, 'update', [dt]);
    },

    /**
     * Description
     * @method onCollision
     * @param {} response
     * @param {} other
     * @return Literal
     */
    onCollision: function (response, other) {
        if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            // Choque contra el mundo!
            return false;
        }
        // Make the object solid
        return true;
    },

    /**
     * Description
     * @method draw
     * @param {} renderer
     * @return
     */
    draw: function (renderer) {

        // Dibujo el personaje
        this._super(me.Entity, 'draw', [renderer]);

        //var context = renderer.getContext();
        // Dibujo el nombre
        renderer.drawImage(this.canvasNombre,
            ~~(this.pos.x - this.canvasNombre.width / 2),
            ~~(this.pos.y + 10));
    },

    /**
     * Description
     * @method nombre
     * @return
     */
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
    },


    updateInfo: function () {
        // Traigo datos del quest (si es visible en este momento o no)
        var self = this;
        console.log (this.data.nombre + ' update');
        return $.get('api/misiones/info?npc=' + this.data.nombre,
            function (data) {
                console.log (self.data.nombre + ' update Terminado');
                if (typeof data.npc_visible != 'undefined' && data.npc_visible === false)
                    self.isRenderable = false;
                else
                    self.isRenderable = true;
            });
    }
});
