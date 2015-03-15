//var app = angular.module('juegoapl', ['ngSailsBind']);
app.controller("inventarioContr", ['$scope', "$sailsBind",
function inventarioContr($scope, $sailsBind) {
	//    $sailsBind.bind("api/inventario", $scope);

	$scope.inventario = [{
		"id" : 3,
		"nombreItem" : "capa dorada",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/capa/1.png"
	}, {
		"id" : 8,
		"nombreItem" : "espada burocratica",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/arma/1.png"
	}, {
		"id" : 12,
		"nombreItem" : "anillo magico",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/anillo/1.png"
	}, {
		"id" : 15,
		"nombreItem" : "botas",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/pies/1.png"
	}, {
		"id" : 15,
		"nombreItem" : "libro",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/nep/15_libro.png"
	}, {
		"id" : 18,
		"nombreItem" : "manzana",
		"cant" : 1,
		"acumulable" : true,
		"sprite" : "../data/sprites/items/nep/18_manzana.png"
	}, {
		"id" : 21,
		"nombreItem" : "gema",
		"cant" : 2,
		"acumulable" : true,
		"sprite" : "../data/sprites/items/nep/21_gema.png"
	}, {
		"id" : 101,
		"nombreItem" : "pota de mana",
		"cant" : 5,
		"acumulable" : true,
		"sprite" : "../data/sprites/items/nep/101_potaMana.png"
	}, {
		"id" : 102,
		"nombreItem" : "pota de energia",
		"cant" : 5,
		"acumulable" : true,
		"sprite" : "../data/sprites/items/nep/102_potaEnergia.png"
	}, //copia de modelo
	{
		"id" : 3,
		"nombreItem" : "capa dorada",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/capa/1.png"
	}, {
		"id" : 8,
		"nombreItem" : "espada burocratica",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/arma/1.png"
	}, {
		"id" : 12,
		"nombreItem" : "anillo magico",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/anillo/2.png"
	}, {
		"id" : 15,
		"nombreItem" : "botas",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/pies/1.png"
	}, {
		"id" : 15,
		"nombreItem" : "libro",
		"cant" : 1,
		"acumulable" : false,
		"sprite" : "../data/sprites/items/nep/15_libro.png"
	}, {
		"id" : 18,
		"nombreItem" : "manzana",
		"cant" : 1,
		"acumulable" : true,
		"sprite" : "../data/sprites/items/nep/18_manzana.png"
	}, {
		"id" : 21,
		"nombreItem" : "gema",
		"cant" : 2,
		"acumulable" : true,
		"sprite" : "../data/sprites/items/nep/21_gema.png"
	}, {
		"id" : 101,
		"nombreItem" : "pota de mana",
		"cant" : 5,
		"acumulable" : true,
		"sprite" : "../data/sprites/items/nep/101_potaMana.png"
	}, {
		"id" : 102,
		"nombreItem" : "pota de energia",
		"cant" : 5,
		"acumulable" : true,
		"sprite" : "../data/sprites/items/nep/102_potaEnergia.png"
	}];
}]);


/**
 * Desactiva la visualizacion de todos los paneles de la botonera (inventario, misiones, logros, talentos, personaje)
 * @method noPressBtn
 * @return 
 */
function noPressBtn() {
	$("#btnPers").attr("src", "../images/iconos/btn_personaje.png");
	$("#btnInve").attr("src", "../images/iconos/btn_inventario.png");
	$("#btnMisi").attr("src", "../images/iconos/btn_mision.png");
	$("#btnLogr").attr("src", "../images/iconos/btn_logros.png");
	$("#btnTale").attr("src", "../images/iconos/btn_talentos.png");
	$("#inv").hide();
	$("#mis").hide();
	$("#log").hide();
	$("#tal").hide();
	$("#per").hide();
}

function agregarQuest(){
	//Se deberia poner un atributo de la lista de misiones del personaje como "quest tomada =1", que sea 0 si esta tomada...y 2 si esta terminada	
}

// Esto se ejecuta al terminar de cargar la pagina
$(function() {

	//Habilitar o Deshabilitar audio
	$("#audio").click(function() {
		if (me.audio.getCurrentTrack() === "snow") {
			$("#audio").attr("src", "../images/iconos/audio_OFF.png");
			me.audio.stopTrack();
		} else {
			$("#audio").attr("src", "../images/iconos/audio_on.png");
			me.audio.playTrack("snow", 0.7);
		}
	});
	
	$("#sfx").click(function() {
		if ( $("#sfx").attr('src')  === "../images/iconos/sfx_on.png") {
			$("#sfx").attr("src", "../images/iconos/sfx_OFF.png");
			//me.audio.unload("switch26");
			me.audio.mute("switch26");
		} else {
			$("#sfx").attr("src", "../images/iconos/sfx_on.png");
			me.audio.unmute("switch26");
		}
	});

	/* 	BOTONERA DEL JUEGO
	*/

	//Boton para ver el inventario de items
	$("#btnInve").click(function() {
		if ($("#btnInve").attr("src") != "../images/iconos/btn_inventarioOVER.png") {
			noPressBtn();
			$("#btnInve").attr("src", "../images/iconos/btn_inventarioOVER.png");
			me.audio.play("switch26", false);
			$("#inv").show();
		} else {
			$("#btnInve").attr("src", "../images/iconos/btn_inventario.png");
			$("#inv").hide();
		}
	});

	//Boton para mostrar el listado de misiones
	$("#btnMisi").click(function() {
		if ($("#btnMisi").attr("src") != "../images/iconos/btn_misionOVER.png") {
			noPressBtn();
			$("#btnMisi").attr("src", "../images/iconos/btn_misionOVER.png");
			me.audio.play("switch26", false);
			$("#mis").show();
		} else {
			$("#btnMisi").attr("src", "../images/iconos/btn_mision.png");
			$("#mis").hide();
		}
	});

	//Boton para ver los items que tiene equipados la PERSONA
	$("#btnPers").click(function() {
		if ($("#btnPers").attr("src") != "../images/iconos/btn_personajeOVER.png") {
			noPressBtn();
			$("#btnPers").attr("src", "../images/iconos/btn_personajeOVER.png");
			me.audio.play("switch26", false);
			$("#per").show();
		} else {
			$("#btnPers").attr("src", "../images/iconos/btn_personaje.png");
			$("#per").hide();
		}
	});

	//Boton para ver el listado de logros obtenidos
	$("#btnLogr").click(function() {
		if ($("#btnLogr").attr("src") != "../images/iconos/btn_logrosOVER.png") {
			noPressBtn();
			$("#btnLogr").attr("src", "../images/iconos/btn_logrosOVER.png");
			me.audio.play("switch26", false);
			$("#log").show();
		} else {
			$("#btnLogr").attr("src", "../images/iconos/btn_logros.png");
			$("#log").hide();
		}
	});

	//Boton para ver los talentos
	$("#btnTale").click(function() {
		if ($("#btnTale").attr("src") != "../images/iconos/btn_talentosOVER.png") {
			noPressBtn();
			$("#btnTale").attr("src", "../images/iconos/btn_talentosOVER.png");
			me.audio.play("switch26", false);
			$("#tal").show();
		} else {
			$("#btnTale").attr("src", "../images/iconos/btn_talentos.png");
			$("#tal").hide();
		}
	});
	
	//Boton para cerrar Ventana de Quest
	$("#cerrar").click(function() {
		$("#quest").hide();
	});
	
	//Boton Aceptar para agregar la Quest al panel de misiones
	$("#aceptar").click(function() {
		$("#quest").hide();
		agregarQuest();
	});
	
	//Boton desplazar el chat
	$("#glyChat").click(function() {
		var e = $("#ChatGame");
		if(e.css('height')!='30px')
			e.animate({'height': '30px'},1500);
		else
			e.animate({'height': '154px'},1500);
	});
		

});
