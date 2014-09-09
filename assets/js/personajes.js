/**
 * New node file
 */
function loadCanvas(context, dataURL, x, y) {

	// load image from data url
	var imageObj = new Image();
	imageObj.onload = function() {
		context.drawImage(this, x, y);
	};

	imageObj.src = dataURL;
}
var images = {};

var img_h = 0;
var img_v = 0;
/*
$(document).ready(function() {
	// lleno las cabeceras
	var canvas = document.getElementById('pj');
	var context = canvas.getContext('2d');

	images['basic2'] = new Image();
	images['hair/back'] = new Image();
	images['basic1'] = new Image();
	images['shirt'] = new Image();
	images['pants'] = new Image();
	images['hair/front'] = new Image();
	images['hair/side'] = new Image();

	images['hair/back'].src = 'data/sprites/characters/wm/hair/back/13_black.png';
	images['basic1'].src = 'data/sprites/characters/wm/basic/pj_f.png';
	images['basic2'].src = 'data/sprites/characters/wm/basic/pj_b.png';
	images['shirt'].src = 'data/sprites/characters/wm/shirt/9_white.png';
	images['pants'].src = 'data/sprites/characters/wm/pants/3_brown.png';
	images['hair/front'].src = 'data/sprites/characters/wm/hair/front/13_black.png';
	images['hair/side'].src = 'data/sprites/characters/wm/hair/side/none.png';

	setInterval(function() {
		context.clearRect ( 0 , 0 , 32 , 64 );
		var sx = 32 * (img_h % 4);
		var sy = 48 * img_v;
		for (key in images) {
			// drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			context.drawImage(images[key], sx, sy, 32, 48, 0, 0, 32, 48);
		}
		img_h++;
		if (img_h > 11) {
			img_h = 0;
			img_v++;
			if (img_v > 3) {
				img_v = 0;
			}
		}
	}, 150);
});

*/