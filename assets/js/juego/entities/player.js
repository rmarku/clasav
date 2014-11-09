/************************************************************************************/
/*                                                                                  */
/*        a player entity                                                           */
/*                                                                                  */
/** ******************************************************************************* */
game.Player = me.Entity.extend({

    /**
     * Description
     * @return
     * @method init
     * @param {} x
     * @param {} y
     * @param {} settings
     * @return
     */
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [ x, y, settings ]);
        this.data = settings.data;
        this.alwaysUpdate = true;

        this.body.setVelocity(5, 5);
        this.body.setFriction(0.3, 0.3);

        this.body.gravity = 0;

        this.vestir();

        this.isCollidable = true;

        this.renderable.addAnimation('run-down', [ 0, 1, 2, 3 ], 100);
        this.renderable.addAnimation('run-left', [ 4, 5, 6, 7 ], 100);
        this.renderable.addAnimation('run-right', [ 8, 9, 10, 11 ], 100);
        this.renderable.addAnimation('run-up', [ 12, 13, 14, 15 ], 100);

        this.renderable.setCurrentAnimation('run-down');
        this.animationToUseThisFrame = 'run-down';
        this.lastAnimationUsed = 'run-down';

        this.anchorPoint.set(0.5, 1);

        this.body.addShape(new me.Rect(0, 0, this.body.width-3, this.body.height/2));
        // set the renderable position to bottom center

    },
    /**
     * Description
     * @method update
     * @param {} dt
     * @return Literal
     */
    update: function (dt) {
        return this.updateAnimation(dt);
    },


    updateAnimation: function(dt){
      if (this.body.vel.length() > this.body.maxVel.x) {
        // Now calc actual vel to prevent speeding by going diag..
        this.body.vel.normalize();
        this.body.vel.scale(this.body.maxVel.x);
      }
      if ( this.body.vel.y > 0.0 )
        this.animationToUseThisFrame = "run-down";
      if ( this.body.vel.y < 0.0 )
        this.animationToUseThisFrame = "run-up";

      if(Math.abs(this.body.vel.x) > Math.abs(this.body.vel.y)) {
        if (this.body.vel.x > 0.0)
          this.animationToUseThisFrame = "run-right";
        if (this.body.vel.x < 0.0)
          this.animationToUseThisFrame = "run-left";
      }

      if(this.lastAnimationUsed != this.animationToUseThisFrame) {
        this.lastAnimationUsed = this.animationToUseThisFrame;
        this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
      }
      this.body.update();

      if (this.body.vel.x !== 0 || this.body.vel.y !== 0 || (this.renderable && this.renderable.isFlickering())) {
        this._super(me.Entity, 'update', [ dt ]);
        return true;
      }
      return false;
    },


    /**
     * Description
     * @return
     * @method draw
     * @param {} renderer
     * @return
     */
    draw: function (renderer) {

        // Envio datos de posicion y estado al servidor

        // Dibujo el personaje
        this._super(me.Entity, 'draw', [renderer]);

        var context = renderer.getContext();

         // Dibujo el nombre
        context.drawImage(this.canvas,
            0,
            ~~(this.canvas.height - 29),
            ~~(this.canvas.width),
            30,
            ~~(this.pos.x + this.width / 2 - this.canvas.width / 2),
            ~~(this.pos.y + this.height/2),
            this.renderable.image.width,
            30);

      // Dibujo en el minimapa
            drawCanvasMinimap(this.pos.x,this.pos.y);
    },


    /**
     * Description
     * @method getItemImg
     * @param {} itemId
     * @return Literal
     */
    getItemImg: function (itemId) {
        var dir = this.data.duenio.sexo + '/';
        return null;
    },

    /**
     * Description
     * @return
     * @method vestir
     * @return
     */
    vestir: function () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.renderable.image.width;
        this.canvas.height = this.renderable.image.height + 30;
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        //Dibujo el nombre

        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = "#000";
        this.ctx.font = '11px "Short Stack" ';
        this.ctx.textBaseline = 'top';

      var txtw = this.ctx.measureText(this.data.nombre.trimRight()).width;

        this.ctx.strokeText(this.data.nombre, this.renderable.image.width / 2 - txtw / 2, this.renderable.image.height+ 7);
        this.ctx.fillText(this.data.nombre, this.renderable.image.width / 2 - txtw / 2, this.renderable.image.height+ 7) ;


        // Dibujo el personaje

        var dir = this.data.duenio.sexo + '/';
        // 1 el cuerpo de fondo
        img = me.loader.getImage(dir + 'basic/1b.png');
        this.ctx.drawImage(img, 0, 0);

        // 2 el pelo de fondo
        img = me.loader.getImage(dir + 'hair/back/' + this.data.pelo + '.png');
        if (img) {
            this.ctx.drawImage(tintImage(img, this.data.pelo_color), 0, 0);
        }

        // 3 el cuerpo normal
        img = me.loader.getImage(dir + 'basic/1f.png');
        this.ctx.drawImage(img, 0, 0);

        // 4 zapato No andando :S
        img = this.getItemImg(this.data.zapatos);
        if (img) {
            this.ctx.drawImage(img, 0, 0);
        }
        // 5 Pantalon
        img = this.getItemImg(this.data.pantalon);
        if (img) {
            this.ctx.drawImage(img, 0, 0);
        }

        img = this.getItemImg(this.data.remera);
        if (img) {
            this.ctx.drawImage(img, 0, 0);
        }


        if (this.data.pelo !== "") {
            img = me.loader.getImage(dir + 'hair/front/' + this.data.pelo + '.png');
            this.ctx.drawImage(img, 0, 0);
            img = me.loader.getImage(dir + 'hair/front/' + this.data.pelo + 'hair.png');
            this.ctx.drawImage(tintImage(img, this.data.pelo_color), 0, 0);
        }

        this.renderable.image.src = this.canvas.toDataURL();

    }
});
