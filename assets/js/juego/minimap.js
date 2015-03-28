/**
 * Created by guille on 04/11/14.
 * @method drawPointsMinimap
 * @return 
 */
function drawPointsMinimap() {
    var canvasMinimap = document.getElementById("canvasMinimap");
    if (canvasMinimap.getContext) {
        var ctxMinimap = canvasMinimap.getContext("2d");
        canvasMinimap.width = canvasMinimap.width;

        // Dibujo NPCs
        for (var npc in game.NPCs) {
            if (game.NPCs[npc].pos) {
                ctxMinimap.beginPath();
                ctxMinimap.fillStyle = '#ffff00';
                ctxMinimap.arc(~~(game.NPCs[npc].pos.x * 156 / 1344), ~~(game.NPCs[npc].pos.y * 156 / 1344), 2, 0, 2 * Math.PI, true);
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
                ctxMinimap.arc(~~(game.players[pj].pos.x * 156 / 1344), ~~(game.players[pj].pos.y * 156 / 1344), 2, 0, 2 * Math.PI, true);
                ctxMinimap.fill();
                ctxMinimap.lineWidth = 1;
                ctxMinimap.strokeStyle = '#000000';
                ctxMinimap.stroke();
            }
        }
        // Dibujo MainPlayer
        ctxMinimap.beginPath();
        ctxMinimap.fillStyle = '#FFFFFF';
        ctxMinimap.arc(~~(game.mainPlayer.pos.x * 156 / 1344), ~~(game.mainPlayer.pos.y * 156 / 1344), 2, 0, 2 * Math.PI, true);
        ctxMinimap.fill();
        ctxMinimap.lineWidth = 1;
        ctxMinimap.strokeStyle = '#000000';
        ctxMinimap.stroke();
    }
}
