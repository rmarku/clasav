//creamos nuestro modulo llamado app
var app = angular.module('juegoapl', ['ngSailsBind','ngRoute','toastr']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            template: JST["assets/templates/index.html"]
        });
        $routeProvider.when('/crear-cuenta', {
            template: JST["assets/templates/crear-cuenta.html"],
            controller: 'AlumnoCreateCtl'
        });
        $routeProvider.when('/misiones', {
            template: JST["assets/templates/gmisiones.html"]
        });
        $routeProvider.when('/game', {
            template: JST["assets/templates/game.html"],
            controller: 'gamePageController'
        });
        $routeProvider.when('/personaje', {
            template: JST["assets/templates/personaje.html"],
            controller: 'personajeController'
        });
        //    $routeProvider.when('/ranking', {templateUrl: 'partials/user-creation.html', controller: 'UserCreationCtrl'});
        $routeProvider.otherwise({
            template: JST["assets/templates/index.html"]
        });
    }]);
