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


        this.nombre();
        // lo visto.
        this.renderable = new me.AnimationSheet(0, 0, {
          "image" : this.vestir(),
          "spritewidth" : 32,
          "spriteheight" : 48
        });


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


    updateAnimation: function(dt) {
      if (this.direccion & 1) {
        this.body.vel.y += this.body.accel.y * dt/200;
      }
      if ( this.direccion & 2 ){
        this.body.vel.y -= this.body.accel.y * dt/200;
      }
      if (this.direccion & 4) {
        this.body.vel.x += this.body.accel.x * dt/200;
      }
      if (this.direccion & 8) {
        this.body.vel.x -= this.body.accel.x * dt/200;
      }

      if (this.body.vel.length() > this.body.maxVel.x) {
        // Now calc actual vel to prevent speeding by going diag..
        this.body.vel.normalize();
        this.body.vel.scale(this.body.maxVel.x);
      }

      if(Math.abs(this.body.vel.x) < Math.abs(this.body.vel.y)) {
        if (this.body.vel.y > 0.0)
          this.animationToUseThisFrame = "run-down";
        if (this.body.vel.y < 0.0)
          this.animationToUseThisFrame = "run-up";
      }else{
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
        context.drawImage(this.canvasNombre,
            ~~(this.pos.x + this.width / 2 - this.canvasNombre.width / 2),
            ~~(this.pos.y + this.height/2),
            32 * 4,
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
        if(typeof itemId != 'undefined') {
            return me.loader.getImage(dir + game.sprites[game.items[itemId.item].sprite].imagen);
        }else
            return null;

    },

    nombre:function (){
      var width = 32 * 4;
      var height = 30;
        this.canvasNombre = document.createElement('canvas');
        this.canvasNombre.width = width;
        this.canvasNombre.height = height;
        var ctx =  this.canvasNombre.getContext("2d");

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
        ctx.fillText(this.data.nombre, width / 2 - txtw / 2, 3) ;
    },

    /**
     * Description
     * @return
     * @method vestir
     * @return
     */
    vestir: function () {
        var width = 32 * 4;
        var height = 48 * 4;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        // Dibujo el personaje

        var dir = this.data.duenio.sexo + '/';
        // 1 el cuerpo de fondo
        img = me.loader.getImage(dir + 'basic/1b.png');
        ctx.drawImage(img, 0, 0);

        // 2 el pelo de fondo
        img = me.loader.getImage(dir + 'hair/back/' + this.data.pelo + '.png');
        if (img) {
            ctx.drawImage(tintImage(img, this.data.pelo_color), 0, 0);
        }

        // 3 el cuerpo normal
        img = me.loader.getImage(dir + 'basic/1f.png');
        ctx.drawImage(img, 0, 0);

        // 4 zapato No andando :S
        img = this.getItemImg(this.data.zapatos);
        if (img) {
            ctx.drawImage(tintImage(img, game.items[this.data.zapatos.item].color), 0, 0);
        }else{
          console.log('no img' + img);
        }
        // 5 Pantalon
        img = this.getItemImg(this.data.pantalon);
        if (img) {
            ctx.drawImage(tintImage(img, game.items[this.data.pantalon.item].color), 0, 0);
        }

        img = this.getItemImg(this.data.torso);
        if (img) {
            ctx.drawImage(tintImage(img, game.items[this.data.torso.item].color), 0, 0);
        }


        if (this.data.pelo !== "") {
            img = me.loader.getImage(dir + 'hair/front/' + this.data.pelo + '.png');
            ctx.drawImage(img, 0, 0);
            img = me.loader.getImage(dir + 'hair/front/' + this.data.pelo + 'hair.png');
            ctx.drawImage(tintImage(img, this.data.pelo_color), 0, 0);
        }

        var i = new Image(width,height);
        i.src = canvas.toDataURL();
      return i;
    }
});
