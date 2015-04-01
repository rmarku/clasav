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
        template: JST["assets/templates/gmisiones.html"],
        controller: 'misionesGuia'
    });
    $routeProvider.when('/coliseo', {
        template: JST["assets/templates/coliseo.html"],
        controller: 'preguntaColiseo'
    });
//    $routeProvider.when('/game', {
//        template: JST["assets/templates/game.html"],
//        controller: 'gamePageController'
//    });
    $routeProvider.when('/personaje', {
        template: JST["assets/templates/personaje.html"],
        controller: 'personajeController'
    });
    
    //<!--MINIJUEGO-->
    $routeProvider.when('/minijuego', {
        template: JST["assets/templates/minijuego.html"]
    });
    
    //    $routeProvider.when('/ranking', {templateUrl: 'partials/user-creation.html', controller: 'UserCreationCtrl'});

    //<!--RUTAS PROFESOR-->
    $routeProvider.when('/clasesProfesor', {
        template: JST["assets/templates/profesor/clases.html"],
        controller: 'clasesProfesorController'
    });
    $routeProvider.when('/crearClase', {
        template: JST["assets/templates/profesor/crearClase.html"],
        controller: 'crearClaseController'
    });
    $routeProvider.when('/crearInstitucion', {
        template: JST["assets/templates/profesor/crearInstitucion.html"],
        controller: 'institucionesProfesorController'
    });
    $routeProvider.when('/verSolicitudes', {
        template: JST["assets/templates/profesor/verSolicitudes.html"],
        controller: 'verSolicitudesController'
    });
    $routeProvider.when('/verAlumnos', {
        template: JST["assets/templates/profesor/verAlumnos.html"],
        controller: 'verAlumnosController'
    });
    //<!--FIN RUTAS PROFESOR-->

    //<!--RUTAS ALUMNO-->
    $routeProvider.when('/clasesAlumno', {
        template: JST["assets/templates/alumno/clases.html"],
        controller: 'clasesAlumnoController'
    });
    $routeProvider.when('/solicitarClase', {
        template: JST["assets/templates/alumno/solicitudClase.html"],
        controller: 'solicitarClaseController'
    });
    //<!--FIN RUTAS ALUMNO-->

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
