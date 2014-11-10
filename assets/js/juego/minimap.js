/**
 * Created by guille on 04/11/14.
 */
function drawCanvasMinimap() {
    var canvasMinimap = document.getElementById("canvasMinimap");
    if (canvasMinimap.getContext) {
        var ctxMinimap = canvasMinimap.getContext("2d");
        ctxMinimap.beginPath();
        canvasMinimap.width = canvasMinimap.width;
        ctxMinimap.fillStyle = '#FFFFFF';
        ctxMinimap.arc(~~(game.mainPlayer.pos.x * 156 / 1344), ~~(game.mainPlayer.pos.y * 156 / 1344), 2, 0, 2 * Math.PI, true);
        ctxMinimap.fill();
        ctxMinimap.lineWidth = 1;
        ctxMinimap.strokeStyle = '#000000';
        ctxMinimap.stroke();
        //seria util guardar tamaño del mapa en scope
        //y que si es muy grande que se vaya moviendo
        /*game.NPCPlayer.forEach(function drawNPC (value){
         ctxMinimap.beginPath();
         ctxMinimap.fillStyle = '#00FFEF';
         ctxMinimap.arc(~~(value.pos.x * 156 / 1344), ~~(value.pos.y * 156 / 1344), 2, 0, 2 * Math.PI, true);
         ctxMinimap.fill();
         ctxMinimap.lineWidth = 1;
         ctxMinimap.strokeStyle = '#000000';
         ctxMinimap.stroke();
         });*/
    }
}
