/**
 * Created by martin on 01/11/14.
 * @method tintImage
 * @param {} img
 * @param {} color
 * @return buff
 */
function tintImage(img, color) {
    var w = img.width;
    var h = img.height;
    var RGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

    var red = parseInt(RGB[1], 16);
    var green = parseInt(RGB[2], 16);
    var blue = parseInt(RGB[3], 16);

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
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
        var imgComp = new Image();
        imgComp.src = canvas.toDataURL();

        rgbks.push(imgComp);
    }


    var buff = document.createElement("canvas");
    buff.width = img.width;
    buff.height = img.height;

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

    return buff;
}
