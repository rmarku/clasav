/**
 * Created by martin on 28/04/15.
 */
game.CustomLoadingScreen = me.ScreenObject.extend({
    // call when the loader is resetted
    onResetEvent: function () {
        me.game.reset();

        // background color
        me.game.world.addChild(new me.ColorLayer("background", "#202020", 0));

        // progress bar
        var progressBar = new this.ProgressBar(
            new me.Vector2d(),
            me.video.renderer.getWidth(),
            me.video.renderer.getHeight()
        );

        this.loaderHdlr = me.event.subscribe(
            me.event.LOADER_PROGRESS,
            progressBar.onProgressUpdate.bind(progressBar)
        );

        this.resizeHdlr = me.event.subscribe(
            me.event.VIEWPORT_ONRESIZE,
            progressBar.resize.bind(progressBar)
        );

        me.game.world.addChild(progressBar, 1);
        me.game.world.addChild(new this.TextLogo(me.video.renderer.getWidth(), me.video.renderer.getHeight()), 1);
    },

    // destroy object at end of loading
    onDestroyEvent: function () {
        // cancel the callback
        me.event.unsubscribe(this.loaderHdlr);
        me.event.unsubscribe(this.resizeHdlr);
        this.loaderHdlr = this.resizeHdlr = null;
        $('#todoHUD').fadeIn(0);
    },
    ProgressBar: me.Renderable.extend({

        init: function (v, w, h) {
            this._super(me.Renderable, "init", [v.x, v.y, w, h]);
            // flag to know if we need to refresh the display
            this.invalidate = false;

            // default progress bar height
            this.barHeight = 5;

            // current progress
            this.progress = 0;
        },

        // make sure the screen is refreshed every frame
        onProgressUpdate: function (progress) {
            this.progress = ~~(progress * this.width);
            this.invalidate = true;
        },

        // make sure the screen is refreshed every frame
        update: function () {
            if (this.invalidate === true) {
                // clear the flag
                this.invalidate = false;
                // and return true
                return true;
            }
            // else return false
            return false;
        },

        // draw function
        draw: function (renderer) {
            // draw the progress bar
            renderer.setColor("black");
            renderer.fillRect(0, (this.height * 2 / 3) - (this.barHeight / 2), this.width, this.barHeight);

            renderer.setColor("#F0AD4E");
            renderer.fillRect(2, (this.height * 2 / 3) - (this.barHeight / 2), this.progress, this.barHeight);
            renderer.fillArc(this.progress, (this.height * 2 / 3) - (this.barHeight * 2), this.barHeight * 2, 0, 2 * 3.1415);

            renderer.setColor("white");
        }
    }),
    TextLogo: me.Renderable.extend({
        // constructor
        init: function (w, h) {
            this._super(me.Renderable, "init", [0, 0, w, h]);
            var xpos = (this.width - game.logo.width ) / 2;
            var ypos = 0;
            this.logo = new me.Sprite(xpos, ypos, {image: game.logo, framewidth: game.logo.width, frameheight: game.logo.height});
            var scalex = 1;
            var scaley = 1;
            if (this.height / 4 < game.logo.height) {
                scaley = (this.height / 3) / game.logo.height;
            }
            if (this.width / 2 < game.logo.width) {
                scalex = (this.width / 2) / game.logo.width;
            }
            if (scaley < scalex)
                scalex = scaley;
            this.logo.pos.y = (this.height - game.logo.height * scaley) / 4;
            this.logo.scale(scalex, scalex);
        },

        draw: function (renderer) {
            this.logo.draw(renderer);
        }
    })
});