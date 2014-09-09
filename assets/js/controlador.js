var app = angular.module('juegoapl.controllers', ['ngRoute']);

app.controller('AlumnoCreateCtl', [ '$scope', 'AlumnosFactory', '$location', '$location', function($scope, AlumnosFactory, $location,$location) {

	// callback for ng-click 'createNewUser':
	$scope.createNewAlumno = function() {
		AlumnosFactory.create($scope.alumno);
	    $location.path('/personaje');
	}

} ]);