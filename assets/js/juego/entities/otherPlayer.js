game.OtherPlayer = game.Player.extend({
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
        this.body.setVelocity(4.6, 4.6);
        this.body.setFriction(0, 0);
        this.id = settings.data.id;
        this.direccion = settings.data.direccion;
        this.last_animation = settings.data.animation;
        this.myPath = [];
        this.alwaysUpdate = true;
    },

    /**
     * Description
     * @method nextNode
     * @param {} new_target
     * @return
     */
    nextNode: function (new_target) {
        // Si el nuevo target es muy diferente al anterior o no hay A*
        if (this.inViewport && (this.final_target_pos.distance(new_target) > 32 || this.myPath.length === 0)) {

            // Si la posicion actual es muy lejana calculo Astar
            if (this.pos.distance(this.final_target_pos) > 32 * 3) {

                me.astar.init();
                this.target_pos = this.final_target_pos.clone();

                this.myPath = me.astar.search(this.pos.x, this.pos.y, this.final_target_pos.x, this.final_target_pos.y);
                if (this.myPath.length > 0) {
                    this.target_pos = this.myPath.pop().pos;
                    this.target_pos.x += 16;
                    this.target_pos.y += 16;
                }
            }
        }
        this.final_target_pos.copy(new_target);
    },

    /**
     * Description
     * @method update
     * @param {} dt
     * @return CallExpression
     */
    update: function (dt) {
        // Actuar Normalmente con target_pos actual
        this.direccion = 0;
        if (this.inViewport) {
            //  Si tengo todavia nodos por recorrer
            if (this.myPath.length > 0) {

                if (this.pos.distance(this.target_pos) < 16) {
                    this.target_pos = this.myPath.pop().pos;
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
        return this.updateAnimation(dt);
    }
});
