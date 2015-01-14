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

	/*$http.get("../api/inventario.json").success(function(response) {
	 $scope.items = response;
	 });*/
}]);


app.controller("personajeInvContr", ['$scope', "$sailsBind","$interval",
function personajeInvContr($scope, $sailsBind, $interval) {
	//    $sailsBind.bind("api/inventario", $scope);
	
	$scope.personajeInv = [{
		"id" : 3,
		"nombreItem" : "capa dorada",
		"parte": "capa",
		"sprite" : "../data/sprites/items/capa/1.png"
	}, {
		"id" : 8,
		"nombreItem" : "espada burocratica",
		"parte": "arma",
		"sprite" : "../data/sprites/items/arma/1.png"
	}, {
		"id" : 12,
		"nombreItem" : "anillo magico",
		"parte": "anillo",
		"sprite" : "../data/sprites/items/anillo/3.png"
	}, {
		"id" : 15,
		"nombreItem" : "botas",
		"parte": "pies",
		"sprite" : "../data/sprites/items/pies/1.png"
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
		if (me.audio.getVolume() !== 0) {
			$("#audio").attr("src", "../images/iconos/audio_OFF.png");
			me.audio.muteAll();
		} else {
			$("#audio").attr("src", "../images/iconos/audio_on.png");
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
			//$.ionSound.play("../data/sfx/switch26.wav");
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

});
