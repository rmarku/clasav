//Mock de la Guia de misiones (hasta que implementemos BD)
app.controller("listaLogros", ['$scope', "$sailsBind", function listaLogros($scope, $sailsBind) {

	var config = {};
    /**
     * Description
     * @method scrollbar
     * @param {} direction
     * @param {} autoResize
     * @param {} show
     * @return config
     */
    $scope.scrollbar = function(direction, autoResize, show) {
        config.direction = direction;
        config.autoResize = autoResize;
        config.scrollbar = {
            color: 'rgba(255,128,0, .6)', // Background color of the scrollbar
            show: true
        };

        config.scrollbarContainer = {
            width: 12, // Width of the container surrounding the scrollbar. Becomes visible on hover
      		color: 'rgba(255,171,86, .1)' // Background color of the scrollbar container
        };

        return config;
    };

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
	}, {
		"id" : 7,
		"tituloLogro" : "Guerrero: Gana un duelo en el Coliseo",
		"progresivo" : true,
		"sprite" : "../images/logros/6.png"
	}, {
		"id" : 8,
		"tituloLogro" : "Guerrero: Gana 10 duelos en el Coliseo",
		"progresivo" : true,
		"sprite" : "../images/logros/6.png"
	}, {
		"id" : 9,
		"tituloLogro" : "Guerrero: Gana 100 duelos en el Coliseo",
		"progresivo" : true,
		"sprite" : "../images/logros/6.png"
	}, {
		"id" : 10,
		"tituloLogro" : "Mapa: Completa todas las misiones de Matlandia",
		"progresivo" : true,
		"sprite" : "../images/logros/7.png"
	}, {
		"id" : 10,
		"tituloLogro" : "Mapa: Completa todas las misiones de Geogralandia",
		"progresivo" : true,
		"sprite" : "../images/logros/7.png"
	}];
}]);
