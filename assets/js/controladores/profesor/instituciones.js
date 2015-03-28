/**
 * Created by Fabricio on 18/03/2015.
 */
app.controller('institucionesProfesorController', ['$scope', '$rootScope', "toastr",'$location', function ($scope, $rootScope, toastr, $location) {

    $scope.institucion_nueva = "";

    $scope.subirInstitucion = function () {
        window.location.href = '#/crearClase';
    };

}
]);
