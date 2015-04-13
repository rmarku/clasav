/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('solicitarInstitucionController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.instituciones = [];
    $scope.index_institucion_seleccionada = '';

    $.get('/api/institucion/get_institucionesHabilitadas', function (instituciones) {
        $scope.instituciones = instituciones;
        $scope.index_institucion_seleccionada = 0;
        $scope.$apply();
    });


    $scope.subirSolicitudInstitucion = function () {

        if($scope.instituciones.length === 0){
            toastr.error('No existen instituciones disponibles.');
            return;
        }else
        if($scope.index_institucion_seleccionada === ''){
            toastr.error('No hay ninguna institución seleccionada.');
            return;
        }

        var institucion_seleccionada = $scope.instituciones[$scope.index_institucion_seleccionada];

        io.socket.get("/api/institucion/solicitarInstitucion",
            {
                institucionID: institucion_seleccionada.id
            },
            function (data) {
                toastr.info('Solicitud de institución enviada.');
                $scope.$parent.misInstitucionesSituacionEspera.push(institucion_seleccionada);
                $scope.$apply();
                window.location.href = '#/institucionesProfesor';
            });
    };




}]);

