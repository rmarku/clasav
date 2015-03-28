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

        this._super(game.Player, 'update', [dt]);
        me.game.world.sort();
        server.update_myPlayer();
        // Dibujo en el minimapa
        drawPointsMinimap();
    },
    /**
     * Description
     * @method draw
     * @param {} renderer
     * @return
     */
    draw: function (renderer) {
        //var context = renderer.getContext();
        this._super(game.Player, 'draw', [renderer]);

        renderer.fillStyle = 'blue';
        renderer.fillRect(this.pos.x - 1, this.pos.y - 1, 2, 2);

        //renderer.fillStyle = 'blue';
        //var x, y;
        //for (x = 0; x < me.astar.grid.length; x++) {
        //    for (y = 0; y < me.astar.grid[x].length; y++) {
        //        if (me.astar.grid[x][y].type == 0)
        //            renderer.fillRect(x * me.astar.tw, y *me.astar.th, 5, 5);
        //    }
        //}
    }
});
