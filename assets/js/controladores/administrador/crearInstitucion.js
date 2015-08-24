/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('crearInstitucionController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.institucion_nueva = {};

    /**
     * Description
     * @method subirInstitucion
     * @return 
     */
    $scope.subirInstitucion = function () {

        io.socket.get("/api/institucion/crearInstitucionAdministrador",
            {
                "nombre": $scope.institucion_nueva.nombre,
                "pais": $scope.institucion_nueva.pais,
                "provincia": $scope.institucion_nueva.provincia,
                "ciudad": $scope.institucion_nueva.ciudad,
                "direccion": $scope.institucion_nueva.direccion
            }
            ,function (institucionCreada) {
                $scope.$parent.misInstitucionesSituacionEspera.push($scope.institucion_nueva);
                window.location.href = '#/institucionesAdministrador';
                toastr.info('Solicitud de nueva Institución creada');
            }
        );
    };

}]);
