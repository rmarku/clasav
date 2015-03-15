//Mock de la Guia de misiones (hasta que implementemos BD)
app.controller("misionesGuia", ['$scope', "$sailsBind", function misionesGuia($scope, $sailsBind) {

	$scope.misiones = [{
		"id" : 1,
		"mapa" : "Matland",
		"tituloMision" : "Bienvenido a Matland",
		"inicipioNPC" : "Sabio del Mar",
		"finNPC" : "Kristel",
		"textoInicial" : "Hola! Y bienvenido a Matland. Te encontraras que esta isla es muy inmensa. Como primera mision en estos lares, debes dirigirte a 'La Playa Natural', donde comenzaras tus misiones sobre numeros naturales y reportarte con 'Kristel'. Mucha suerte guerrero!",
		"textoFinal" : "Te he estado esperando Guerrero. Toma, aqui tienes tu recompensa. Bien hecho!!. Puedes caminar por esta zona y pedir otras misiones.",
		"recompensa" : "12 oros",
		"minijuego" : false,
		"precondicion" : false
	}, {
		"id" : 2,
		"mapa" : "Matland",
		"tituloMision" : "Playa Natural",
		"inicipioNPC" : "Kregan",
		"finNPC" : "Kregan",
		"textoInicial" : "Hola! Esta es 'La playa Natural', ¡te animas a responder estas sencillas preguntas sobre numeros naturales? Por cada acierto prometo darte 3 monedas de oro.",
		"textoFinal" : "Felicitaciones! Sabia que podias lograrlo. Aqui tienes tu recompensa",
		"recompensa" : "3 oros x pregunta",
		"minijuego" : true, //multiplechoice
		"precondicion" : true //Misiones id=1
	}, {
		"id" : 3,
		"mapa" : "Matland",
		"tituloMision" : "Playa Natural 2",
		"inicipioNPC" : "Kregan",
		"finNPC" : "Kregan",
		"textoInicial" : "Que tal esto: Si me ayudas a ordenar los siguientes numeros en una recta numerica, prometo pagarte. ¿Si?",
		"textoFinal" : "Felicitaciones! Sabia que podias lograrlo. Aqui tienes tu recompensa",
		"recompensa" : "3 oros x pregunta",
		"minijuego" : true, //Drag & drop
		"precondicion" : true //Misiones id=2
	}, {
		"id" : 8,
		"mapa" : "Matland",
		"tituloMision" : "Divisiland",
		"inicipioNPC" : "Dann",
		"finNPC" : "Dann",
		"textoInicial" : "Hola! Estoy algo confundido sobre los Criteos de Divisibilidad. Si me ayudas con mis deberes, luego podremos jugar juntos.",
		"textoFinal" : "Gracias Amigo!! Hacemos un buen duo. Toma tu recompensa",
		"recompensa" : "3 oros x pregunta",
		"minijuego" : true, //Multiple choice
		"precondicion" : true //Misiones id='ultimo de la playa'
	},{
		"id" : 1,
		"mapa" : "Principal",
		"tituloMision" : "Bienvenido!",
		"inicipioNPC" : "Ale",
		"finNPC" : "Ale",
		"textoInicial" : "Bienvenido a 'Clases y Aventuras'. Espero qu disfrutes tu estadia aqui. Para comenzar porque no te diriges con 'Quio', quien ye ayudara a teletransportarte a otros mapas para comenzar tus misiones. Oh! casi lo olvidaba, deberas pagarle 2 oros por cada viaje. Dejame darte algo de dinero................Hola! Y bienvenido a Matland. Te encontraras que esta isla es muy inmensa. Como primera mision en estos lares, debes dirigirte a 'La Playa Natural', donde comenzaras tus misiones sobre numeros naturales y reportarte con 'Kristel'. Mucha suerte guerrero!",
		"textoFinal" : "Suerte en el viaje",
		"recompensa" : "10 oros",
		"minijuego" : false,
		"precondicion" : false
	},{
		"id" : 2,
		"mapa" : "Principal",
		"tituloMision" : "Viaja!",
		"inicipioNPC" : "Quio",
		"finNPC" : "Quio",
		"textoInicial" : "Asi que decidiste emprender tu viaje. Me parece una excelente idea camarada. ¿A que ciudad deseas teletrasportarte?",
		"textoFinal" : "Suerte en el viaje! No lo olvides, en cada ciudad tienes un centro de viaje!",
		"recompensa" : null,
		"minijuego" : false,
		"precondicion" : true //Mision id=1 de mapa principal
	}];
}]);
