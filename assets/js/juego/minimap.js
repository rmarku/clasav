/**
 * Created by guille on 04/11/14.
 */
    function drawCanvasMinimap(x, y) {
        var canvasMinimap = document.getElementById("canvasMinimap");
        if (canvasMinimap.getContext) {
            var ctxMinimap = canvasMinimap.getContext("2d");
            ctxMinimap.beginPath();
            canvasMinimap.width=canvasMinimap.width;
            ctxMinimap.fillStyle = '#FFFFFF';
            ctxMinimap.arc(~~(x*156/1344), ~~(y*156/1344),2, 0, 2 * Math.PI, true); ctxMinimap.fill();
            ctxMinimap.lineWidth = 1;
            ctxMinimap.strokeStyle = '#000000';
            ctxMinimap.stroke();
            //seria util guardar tamaño del mapa en scope
            //y que si es muy grande que se vaya moviendo
        }
    }
    function toogleName(){

    }