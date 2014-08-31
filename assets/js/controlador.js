var miAplicacion = angular.module('formLogin', []);
miAplicacion.controller('controlForm', ['$scope', function($scope) {
      $scope.lista = [
         {texto: 'Femenino', seleccionado: true},
         {texto: 'Masculino', seleccionado: false}
      ];
 }]);