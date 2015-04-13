/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('crearClaseController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.nombreClase = '';

    //Deinifimos la lista de nuestras instituciones
    $scope.misInstitucionesStringConcatenado = $scope.$parent.concatenarDatosInstituciones($scope.$parent.misInstituciones);
    $scope.institucion_seleccionada = $scope.misInstitucionesStringConcatenado[0];

    $scope.get_mapas = function () {
        $.get('/api/mapa_generico?tipo=central', function (local_mapas) {
            local_mapas.forEach(function(mapa) {
                if(mapa.nombre == 'ciudad'){
                    local_mapas.pop();
                    return;
                }

            });
            $scope.mapas = local_mapas;
            $scope.mapa_seleccionado = $scope.mapas[0];
            $scope.$apply();
            return $scope.mapas;
        });
    };
    $scope.get_mapas();


    $scope.subirClase = function () {

        if($scope.nombreClase === ''){
            toastr.error('Indique un nombre para su nueva Clase.');
            return;
        }
        $scope.$parent.clasesCargadas = false;
        $scope.$parent.subscribeToClases = false;

        io.socket.get("/api/clase/crearClaseProfesor",
            {
                nombre:             $scope.nombreClase,
                mapa_genericoID:    $scope.mapa_seleccionado.id,
                institucionID:      $scope.institucion_seleccionada.id
            },
            function (clase) {
                toastr.info('Nueva Clase Creada');
                $scope.$apply();
                window.location.href = '#/clasesProfesor';
            });
    };


}]);
