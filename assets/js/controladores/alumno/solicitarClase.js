/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('solicitarClaseController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if($scope.$parent.clasesCargadas === false){
        window.location.href = '#/clasesAlumno';
    }

    $scope.get_instituciones = function () {
        $.get('/api/institucion/get_institucionesConProfesores', function (local_instituciones) {

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

            clases = $scope.quitarClasesSolicitadas(clases);
            clases = $scope.$parent.definirMapasCentrales(clases);
            clases = $scope.$parent.definirProfesores(clases);

            $scope.clasesDeInstitucion = $scope.$parent.concatenarDatosClases (clases);

            $scope.clase_seleccionada = $scope.clasesDeInstitucion[0];

            $scope.$apply();

            return $scope.clasesDeInstitucion;
        });
    };

    //Quitamos todas las clases en las cuales ya enviamos algun tipo de solicitud
    $scope.quitarClasesSolicitadas = function (clases) {

        var clasesToReturn = [];
        for (var y = 0; y < clases.length; y++) {

            if($scope.claseIdExiste(clases[y].id) === false){
                clasesToReturn.push(clases[y]);
            }
        }
        return clasesToReturn;
    };


    $scope.claseIdExiste = function (id){

        for (var y = 0; y < $scope.$parent.misClases.length; y++) {

            if($scope.$parent.misClases[y].id == id){
                return true;
            }
        }

        for (var x = 0; x < $scope.$parent.misClasesSituacionEspera.length; x++) {

            if($scope.$parent.misClasesSituacionEspera[x].id == id){
                return true;
            }
        }

        for (var w = 0; w < $scope.$parent.misClasesSituacionRechazado.length; w++) {

            if($scope.$parent.misClasesSituacionRechazado[w].id == id){
                return true;
            }
        }
        return false;

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
