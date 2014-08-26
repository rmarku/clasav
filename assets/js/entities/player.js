/************************************************************************************/
/*                                                                                  */
/*        a player entity                                                           */
/*                                                                                  */
/** ********************************************************************************* */
game.PlayerEntity = me.Entity.extend({

	init : function(x, y, settings) {
		this._super(me.Entity, 'init', [ x, y, settings ]);
		this.data = settings.data;
		this.alwaysUpdate = true;

		this.body.setVelocity(3, 3);
		this.body.setFriction(0.3, 0.3);
		// this.body.setMaxVelocity(4, 4);
		this.body.gravity = 0;

		this.vestir();
		me.input.bindKey(me.input.KEY.LEFT, 'left');
		me.input.bindKey(me.input.KEY.A, 'left');
		me.input.bindKey(me.input.KEY.RIGHT, 'right');
		me.input.bindKey(me.input.KEY.D, 'right');
		me.input.bindKey(me.input.KEY.UP, 'up');
		me.input.bindKey(me.input.KEY.W, 'up');
		me.input.bindKey(me.input.KEY.DOWN, 'down');
		me.input.bindKey(me.input.KEY.S, 'down');

		me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

		// bounding
		// this.addShape(new me.Rect(new me.Vector2d(7,10), 32, 32));

		this.isCollidable = true;
		this.type = game.MAIN_PLAYER_OBJECT;

		this.renderable.addAnimation('run-down', [ 0, 1, 2, 3 ], 100);
		this.renderable.addAnimation('run-left', [ 4, 5, 6, 7 ], 100);
		this.renderable.addAnimation('run-right', [ 8, 9, 10, 11 ], 100);
		this.renderable.addAnimation('run-up', [ 12, 13, 14, 15 ], 100);
		this.renderable.setCurrentAnimation('run-down');
		this.lastAnimationUsed = 'run-down';
		this.animationToUseThisFrame = 'run-down';

		this.body.addShape(new me.Rect(0, 0, this.body.width,this.body.height));

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 0.5);

	},
	update : function(dt) {

		if (me.input.isKeyPressed('left')) {
			this.animationToUseThisFrame = 'run-left';
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
		}

		if (me.input.isKeyPressed('right')) {
			this.animationToUseThisFrame = 'run-right';
			this.body.vel.x += this.body.accel.x * me.timer.tick;

		}
		if (me.input.isKeyPressed('up')) {
			this.animationToUseThisFrame = 'run-up';
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}

		if (me.input.isKeyPressed('down')) {
			this.animationToUseThisFrame = 'run-down';
			this.body.vel.y += this.body.accel.y * me.timer.tick;
		}
		if (this.animationToUseThisFrame != this.lastAnimationUsed) {
			this.lastAnimationUsed = this.animationToUseThisFrame;
			this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
		}

		if (this.body.vel.length() > this.body.maxVel.x) {
			// Now calc actual vel to prevent speeding by going diag..
			this.body.vel.normalize();
			this.body.vel.scale(this.body.maxVel.x);
		}
		this.body.update();

		if (this.body.vel.x != 0 || this.body.vel.y != 0
				|| (this.renderable && this.renderable.isFlickering())) {
			this._super(me.Entity, 'update', [ dt ]);
			return true;
		}

		return false;
	},
	vestir : function() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.renderable.image.width;
		this.canvas.height = this.renderable.image.height;

		var body = document.getElementsByTagName("body")[0];
		body.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");
		this.ctx.drawImage(this.renderable.image, 0, 0);

		if (this.data.vestimenta.pelo != "") {
			img = me.loader.getImage(this.data.vestimenta.pelo);
			this.ctx.drawImage(img, 0, 0);
		}
		if (this.data.vestimenta.pantalon != "") {
			img = me.loader.getImage(this.data.vestimenta.pantalon);
			this.ctx.drawImage(img, 0, 0);
		}
		if (this.data.vestimenta.remera != "") {
			img = me.loader.getImage(this.data.vestimenta.remera);
			this.ctx.drawImage(img, 0, 0);
		}

		this.renderable.image.src = this.canvas.toDataURL();

	}
});
