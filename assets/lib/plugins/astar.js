// MelonJS-AStar
// By Sean Muron (swmuron@github)
// See readme.md for documentation
// Freely distributable under the MIT License.

// Credit:
// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Includes Binary Heap (with modifications) from Marijn Haverbeke.
// http://eloquentjavascript.net/appendix2.html

(function ($) {

    me.astar = me.astar || {};

    aStarPlugin = me.plugin.Base.extend({
        /** @scope me.astar.prototype */


        init: function () {
            // call parent constructor
            this._super(me.plugin.Base, 'init');
            //this.parent();
            this.version = "1.1.0";
            this.GUID = "astar-" + me.utils.createGUID();
            this.name = "me.astar";
            this.isPersistent = true;
            me.event.subscribe(me.event.LEVEL_LOADED, this.refresh);
        },
        refresh: function () {
            if (me.astar != null) {
                // alternatively, just update the nodes?
                me.astar = null;
            }
            me.astar = new AStarInstance();
            me.astar.init();
        }
    });

    var AStarInstance = function () {
    };

    AStarInstance.prototype.init = function () {

        // hook into level data to generate the graph
        // Get the collision layer reference.

        var granularity = 1;
        var cols = me.game.currentLevel.cols * granularity;
        var rows = me.game.currentLevel.rows * granularity;

        this.tw = me.game.currentLevel.tilewidth / granularity;
        this.th = me.game.currentLevel.tileheight / granularity;

        var start = new Date().getTime();

        var set = {
            width: this.tw,
            height: this.th,
            type: 1
        };
        var ent = new me.Entity(0, 0, set);
        ent.body.addShape(new me.Rect(0, 0, this.tw, this.th));

        var bound = {
            width: me.game.currentLevel.width + 1,
            height: me.game.currentLevel.height + 1,
            pos: {
                x: 0, y: 0
            }
        };

        var qt = new me.QuadTree(bound, 6, 8);
        qt.insertContainer(me.game.world);
        var objects;

        var x, y, i;
        this.grid = Array(this.rows);


        for (y = 0; y < rows; y++) {
            ent.pos.y = this.th * y;
            this.grid[y] = Array(this.cols);
            for (x = 0; x < cols; x++) {
                ent.pos.x = this.tw * x;
                this.grid[y][x] = 0;
                bound.pos.x = x;
                bound.pos.y = y;
                objects = qt.retrieve(ent);
                for (i = 0; i < objects.length; i++) {
                    if (objects[i].body.collisionType == me.collision.types.WORLD_SHAPE &&
                        ent.overlaps(objects[i].getBounds()))
                        this.grid[y][x] = 1;
                }
            }
        }
        console.log('tardo ' + (new Date().getTime() - start ));
    };

    AStarInstance.prototype.search = function (x0, y0, x1, y1) {

        var finder = new PF.JumpPointFinder({
            allowDiagonal: false,
            dontCrossCorners: true
        });
        var start = new Date().getTime();
        var pGrid = new PF.Grid(this.grid);
        console.log('tardo ' + (new Date().getTime() - start ));
         start = new Date().getTime();
        var pGrid2 = pGrid.clone();
        console.log('tardo ' + (new Date().getTime() - start ));

        var path = finder.findPath(~~(x0 / this.tw), ~~(y0 / this.th), ~~(x1 / this.tw), ~~(y1 / this.th), pGrid);
        return path;
        //return PF.Util.smoothenPath(path, pGrid);

        //return astar.search(this.grid, this.grid[~~(x0 / this.tw)][~~(y0 / this.th)], this.grid[~~(x1 / this.tw)][~~(y1 / this.th)], true);
    };


    AStarInstance.prototype.xy2pos = function (xy) {
        return {x: xy[0] * this.tw, y: xy[1] * this.th};
    };

})(window);
