/**
 * Clase que se encarga de todo el comportamiento del minimapa
 * @class minimap
 */
minimap = {
    miniWidth: 156,
    miniHeight: 156,

    mapaWidth: 100000,
    mapaHeight: 100000,

    /**
     * Funcion que actualiza cuando hay un mapa nuevo
     * @method updateMap
     * @memberof minimap
     * @param {number} wi - Ancho del mapa
     * @param {number} he - Alto del mapa
     * @param {number} name - Nombre del mapa
     */
    updateMap: function (wi, he, name) {
        this.mapaWidth = wi;
        this.mapaHeight = he;
        $("#minimap_img").attr("src", "data/map/" + name + ".png");
    },
    /**
     * Metodo encargado de dibujar todos los puntos de NPCs, Jugadores, etc en el mapa
     * @method drawPointsMinimap
     * @memberof minimap
     */
    drawPointsMinimap: function () {
        var canvasMinimap = document.getElementById("canvasMinimap");
        if (canvasMinimap.getContext) {
            var ctxMinimap = canvasMinimap.getContext("2d");
            canvasMinimap.width = canvasMinimap.width;

            // Dibujo NPCs
            for (var npc in game.NPCs) {
                if (game.NPCs[npc].pos && game.NPCs[npc].isRenderable) {
                    ctxMinimap.beginPath();
                    ctxMinimap.fillStyle = '#ffff00';
                    ctxMinimap.arc(~~(game.NPCs[npc].pos.x * this.miniWidth / this.mapaWidth), ~~(game.NPCs[npc].pos.y * this.miniHeight / this.mapaHeight), 2, 0, 2 * Math.PI, true);
                    ctxMinimap.fill();
                    ctxMinimap.lineWidth = 1;
                    ctxMinimap.strokeStyle = '#000000';
                    ctxMinimap.stroke();
                }
            }

            // Dibujo Players
            for (var pj in game.players) {
                if (game.players[pj].pos) {
                    ctxMinimap.beginPath();
                    ctxMinimap.fillStyle = '#FF0000';
                    ctxMinimap.arc(~~(game.players[pj].pos.x * this.miniWidth / this.mapaWidth), ~~(game.players[pj].pos.y * this.miniHeight / this.mapaHeight), 2, 0, 2 * Math.PI, true);
                    ctxMinimap.fill();
                    ctxMinimap.lineWidth = 1;
                    ctxMinimap.strokeStyle = '#000000';
                    ctxMinimap.stroke();
                }
            }
            // Dibujo MainPlayer
            ctxMinimap.beginPath();
            ctxMinimap.fillStyle = '#FFFFFF';
            ctxMinimap.arc(~~(game.mainPlayer.pos.x * this.miniWidth / this.mapaWidth), ~~(game.mainPlayer.pos.y * this.miniHeight / this.mapaHeight), 2, 0, 2 * Math.PI, true);
            ctxMinimap.fill();
            ctxMinimap.lineWidth = 1;
            ctxMinimap.strokeStyle = '#000000';
            ctxMinimap.stroke();
        }
    }
};
