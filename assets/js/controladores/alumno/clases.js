/**
 * Created by Fabricio on 19/03/2015.
 */
app.controller('clasesAlumnoController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

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

    $scope.definirMapaCentral = function (misClases) {

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

