
/**
 * Clase de los personajes de otros jugadores que estan en el juego
 * @class OtherPlayer
 */
game.OtherPlayer = game.Player.extend({

    /**
     * Constructor que inicializa al personaje
     * @method init
     * @param {integer} x - x inicial del jugador en el mapa
     * @param {integer} y - y inicial del jugador en el mapa
     * @param {object} settings - Configuración del jugador
     * @memberof OtherPlayer
     */
    init: function (x, y, settings) {
        this._super(game.Player, 'init', [x, y, settings]);

        this.body.setVelocity(9.3, 9.3);
        this.body.setFriction(0, 0);
        this.id = settings.data.id;
        this.direccion = settings.data.direccion;
        this.last_animation = settings.data.animation;
        this.myPath = [];
        this.alwaysUpdate = true;
    },

    /**
     * Evalua si debo traer el proximo nodo del PathFinder
     * @method nextNode
     * @param {Coord} new_target
     * @memberof OtherPlayer
     */
    nextNode: function (new_target) {
        // Si el nuevo target es muy diferente al anterior o no hay A*
        if (this.inViewport && (this.final_target_pos.distance(new_target) > 32 || this.myPath.length === 0)) {

            // Si la posicion actual es muy lejana calculo Astar
            if (this.pos.distance(this.final_target_pos) > 32 * 3) {

                this.target_pos = this.final_target_pos.clone();

                this.myPath = me.astar.search(this.pos.x, this.pos.y, this.final_target_pos.x, this.final_target_pos.y);
                console.log(JSON.stringify(this.myPath));
                if (this.myPath.length > 0) {
                    this.target_pos = me.astar.xy2pos(this.myPath.shift());
                    this.target_pos.x += 16;
                    this.target_pos.y += 16;
                }
            }
        }
        this.final_target_pos.copy(new_target);
    },

    /**
     * Actualiza los valores de x e y del personaje, y evalúa si
     * se debe llamar al pathfinder
     * @method update
     * @param {integer} dt
     * @return CallExpression
     * @memberof OtherPlayer
     */
    update: function (dt) {
        // Actuar Normalmente con target_pos actual
        this.direccion = 0;
        if (this.inViewport) {
            //  Si tengo todavia nodos por recorrer
            if (this.myPath.length > 0) {

                if (this.pos.distance(this.target_pos) < 16) {
                    this.target_pos = me.astar.xy2pos(this.myPath.shift());
                    this.target_pos.x += 16;
                    this.target_pos.y += 16;
                }
                //maxima velocidad por defecto
                this.body.vel.copy(this.pos.clone().sub(this.target_pos));
                this.body.vel.scale(-100, -100);

            } else {    //Me dirijo al punto  donde debo estar.
                this.target_pos = this.final_target_pos.clone();
                this.body.vel.x = (this.target_pos.x - this.pos.x) / 3;
                this.body.vel.y = (this.target_pos.y - this.pos.y) / 3;
            }

            if (this.body.vel.length() < 0.1) {
                this.body.vel.setZero();
                this.animationToUseThisFrame = this.last_animation;
            }
        } else {
            this.myPath = [];
            this.pos.x = this.final_target_pos.x;
            this.pos.y = this.final_target_pos.y;
        }
        me.collision.check(this);
        return this.updateAnimation(dt);
    },

    /**
     * Este método es llamado cuando se detecta una colisión con otra entidad
     * @method onCollision
     * @param {object} response
     * @param {object} other
     * @memberof OtherPlayer
     * @return Boolean
     */
    onCollision: function (response, other) {
        if (other.body.collisionType === me.collision.types.NPC_OBJECT ||
            other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            // Choque contra el mundo!
            return false;
        }
        // Make the object solid
        return true;
    },

    /**
     * Dibuja esta entidad en el canvas del juego
     * @method draw
     * @param {object} renderer
     * @memberof OtherPlayer
     */
    draw: function (renderer) {

        //var context = renderer.getContext();

        this._super(game.Player, 'draw', [renderer]);
        if (game.debug) {
            var pos;

            for (var i = 0; i < this.myPath.length; i++) {
                pos = me.astar.xy2pos(this.myPath[i]);
                renderer.fillStyle = 'white';
                renderer.fillRect(pos.x + 16 - 5, pos.y + 16 - 5, 10, 10);
                renderer.fillStyle = 'red';
                renderer.fillRect(pos.x + 16, pos.y + 16, 1, 1);
            }
            renderer.fillStyle = 'blue';
            renderer.fillRect(this.pos.x + 12, this.pos.y + 7, 2, 2);
        }
    }
});
