/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('crearClaseController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.visibilidad_nuevaInstitucion = false;

    $scope.get_instituciones = function () {
        $.get('/api/institucion', function (local_instituciones) {

            $scope.instituciones = local_instituciones;
            $scope.institucion_seleccionada = $scope.instituciones[0];
            $scope.$apply();
        });
    };
    $scope.get_instituciones();

    $scope.get_mapas = function () {
        $.get('/api/mapa_generico?tipo=central', function (local_mapas) {
            $scope.mapas = local_mapas;
            $scope.mapa_seleccionado = $scope.mapas[0];
            $scope.$apply();
            return $scope.mapas;
        });
    };
    $scope.get_mapas();

    $scope.set_visibilidad_nuevaInstitucion = function (state) {
        $scope.visibilidad_nuevaInstitucion = state;
    };

    $scope.subirClase = function () {

        if($scope.visibilidad_nuevaInstitucion){
            $scope.createInstitucion().then(function (returned_data) {
                $scope.createClase();
            });
        }
        else{
            $scope.createClase();
        }
    };

    $scope.createClase = function () {
        $.get("/api/clase/crearClaseProfesor",
            {
                nombre:             $scope.clase.nombre,
                mapa_genericoID:    $scope.mapa_seleccionado.id,
                institucionID:      $scope.institucion_seleccionada.id
            },
            function (data) {
                toastr.info('Nueva Clase Creada');
                $scope.$parent.clasesCargadas = false;
                window.location.href = '#/clasesProfesor';
            });
    };


    $scope.createInstitucion = function () {
        var deferred = $q.defer();
        $.post("/api/institucion/create", $scope.institucion_nueva,
            function (institucionCreada) {
                $scope.institucion_seleccionada = institucionCreada;
                deferred.resolve();
            }
        );
        return deferred.promise;
    };


}]);
