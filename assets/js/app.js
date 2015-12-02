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
    $routeProvider.when('/cuenta_remota', {
        template: JST["assets/templates/cuenta_remota.html"],
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
    $routeProvider.when('/acercaDe', {
        template: JST["assets/templates/acercade.html"]
    });
    $routeProvider.when('/pregF', {
        template: JST["assets/templates/pregF.html"]
    });
    $routeProvider.when('/pressKit', {
        template: JST["assets/templates/pressKit.html"]
    });

    //    $routeProvider.when('/ranking', {templateUrl: 'partials/user-creation.html', controller: 'UserCreationCtrl'});


    //<!--RUTAS PROFESOR-->
    $routeProvider.when('/clasesProfesor', {
        template: JST["assets/templates/profesor/clases.html"],
        controller: 'clasesProfesorController'//,
        //   activetab: 'dashboard'
    });
    $routeProvider.when('/crearClase', {
        template: JST["assets/templates/profesor/crearClase.html"],
        controller: 'crearClaseController'
    });
    $routeProvider.when('/verSolicitudes', {
        template: JST["assets/templates/profesor/verSolicitudes.html"],
        controller: 'verSolicitudesController'
    });
    $routeProvider.when('/verAlumnos', {
        template: JST["assets/templates/profesor/verAlumnos.html"],
        controller: 'verAlumnosController'
    });
    $routeProvider.when('/solicitarInstitucion', {
        template: JST["assets/templates/profesor/solicitarInstitucion.html"],
        controller: 'solicitarInstitucionController'
    });
    $routeProvider.when('/institucionesProfesor', {
        template: JST["assets/templates/profesor/instituciones.html"],
        controller: 'institucionesProfesorController'
    });
    $routeProvider.when('/detallesAlumno', {
        template: JST["assets/templates/profesor/detallesAlumno.html"],
        controller: 'detallesAlumnoController'
    });
    $routeProvider.when('/misionesClase', {
        template: JST["assets/templates/profesor/misionesClase.html"],
        controller: 'misionesClaseController'
    });
    $routeProvider.when('/detallesLogro', {
        template: JST["assets/templates/profesor/detallesLogro.html"],
        controller: 'misionesClaseController'
    });
    $routeProvider.when('/preguntasColiseo', {
        template: JST["assets/templates/profesor/preguntasColiseo.html"],
        controller: 'preguntasColiseoController'
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
    $routeProvider.when('/detallesPersonaje', {
        template: JST["assets/templates/alumno/detallesPersonaje.html"],
        controller: 'detallesPersonajeController'
    });
    //<!--FIN RUTAS ALUMNO-->


    //<!--RUTAS ADMINISTRADOR-->
    $routeProvider.when('/institucionesAdministrador', {
        template: JST["assets/templates/administrador/instituciones.html"],
        controller: 'institucionesAdministradorController'
    });
    $routeProvider.when('/crearInstitucion', {
        template: JST["assets/templates/administrador/crearInstitucion.html"],
        controller: 'crearInstitucionController'
    });
    $routeProvider.when('/verProfesores', {
        template: JST["assets/templates/administrador/verProfesores.html"],
        controller: 'verProfesoresController'
    });
    $routeProvider.when('/verSolicitudesProfesores', {
        template: JST["assets/templates/administrador/verSolicitudes.html"],
        controller: 'verSolicitudesProfesoresController'
    });
    //<!--FIN RUTAS ADMINISTRADOR-->


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
