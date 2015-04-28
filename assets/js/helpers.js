/**
 * Created by martin on 01/11/14.
 * @method tintImage
 * @param {} img
 * @param {} color
 * @param {} x
 * @param {} y
 * @param {} w
 * @param {} h
 * @return buff
 */
function tintImage(img, color, x, y, w, h) {

    w = w || img.width;
    h = h || img.height;
    x = x || 0;
    y = y || 0;

    var RGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    var imgTemp = document.getElementById("imgTemp");

    var red = parseInt(RGB[1], 16);
    var green = parseInt(RGB[2], 16);
    var blue = parseInt(RGB[3], 16);

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    var to = ctx.getImageData(0, 0, w, h);
    var rgbks = [];

    var pixels = ctx.getImageData(0, 0, w, h).data;

    // 4 is used to ask for 3 images: red, green, blue and
    // black in that order.
    for (var rgbI = 0; rgbI < 4; rgbI++) {
        for (
            var i = 0;
            i < pixels.length;
            i += 4
        ) {
            to.data[i] = (rgbI === 0) ? pixels[i] : 0;
            to.data[i + 1] = (rgbI === 1) ? pixels[i + 1] : 0;
            to.data[i + 2] = (rgbI === 2) ? pixels[i + 2] : 0;
            to.data[i + 3] = pixels[i + 3];
        }

        ctx.putImageData(to, 0, 0);
        // image is _slightly_ faster then canvas for this, so convert
        var imgComp =  document.createElement("canvas");
        imgComp.width = w;
        imgComp.height = h;
        var imgCompctx = imgComp.getContext("2d");
        imgCompctx.drawImage(canvas,0,0);
        rgbks.push(imgComp);
    }


    var buff = document.createElement("canvas");
    buff.width = w;
    buff.height = h;

    var context = buff.getContext("2d");

    context.globalAlpha = 1;
    context.globalCompositeOperation = 'copy';
    context.drawImage(rgbks[3], 0, 0);

    context.globalCompositeOperation = 'lighter';
    if (red > 0) {
        context.globalAlpha = red / 255.0;
        context.drawImage(rgbks[0], 0, 0);
    }
    if (green > 0) {
        context.globalAlpha = green / 255.0;
        context.drawImage(rgbks[1], 0, 0);
    }
    if (blue > 0) {
        context.globalAlpha = blue / 255.0;
        context.drawImage(rgbks[2], 0, 0);
    }
    context.stroke();
    return buff;
}



/*
Todos los errores al Server para log!!!!!!!!!
 */

window.onerror = function(message, url, lineNumber) {
    //save error and send to server for example.
    return false;
};