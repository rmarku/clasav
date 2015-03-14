//creamos nuestro modulo llamado app
var app = angular.module('paginaapl', ['ngSailsBind', 'ngRoute', 'toastr']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        template: JST["assets/templates/index.html"]
    });
    $routeProvider.when('/crear-cuenta', {
        template: JST["assets/templates/cuenta.html"],
        controller: 'editUsuario'
    });
    $routeProvider.when('/cuenta', {
        template: JST["assets/templates/cuenta.html"],
        controller: 'editUsuario'
    });
    $routeProvider.when('/misiones', {
        template: JST["assets/templates/gmisiones.html"]
    });
    $routeProvider.when('/coliseo', {
        template: JST["assets/templates/coliseo.html"]
    });
//    $routeProvider.when('/game', {
//        template: JST["assets/templates/game.html"],
//        controller: 'gamePageController'
//    });
    $routeProvider.when('/personaje', {
        template: JST["assets/templates/personaje.html"],
        controller: 'personajeController'
    });
    //    $routeProvider.when('/ranking', {templateUrl: 'partials/user-creation.html', controller: 'UserCreationCtrl'});
    $routeProvider.otherwise({
        template: JST["assets/templates/index.html"]
    });
}
]);

app.config(['toastrConfig', function (toastrConfig) {
    angular.extend(toastrConfig, {
        allowHtml: true,
        closeButton: false,
        closeHtml: '<button>&times;</button>',
        containerId: 'toast-container',
        extendedTimeOut: 1000,
        iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        positionClass: 'toast-top-right',
        tapToDismiss: true,
        timeOut: 7000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });
}]);
