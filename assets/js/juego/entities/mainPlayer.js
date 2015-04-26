// Jugador principal
game.PlayerEntity = game.Player.extend({
    /**
     * Description
     * @method init
     * @param {} x
     * @param {} y
     * @param {} settings
     * @return
     */
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);
        this.id = settings.data.id;
        // Camara sigue al main player
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        this.hablandoCon = '';

        if (settings.data.direccion == 1)
            this.animationToUseThisFrame = "run-down";
        if (settings.data.direccion == 2)
            this.animationToUseThisFrame = "run-up";
        if (settings.data.direccion == 4)
            this.animationToUseThisFrame = "run-right";
        if (settings.data.direccion == 8)
            this.animationToUseThisFrame = "run-left";

        this.direccion = 0;

        this.keys = {left: false, right: false, up: false, down: false};
        if (game.nextxy.x !== 0) {
            this.pos.x = game.nextxy.x;
            this.pos.y = game.nextxy.y;
            this.animationToUseThisFrame = game.nextxy.direction;
        }
        this.alwaysUpdate = true;
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
        if (other.body.collisionType === me.collision.types.NPC_OBJECT) {
            // Choque contra el mundo!
            if (me.input.isKeyPressed('accion') && this.hablandoCon != other.data.nombre && other.isRenderable) {
                this.hablandoCon = other.data.nombre;
                game.mision.startMision(other);
                console.log('Al lado de ' + other.data.nombre);
            }
            return false;
        }
        this.hablandoCon = '';
        // Make the object solid
        return true;
    },

    /**
     * Description
     * @method update
     * @param {} dt
     * @return
     */
    update: function (dt) {
        // Interpretacion de teclas
        //this.direccion = 0;
        if (me.input.keyStatus('left') != this.keys.left) {
            this.keys.left = me.input.keyStatus('left');
            if (this.keys.left)
                this.direccion |= 8;
            else
                this.direccion &= ~8;
        }
        if (me.input.keyStatus('right') != this.keys.right) {
            this.keys.right = me.input.keyStatus('right');
            if (this.keys.right)
                this.direccion |= 4;
            else
                this.direccion &= ~4;
        }
        if (me.input.keyStatus('up') != this.keys.up) {
            this.keys.up = me.input.keyStatus('up');
            if (this.keys.up)
                this.direccion |= 2;
            else
                this.direccion &= ~2;
        }
        if (me.input.keyStatus('down') != this.keys.down) {
            this.keys.down = me.input.keyStatus('down');
            if (this.keys.down)
                this.direccion |= 1;
            else
                this.direccion &= ~1;
        }
        me.collision.check(this);
        me.game.world.sort();

        server.update_myPlayer();
        // Dibujo en el minimapa
        minimap.drawPointsMinimap();
        return (this._super(game.Player, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    updateData: function () {
        // Traigo datos del quest (si es visible en este momento o no)
        var self = this;
        $.get('api/personaje/' + this.data.id,
            function (data) {
                game.mainPlayer.data = data;

                self.renderable = new me.AnimationSheet(0, 0, {
                    "image": self.vestir(),
                    "framewidth": 32,
                    "frameheight": 48,
                    "spritewidth": 32,
                    "spriteheight": 48
                });
                self.renderable.addAnimation('run-down', [0, 1, 2, 3], 100);
                self.renderable.addAnimation('run-left', [4, 5, 6, 7], 100);
                self.renderable.addAnimation('run-right', [8, 9, 10, 11], 100);
                self.renderable.addAnimation('run-up', [12, 13, 14, 15], 100);

                self.renderable.setCurrentAnimation(self.data.animation);

                hud.update();
            });
    }
});
