function noPressBtn() {
	$("#btnPers").attr("src", "../images/iconos/btn_personaje.png");
	$("#btnInve").attr("src", "../images/iconos/btn_inventario.png");
	$("#btnMisi").attr("src", "../images/iconos/btn_mision.png");
	$("#btnLogr").attr("src", "../images/iconos/btn_logros.png");
	$("#btnTale").attr("src", "../images/iconos/btn_talentos.png");
}

// Esto se ejecuta al terminar de cargar la pagina
$(function() {

	//Habilitar o Deshabilitar audio
	$("#audio").click(function() {
		if (me.audio.getVolume() != 0) {
			$("#audio").attr("src", "../images/iconos/audio_OFF.png");
			me.audio.muteAll();
		} else {
			$("#audio").attr("src", "../images/iconos/audio_ON.png");
			me.audio.unmuteAll();
		}
	});

	/* 	BOTONERA DEL JUEGO
	*/

	//Boton para ver el inventario de items
	$("#btnInve").click(function() {

		if ($("#btnInve").attr("src") != "../images/iconos/btn_inventarioOVER.png") {
			noPressBtn();
			$("#btnInve").attr("src", "../images/iconos/btn_inventarioOVER.png");

			for ( j = 381; j > 87; ) {
				for ( i = 0; i < 344; ) {
					$('#inv').prepend('<img class="capaSup" src="../images/iconos/inventario.png" style="margin-top:' + j + 'px; margin-left:' + i + 'px"/>');
					i += 49;
				}
				j -= 49;
			}
			$("#inv").show();
		} else {
			$("#btnInve").attr("src", "../images/iconos/btn_inventario.png");
			$("#inv").hide();
		}
	});

	//Boton para ver los items que tiene equipados la PERSONA
	$("#btnPers").click(function() {
		if ($("#btnPers").attr("src") != "../images/iconos/btn_personajeOVER.png") {
			noPressBtn();
			$("#btnPers").attr("src", "../images/iconos/btn_personajeOVER.png");
			$("#inv").hide();
		} else {
			$("#btnPers").attr("src", "../images/iconos/btn_personaje.png");
		}
	});

	//Boton para mostrar el listado de misiones
	$("#btnMisi").click(function() {
		if ($("#btnMisi").attr("src") != "../images/iconos/btn_misionOVER.png") {
			noPressBtn();
			$("#btnMisi").attr("src", "../images/iconos/btn_misionOVER.png");
			$("#inv").hide();
		} else {
			$("#btnMisi").attr("src", "../images/iconos/btn_mision.png");
		}
	});

	//Boton para ver el listado de logros obtenidos
	$("#btnLogr").click(function() {
		if ($("#btnLogr").attr("src") != "../images/iconos/btn_logrosOVER.png") {
			noPressBtn();
			$("#btnLogr").attr("src", "../images/iconos/btn_logrosOVER.png");
			$("#inv").hide();
		} else {
			$("#btnLogr").attr("src", "../images/iconos/btn_logros.png");
		}
	});

	//Boton para ver los talentos
	$("#btnTale").click(function() {
		if ($("#btnTale").attr("src") != "../images/iconos/btn_talentosOVER.png") {
			noPressBtn();
			$("#btnTale").attr("src", "../images/iconos/btn_talentosOVER.png");
			$("#inv").hide();
		} else {
			$("#btnTale").attr("src", "../images/iconos/btn_talentos.png");
		}
	});

});
