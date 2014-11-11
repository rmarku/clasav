/**
 * Created by guille on 04/11/14.
 */
    function drawPointsMinimap() {
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
            game.NPCs.forEach(function drawNPC(value){
                ctxMinimap.beginPath();
                ctxMinimap.fillStyle = '#00FFEF';
                ctxMinimap.arc(~~(value.pos.x * 156 / 1344), ~~(value.pos.y * 156 / 1344), 2, 0, 2 * Math.PI, true);
                ctxMinimap.fill();
                ctxMinimap.lineWidth = 1;
                ctxMinimap.strokeStyle = '#000000';
                ctxMinimap.stroke();
            });
            game.players.forEach(function drawPlayer(value){
                ctxMinimap.beginPath();
                ctxMinimap.fillStyle = '#FF0000';
                ctxMinimap.arc(~~(value.pos.x * 156 / 1344), ~~(value.pos.y * 156 / 1344), 2, 0, 2 * Math.PI, true);
                ctxMinimap.fill();
                ctxMinimap.lineWidth = 1;
                ctxMinimap.strokeStyle = '#000000';
                ctxMinimap.stroke();
            });
            //seria util guardar tamaño del mapa en scope
            //y que si es muy grande que se vaya moviendo
        }
    }
/*function drawNPCMinimap (x,y){
    var canvasMinimap = document.getElementById("canvasMinimap");
    if (canvasMinimap.getContext) {
        var ctxMinimap = canvasMinimap.getContext("2d");
        ctxMinimap.beginPath();
        ctxMinimap.fillStyle = '#00FFEF';
        ctxMinimap.arc(~~(x * 156 / 1344), ~~(y * 156 / 1344), 2, 0, 2 * Math.PI, true);
        ctxMinimap.fill();
        ctxMinimap.lineWidth = 1;
        ctxMinimap.strokeStyle = '#000000';
        ctxMinimap.stroke();
    }//otra opcion (poniendolo en el update del npc en particular (se borra porque el update del main es mas seguido)
}*/