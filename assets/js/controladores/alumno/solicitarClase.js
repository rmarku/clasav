/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('solicitarClaseController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {


    $scope.get_instituciones = function () {
        $.get('/api/institucion', function (local_instituciones) {

            //$scope.instituciones = local_instituciones;
            $scope.instituciones = $scope.$parent.concatenarDatosInstituciones(local_instituciones);
            $scope.institucion_seleccionada = $scope.instituciones[0];
            $scope.$apply();

            $scope.get_clasesDeInstitucion();
        });
    };

    $scope.get_instituciones();

    $scope.get_clasesDeInstitucion = function () {

        $.get('/api/clase?institucion='+$scope.institucion_seleccionada.id, function (clases) {

            clases = $scope.$parent.definirMapasCentrales(clases);
            clases = $scope.$parent.definirProfesores(clases);

            $scope.clasesDeInstitucion = $scope.$parent.concatenarDatosClases (clases);

            $scope.clase_seleccionada = $scope.clasesDeInstitucion[0];

            $scope.$apply();

            return $scope.clasesDeInstitucion;
        });
    };


    $scope.subirSolicitudClase = function () {

        io.socket.get("/api/clase/solicitarClase",
        {
            claseID: $scope.clase_seleccionada.id
        },
        function (data) {
            toastr.info('Solicitud Enviada');
            $scope.$parent.clasesCargadas = false;
            window.location.href = '#/clasesAlumno';
        });
    };





}]);
