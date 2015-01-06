//Mock de preguntas (hasta que implementemos BD)
app.controller("preguntaColiseo", ['$scope', "$sailsBind",
function preguntaColiseo($scope, $sailsBind) {

	$scope.preguntas = [{
		"id" : 1,
		"materia" : "Matematica",
		"pregunta" : "Como se llama el triangulo que posee 2 lados iguales y uno desigual?",
		"correcta" : "Isoseles",
		"opcionA" : "Escaleno",
		"opcionB" : "Equilatero",
		"opcionC" : "Hipotenusa"
	}, {
		"id" : 1,
		"materia" : "Historia",
		"pregunta" : "¿En que año fue la revolución francesa?",
		"correcta" : "1789",
		"opcionA" : "1790",
		"opcionB" : "1879",
		"opcionC" : "1897"
	}, {
		"id" : 2,
		"materia" : "Matematica",
		"pregunta" : "En las fracciones propias...",
		"correcta" : "el denominador es mayor que el numerador",
		"opcionA" : "el numerador es mayor que el denominador",
		"opcionB" : "el numerador y el denominador no son primos entre si",
		"opcionC" : " numerador o denominador contiene a su vez fracciones"
	}];
}]);
