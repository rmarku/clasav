//creamos nuestro modulo llamado app
var app = angular.module("app", []);

//hacemos el ruteo de nuestra aplicacion
app.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl : "templates/index.html"
	})
	//esta es la forma de decirle a angular que vamos a pasar una variable por la url
	.when('/info/:id', {
      templateUrl : "info.html",
     controller : "infoController"
    })
	.when("/login", {
		title: 'Añadir usuario',
		templateUrl : "login.html",
		controller : "addController"
	})
 	.otherwise({ redirectTo : "/"})
})
