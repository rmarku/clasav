var app = angular.module('juegoapl.controllers', ['ngRoute']);

app.controller('AlumnoCreateCtl', [ '$scope', 'AlumnosFactory', '$location', '$location', function ($scope, AlumnosFactory, $location, $location) {

    // callback for ng-click 'createNewUser':
    $scope.createNewAlumno = function () {
        AlumnosFactory.create($scope.alumno);
        $location.path('/personaje');
    }

} ]);

app.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    $scope.credentials = {
        email: '',
        contrasena: ''
    };
    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
})

app.controller('gamePageController', function ($scope) {
    $scope.init = function () {
        setTimeout(function (){
            game.onload();
        },1000);
    };
    $scope.init();
})

