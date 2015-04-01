var cancho = 900;
var calto = 400;
var ctx;
var primeracoincidencia = true;
var primeracarta = -1;
var segundacarta;
var colordorso = "#fb9e25";
var colormesa = "rgb(255,255,255)";
var baraja = [];
var primersx = 30;
var primersy = 50;
var margin = 30;
var anchocarta = 100;
var altocarta = 100;
var tid;
var coincide;
var tiempoinicio;
var contador = 0;
var pares = [["../images/minijuegos/figuras/circulo.jpg", "../images/minijuegos/figuras/circulo2.jpg"], 
			["../images/minijuegos/figuras/rectangulo.jpg", "../images/minijuegos/figuras/rectangulo2.jpg"], 
			["../images/minijuegos/figuras/romboide.jpg", "../images/minijuegos/figuras/romboide2.jpg"], 
			["../images/minijuegos/figuras/trapecio.jpg", "../images/minijuegos/figuras/trapecio2.jpg"], 
			["../images/minijuegos/figuras/triangulo.jpg", "../images/minijuegos/figuras/triangulo2.jpg"]];

//baraja guarda info en las cartas: la localización y dimensiones, el src para la foto
//y la info de identificación
//la info es configurada usando el array de arrays en la función hacerbaraja
function Carta(sx, sy, sancho, salto, img, info) {
	this.sx = sx;
	this.sy = sy;
	this.sancho = sancho;
	this.salto = salto;
	this.info = info;
	this.img = img;
	this.dibujar = dibujardorso;
}

//genera baraja de cartas 6 pares de polígonos
function hacerbaraja() {
	var i;
	var cartaa;
	var cartab;
	var elecciona;
	var eleccionb;
	var cx = primersx;
	var cy = primersy;
	for ( i = 0; i < pares.length; i++) {
		elecciona = new Image();
		elecciona.src = pares[i][0];
		cartaa = new Carta(cx, cy, anchocarta, altocarta, elecciona, i);
		baraja.push(cartaa);
		eleccionb = new Image();
		eleccionb.src = pares[i][1];
		cartab = new Carta(cx, cy + altocarta + margin, anchocarta, altocarta, eleccionb, i);
		baraja.push(cartab);
		cx = cx + anchocarta + margin;
		cartaa.dibujar();
		cartab.dibujar();
	}

}

function barajar() {
	//codificado para parecerse a como se barajan las cartas en los juegos reales
	//alterna cambiando la información: la imagen y la información indicando la coincidencia
	var i;
	var k;
	var contieneinfo;
	var contieneimg;
	var dl = baraja.length;
	var nt;
	for ( nt = 0; nt < 3 * dl; nt++) {//hacer el intercambio 3 veces baraja.length
		i = Math.floor(Math.random() * dl);
		k = Math.floor(Math.random() * dl);
		contieneinfo = baraja[i].info;
		contieneimg = baraja[i].img;
		baraja[i].info = baraja[k].info;
		baraja[i].img = baraja[k].img;
		baraja[k].info = contieneinfo;
		baraja[k].img = contieneimg;
	}
}

function dibujardorso() {
	ctx.fillStyle = colordorso;
	ctx.fillRect(this.sx, this.sy, this.sancho, this.salto);
}

function elegir(ev) {
	var out;
	var mx;
	var my;
	var eleccion1;
	var eleccion2;
	if (ev.layerX || ev.layerX == 0) {
		mx = ev.layerX;
		my = ev.layerY;
	}else if (ev.offsetX || ev.offsetX == 0) { // Opera
    	mx = ev.offsetX;
    	my = ev.offsetY;
  	}
	var i;
	for ( i = 0; i < baraja.length; i++) {
		var carta = baraja[i];
		if (carta.sx >= 0)//este es el modo de evitar chequear para pulsar en este espacio
			if ((mx > carta.sx) && (mx < carta.sx + carta.sancho) && (my > carta.sy) && (my < carta.sy + carta.salto)) {
				//comprobar que no está pulsando en la primera carta
				if ((primeracoincidencia) || (i != primeracarta)) {
					break;
				}
			}
	}
	if (i < baraja.length) {//pulsado en una carta
		if (primeracoincidencia) {
			primeracarta = i;
			primeracoincidencia = false;
			ctx.drawImage(carta.img, carta.sx, carta.sy, carta.sancho, carta.salto);
		} else {
			segundacarta = i;
			ctx.drawImage(carta.img, carta.sx, carta.sy, carta.sancho, carta.salto);
			if (carta.info == baraja[primeracarta].info) {
				coincide = true;
				contador++;
				ctx.fillStyle = colormesa;
				ctx.fillRect(10, 340, 900, 100);
				ctx.fillStyle = colordorso;
				ctx.fillText("Numero de coincidencias hasta ahora: " + String(contador), 10, 360);
				if (contador >= .5 * baraja.length) {
					var nuevo = new Date();
					var nt = Number(nuevo.getTime());
					var segundos = Math.floor(.5 + (nt - tiempoinicio) / 1000);
					ctx.fillStyle = colormesa;
					ctx.fillRect(0, 0, 900, 400);
					ctx.fillStyle = colordorso;
					out = "Has finalizado en " + String(segundos) + " segs.";
					ctx.fillText(out, 10, 100);
					ctx.fillText("Recarga la página para probar de nuevo.", 10, 300);
					return;
				}

			} else {
				coincide = false;
			}
			primeracoincidencia = true;
			tid = setTimeout(flipback, 1000);
		}
	}
}

function flipback() {
	var carta;
	if (!coincide) {
		baraja[primeracarta].dibujar();
		baraja[segundacarta].dibujar();
	} else {
		ctx.fillStyle = colormesa;
		ctx.fillRect(baraja[segundacarta].sx, baraja[segundacarta].sy, baraja[segundacarta].sancho, baraja[segundacarta].salto);
		ctx.fillRect(baraja[primeracarta].sx, baraja[primeracarta].sy, baraja[primeracarta].sancho, baraja[primeracarta].salto);
		baraja[segundacarta].sx = -1;
		baraja[primeracarta].sx = -1;
	}
}

function init() {
	//canvas.width = canvas.width;

	ctx = document.getElementById('canvas').getContext('2d');
	canvas1 = document.getElementById('canvas');
	canvas1.addEventListener('click', elegir, false);
	hacerbaraja();
	barajar();
	ctx.font = "bold 20pt sans-serif";
	ctx.fillText("Pulsa sobre dos cartas para lograr coincidencias.", 10, 20);
	ctx.fillText("Número de coincidencias hasta ahora: 0", 10, 360);
	tiempoinicio = new Date();
	tiempoinicio = Number(tiempoinicio.getTime());
} 