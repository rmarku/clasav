/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verAlumnosController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if($scope.$parent.claseActual.activa == false){
        window.location.href = '#/clasesProfesor';
    }

    $scope.ver_detallesAlumno = function (index){
        $scope.$parent.alumnoActual = $scope.$parent.claseActual.users_situacionAceptado[index];
        window.location.href = '#/detallesAlumno';
    };





}]);
