/**
 * Created by guille on 04/11/14.
 */
    function drawCanvasMinimap() {
        var canvasMinimap = document.getElementById("canvasMinimap");
        if (canvasMinimap.getContext) {
            var ctxMinimap = canvasMinimap.getContext("2d");

            ctxMinimap.fillStyle = "rgb(0,0,0)";
            ctxMinimap.beginPath();
            ctxMinimap.arc(50, 50, 4, 0, 2 * Math.PI, true);
            ctxMinimap.fill();
            ctxMinimap.fillStyle = "rgba(999,999,999,1)";
            ctxMinimap.arc(50, 50, 2, 0, 2 * Math.PI, true);
            ctxMinimap.fill();
        }
    }
    function toogleName(){

    }