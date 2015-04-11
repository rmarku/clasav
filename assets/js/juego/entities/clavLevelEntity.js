

game.clavLevelEntity = me.LevelEntity.extend({
    /**
     * Description
     * @method init
     * @param {} x
     * @param {} y
     * @param {} settings
     * @return
     */
    init: function (x, y, settings) {
        // Inicializo y guardo valores particulares de este spawn point
        this._super(me.LevelEntity, "init", [x, y, settings]);
        this.spawn = settings.spawn;
    },
    /**
     * Description
     * @method onFadeComplete
     * @return
     */
    onFadeComplete : function () {
        // Al terminar de cargar el nivel,  muevo el personaje al punto de spawn
        this._super(me.LevelEntity, "onFadeComplete");

        var sp = me.game.currentLevel.getObjectGroupByName('Spawns');

        var tspawn = this.spawn;
        game.nextxy.x = 0;
        game.nextxy.y = 0;
        game.nextxy.direction = 0; // en direcion se esta cargando la animation, no la direction

        sp.objects.forEach(function(punto_sp){
            if(punto_sp.spawn ==  tspawn ){
                game.nextxy.x = punto_sp.x + punto_sp.width/2;
                game.nextxy.y = punto_sp.y + punto_sp.height/2;
                game.nextxy.direction = punto_sp.direction; // Lo que es la direccion en los mapas tiled es la animation en el Player
                game.change_level(me.game.currentLevel.name);

                //Eliminamos el clavLevelEntity si el cambio de mapa se hizo con el selector de Clases
                if(game.clavLevelEntity != {}){
                    me.game.world.removeChild(game.clavLevelEntity);
                    game.clavLevelEntity = {};
                }

            }
        });
    }
});
