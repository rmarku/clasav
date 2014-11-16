//Mock de la Guia de misiones (hasta que implementemos BD)
app.controller("listaLogros", ['$scope', "$sailsBind",
function listaLogros($scope, $sailsBind) {

	$scope.logros = [{
		"id" : 1,
		"tituloLogro" : "Bienvenido a Clases y Aventuras: Inicio de Juego",
		"progresivo" : false,
		"sprite" : "../images/logros/1.png"
	}, {
		"id" : 2,
		"tituloLogro" : "Ahorrador: Conseguiste 1 oro",
		"progresivo" : true,
		"sprite" : "../images/logros/5.png"
	}, {
		"id" : 3,
		"tituloLogro" : "Ahorrador: Conseguiste 50 oros",
		"progresivo" : true,
		"sprite" : "../images/logros/4.png"
	}, {
		"id" : 4,
		"tituloLogro" : "Misiones: Completaste 1 Mision",
		"progresivo" : true,
		"sprite" : "../images/logros/3.png"
	},{
		"id" : 5,
		"tituloLogro" : "Mision: Completaste 25 misiones",
		"progresivo" : true,
		"sprite" : "../images/logros/3.png"
	}, {
		"id" : 6,
		"tituloLogro" : "Ahorrador: Conseguiste 100 oros",
		"progresivo" : true,
		"sprite" : "../images/logros/4.png"
	}];
}]);
