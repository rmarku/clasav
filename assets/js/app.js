//creamos nuestro modulo llamado app
var app = angular.module("juegoapl", ['juegoapl.services',  'juegoapl.controllers']);

//hacemos el ruteo de nuestra aplicacion
/*
angular.module('ngdemo', ['ngdemo.filters', 'ngdemo.services', 'ngdemo.directives', 'ngdemo.controllers']).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dummy', {templateUrl: 'partials/dummy.html', controller: 'DummyCtrl'});
    $routeProvider.when('/user-list', {templateUrl: 'partials/user-list.html', controller: 'UserListCtrl'});
    $routeProvider.when('/user-detail/:id', {templateUrl: 'partials/user-detail.html', controller: 'UserDetailCtrl'});
    $routeProvider.when('/user-creation', {templateUrl: 'partials/user-creation.html', controller: 'UserCreationCtrl'});
    $routeProvider.otherwise({redirectTo: '/dummy'});
}]);

*/