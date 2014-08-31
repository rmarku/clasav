var app = angular.module('juegoapl.controllers', []);

app.controller('AlumnoCreateCtl', [ '$scope', 'AlumnosFactory', '$location', function($scope, AlumnosFactory, $location) {

	// callback for ng-click 'createNewUser':
	$scope.createNewAlumno = function() {
		AlumnosFactory.create($scope.alumno);
		// $location.path('/');
	}

} ]);