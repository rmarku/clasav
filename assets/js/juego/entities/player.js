/************************************************************************************/
/*                                                                                  */
/*        a player entity                                                           */
/*                                                                                  */
/** ******************************************************************************* */
game.Player = me.Entity.extend({

    /**
     * Description
     * @return
     * @return
     * @method init
     * @param {} x
     * @param {} y
     * @param {} settings
     * @return
     */
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.data = settings.data;
        console.log(settings);
        this.target_pos = new me.Vector2d(x, y);
        this.final_target_pos = new me.Vector2d(x, y);
        this.myPath = [];

        this.body.setVelocity(9, 9);
        this.body.setFriction(0.5, 0.5);

        this.body.gravity = 0;


        this.nombre();
        // lo visto.

        this.renderable = new me.AnimationSheet(0, 0, {
            "image": this.vestir(),
            "framewidth": 32,
            "frameheight": 48,
            "spritewidth": 32,
            "spriteheight": 48
        });

        this.renderable.addAnimation('run-down', [0, 1, 2, 3], 100);
        this.renderable.addAnimation('run-left', [4, 5, 6, 7], 100);
        this.renderable.addAnimation('run-right', [8, 9, 10, 11], 100);
        this.renderable.addAnimation('run-up', [12, 13, 14, 15], 100);

        this.renderable.setCurrentAnimation(this.data.animation);


        this.anchorPoint.set(0.5, 1);

        this.animationToUseThisFrame = this.data.animation;
        this.lastAnimationUsed = this.data.animation;

        this.body.removeShape(this.body.getShape(0));
        this.body.addShape(new me.Ellipse(0, 0, this.body.width - 4, this.body.width - 4));
        // set the renderable position to bottom center

    },
    /**
     * Description
     * @method update
     * @param {} dt
     * @return CallExpression
     */
    update: function (dt) {
        if (this.direccion & 1) {
            this.body.vel.y = this.body.maxVel.y;
        }
        if (this.direccion & 2) {
            this.body.vel.y = -this.body.maxVel.y;
        }
        if (this.direccion & 4) {
            this.body.vel.x = this.body.maxVel.x;
        }
        if (this.direccion & 8) {
            this.body.vel.x = -this.body.maxVel.x;
        }

        this.updateAnimation(dt);
    },


    /**
     * Description
     * @method updateAnimation
     * @param {} dt
     * @return Literal
     */
    updateAnimation: function (dt) {


        if (this.body.vel.length() > (this.body.maxVel.x - this.body.friction.x )) {
            // Now calc actual vel to prevent speeding by going diag..
            this.body.vel.normalize();
            this.body.vel.scale(this.body.maxVel.x - this.body.friction.x);
        }

        this.body.update();

        if (Math.abs(this.body.vel.x) < Math.abs(this.body.vel.y)) {
            if (this.body.vel.y > 0.1)
                this.animationToUseThisFrame = "run-down";
            if (this.body.vel.y < -0.1)
                this.animationToUseThisFrame = "run-up";
        } else {
            if (this.body.vel.x > 0.1)
                this.animationToUseThisFrame = "run-right";
            if (this.body.vel.x < -0.1)
                this.animationToUseThisFrame = "run-left";
        }
        if (this.body.vel.length() === 0)
            this.renderable.setAnimationFrame(0);

        if (this.lastAnimationUsed != this.animationToUseThisFrame) {
            this.lastAnimationUsed = this.animationToUseThisFrame;
            this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
        }

        if (this.body.vel.x !== 0 || this.body.vel.y !== 0 || (this.renderable && this.renderable.isFlickering())) {
            this._super(me.Entity, 'update', [dt]);
            return true;
        }
        return false;
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
     * @return
     * @return
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
     * Dibuja el nombre del personaje por debajo
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
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = "#000";
        ctx.font = '11px "Short Stack" ';
        ctx.textBaseline = 'top';

        var txtw = ctx.measureText(this.data.nombre.trimRight()).width;

        ctx.strokeText(this.data.nombre, width / 2 - txtw / 2, 3);
        ctx.fillText(this.data.nombre, width / 2 - txtw / 2, 3);
    },

    /**
     * Description
     * @method getItemImg
     * @param {} itemId
     * @return
     */
    getItemImg: function (itemId) {
        var dir = this.data.duenio.sexo + '/';
        if (typeof itemId != 'undefined') {
            return me.loader.getImage(dir + game.sprites[game.items[itemId.item].sprite].imagen);
        } else
            return null;

    },

    /**
     * Viste al personaje
     * @return
     * @return
     * @method vestir
     * @return i
     */
    vestir: function () {
        var width = 32 * 4;
        var height = 48 * 4;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");

        // Sprites por defecto por si no hay en la BD
        var sprites = [{
            imagen: 'basic.png',
            xoffset: 0,
            yoffset: 1,   // si el yOffset es -1, hay mascara que aplicar.
            color: "#ffffff",
            zIndex: -999
        }, {
            imagen: 'basic.png',
            xoffset: 0,
            yoffset: 0,
            color: "#ffffff",
            zIndex: 0
        }, {
            imagen: 'hairFront.png', //Frente
            xoffset: this.data.pelo - 1,
            yoffset: 0,
            color: this.data.pelo_color,
            zIndex: 100
        }, {
            imagen: 'hairFront.png', //Sombra
            xoffset: this.data.pelo - 1,
            yoffset: 1,
            color: "#ffffff",
            zIndex: 101
        }, {
            imagen: 'hairFront.png', //Fondo
            xoffset: this.data.pelo - 1,
            yoffset: 2,
            color: this.data.pelo_color,
            zIndex: -10
        }];

        var dir = this.data.duenio.sexo + '/';
        var that = this;
        //Cargo los prites de cada parte

        ['zapatos', 'pantalon', 'torso'].forEach(function (it) {
            if (typeof that.data[it] !== 'undefined') {
                var i = game.items[that.data[it].item];
                sprites.push({
                    imagen: game.sprites[i.sprite].imagen,
                    xoffset: game.sprites[i.sprite].xoffset,
                    yoffset: game.sprites[i.sprite].yoffset,
                    color: i.color,
                    zIndex: game.sprites[i.sprite].zIndex
                });
            }
        });

        // Ordeno los sprites segun su zindex
        sprites.sort(function (a, b) {
            return a.zIndex - b.zIndex;
        });

        // Dibujo los sprites
        var img;
        sprites.forEach(function (sp) {


            img = me.loader.getImage(dir + sp.imagen);
            if (img) {
                // Todo: Sacar numeros magickos
                img = tintImage(img, sp.color, sp.xoffset * 128, sp.yoffset * 192, 128, 192);
                ctx.drawImage(img, 0, 0);
            }
        });

        var i = document.createElement('img');
        i.src = canvas.toDataURL();
        return i;
    },

    updateData: function () {
        // Traigo datos del quest (si es visible en este momento o no)
        var self = this;
        $.get('api/personaje/' + this.data.id,
            function (data) {
                self.data = data;

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
