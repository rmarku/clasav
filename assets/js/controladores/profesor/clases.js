/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('clasesProfesorController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.visibilidad_nuevaInstitucion = false;
    $scope.misClases = [];

    $scope.get_clases = function () {
        $.get('/api/clase/get_misClases_conUsers', function (clases) {

            $scope.definirMapaCentral(clases);
            $scope.misClases = clases;
            $scope.$apply();

            return $scope.misClases;
        });
    };

    $scope.get_clases();

    $scope.get_instituciones = function () {
         $.get('/api/institucion', function (local_instituciones) {

             $scope.instituciones = local_instituciones;
             $scope.institucion_seleccionada = $scope.instituciones[0];
             $scope.$apply();

             return $scope.instituciones;
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

    $scope.crearClase = function () {
        window.location.href = '#/crearClase';
    };

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
                window.location.href = '#/clasesProfesor';
        });
    };

    $scope.createInstitucion = function () {
        var deferred = $q.defer();
            $.post("/api/institucion/create", $scope.institucion_nueva,
                function (institucionCreada) {
                    $scope.institucion_seleccionada = institucionCreada;
                    deferred.resolve();
                });
        return deferred.promise;
    };

    $scope.definirMapaCentral= function (misClases) {

        ////Recorremos cada mapa_instancia: solo nos quedamos con el mapa_principal
        misClases.forEach(function(clase){

            clase.mapas_instancias.forEach(function(mapa_instancia){

                if (mapa_instancia.tipo == 'central'){
                    clase.mapaCentral = mapa_instancia;
                    return;
                }
            });
        });

    };

}

]);

