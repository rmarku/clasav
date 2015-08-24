
/**
 * Clase del personaje principal del juego
 * @class PlayerEntity
 */
game.PlayerEntity = game.Player.extend({
    /**
     * Constructor que inicializa al personaje
     * @method init
     * @param {integer} x - x inicial del jugador en el mapa
     * @param {integer} y - y inicial del jugador en el mapa
     * @param {object} settings - Configuración del jugador
     * @memberof PlayerEntity
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
        if (this.data.duenio.inscripto === false) {
            toastr.warning('<span><b style="color: #aa0000;">No estas en ninguna clase, no puedes hablar por chat<br>' +
                'Para poder chatear y explorar el juego, solicita una clase en' +
                ' <a href="http://localhost:1337/#/clasesAlumno">Mis Clases</a> </span><br>');
        }
       // hud.personaje.update();
    },

    /**
     * Este método es llamado cuando se detecta una colisión con otra entidad
     * @method onCollision
     * @param {object} response
     * @param {object} other
     * @memberof PlayerEntity
     * @return Boolean
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
            }
            return false;
        }
        this.hablandoCon = '';
        // Make the object solid
        return true;
    },

    /**
     * Llamada antes de cada frame por Melon, aqui se deben actualizar
     * los valores del personaje para luego dibujarlo como corresponde
     * @method update
     * @param {integer} dt
     * @memberof PlayerEntity
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
        var ret = this._super(game.Player, 'update', [dt]);
        me.collision.check(this);
        me.game.world.sort();

        server.update_myPlayer();
        // Dibujo en el minimapa
        minimap.drawPointsMinimap();
        return ( ret);
    },
    /**
     * Dibuja esta entidad en el canvas del juego
     * @method draw
     * @param {object} renderer
     * @memberof PlayerEntity
     */
    draw: function (renderer) {

        this._super(game.Player, 'draw', [renderer]);
        if (game.debug) {
            renderer.fillStyle = 'blue';
            var x, y;

            for (y = 0; y < me.astar.grid.length; y++) {
                for (x = 0; x < me.astar.grid.length; x++) {
                    if (me.astar.grid[y][x] === 1)
                        renderer.fillRect(x * me.astar.tw + 12, y * me.astar.th + 12, 8, 8);

                }
            }
        }
    }
});
