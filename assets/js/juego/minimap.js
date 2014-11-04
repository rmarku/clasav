/**
 * Created by guille on 04/11/14.
 */
    function drawCanvasMinimap() {
        var canvas = document.getElementById('canvasMinimap');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');

            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect (10, 10, 55, 50);
        }
    }