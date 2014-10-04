function noPressButton() {
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
	
	//Boton para ver los items que tiene equipados la PERSONA
	$("#btnPers").click(function() {
		noPressButton();
		if ($("#btnPers").attr("src") != "../images/iconos/btn_personajeOVER.png") {
			$("#btnPers").attr("src", "../images/iconos/btn_personajeOVER.png");
		} else {
			$("#btnPers").attr("src", "../images/iconos/btn_personaje.png");
		}
	});

	//Boton para ver el inventario de items
	$("#btnInve").click(function() {
		noPressButton();
		if ($("#btnInve").attr("src") != "../images/iconos/btn_inventarioOVER.png") {
			$("#btnInve").attr("src", "../images/iconos/btn_inventarioOVER.png");
		} else {
			$("#btnInve").attr("src", "../images/iconos/btn_inventario.png");
		}
	});
	
	//Boton para mostrar el listado de misiones
	$("#btnMisi").click(function() {
		noPressButton();
		if ($("#btnMisi").attr("src") != "../images/iconos/btn_misionOVER.png") {
			$("#btnMisi").attr("src", "../images/iconos/btn_misionOVER.png");
		} else {
			$("#btnMisi").attr("src", "../images/iconos/btn_mision.png");
		}
	});

	//Boton para ver el listado de logros obtenidos
	$("#btnLogr").click(function() {
		noPressButton();
		if ($("#btnLogr").attr("src") != "../images/iconos/btn_logrosOVER.png") {
			$("#btnLogr").attr("src", "../images/iconos/btn_logrosOVER.png");
		} else {
			$("#btnLogr").attr("src", "../images/iconos/btn_logros.png");
		}
	});
	
	//Boton para ver los talentos	
	$("#btnTale").click(function() {
		noPressButton();
		if ($("#btnTale").attr("src") != "../images/iconos/btn_talentosOVER.png") {
			$("#btnTale").attr("src", "../images/iconos/btn_talentosOVER.png");
		} else {
			$("#btnTale").attr("src", "../images/iconos/btn_talentos.png");
		}
	});

});
