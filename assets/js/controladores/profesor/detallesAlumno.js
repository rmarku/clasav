/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('detallesAlumnoController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if(Object.keys($scope.$parent.alumnoActual).length === 0){
        window.location.href = '#/clasesProfesor';
    }

    $scope.personajeActual = {};

    $.get('/api/personaje?duenio='+$scope.$parent.alumnoActual.id, function (pj) {
        $scope.personajeActual = pj[0];
        $scope.$apply();
    });

    /**
     * Description
     * @method volver_aListaAlumnos
     * @param {} id
     * @return 
     */
    $scope.volver_aListaAlumnos = function (id) {
        window.location.href = '#/verAlumnos';
    };

}]);

