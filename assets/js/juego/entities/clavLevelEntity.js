

game.clavLevelEntity = me.LevelEntity.extend({
    init: function (x, y, settings) {
        // Inicializo y guardo valores particulares de este spawn point
        this._super(me.LevelEntity, "init", [x, y, settings]);
        this.spawn = settings.spawn;
    },
    onFadeComplete : function () {
        // Al terminar de cargar el nivel,  muevo el personaje al punto de spawn
        this._super(me.LevelEntity, "onFadeComplete");

        var sp = me.game.currentLevel.getObjectGroupByName('Spawns');

        var tspawn = this.spawn;
        game.nextxy.x = 0;
        game.nextxy.y = 0;
        game.nextxy.direction = 0;

        sp.objects.forEach(function(punto_sp){
            if(punto_sp.spawn ==  tspawn ){
                game.nextxy.x = punto_sp.x + punto_sp.width/2;
                game.nextxy.y = punto_sp.y + punto_sp.height/2;
                game.nextxy.direction = punto_sp.direction;
            }
        });
    }
});
