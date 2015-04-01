/**
 * Created by Fabricio on 19/03/2015.
 */
app.controller('clasesAlumnoController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {



    $scope.get_misClases = function () {

        if($scope.$parent.clasesCargadas === true){
            return;
        }

        $scope.$parent.misClases = [];
        $scope.$parent.misClasesSituacionEspera = [];
        $scope.$parent.misClasesSituacionRechazado = [];

        io.socket.get('/api/clase/get_misClases_conUsers',function (clases) {

            clases                      = $scope.$parent.definirMapasCentrales(clases);
            clases                      = $scope.$parent.definirProfesores(clases);
            clases                      = $scope.definirClasesSituacionEspera(clases);
            $scope.$parent.misClases    = clases;
            $scope.$parent.clasesCargadas = true;



            $scope.$apply();
        });
    };

    $scope.get_misClases();


    $scope.solicitarClase = function () {
        window.location.href = '#/solicitarClase';
    };


    $scope.definirClasesSituacionEspera = function (clases) {

        var otherClasesToReturn = [];

        while(clases.length){
            var clase = clases.pop();

            if(clase.clase_x_user[0].situacion == "espera"){

                $scope.$parent.misClasesSituacionEspera.push(clase);
                continue;
            }

            otherClasesToReturn.push(clase);
        }

        return otherClasesToReturn;
    };





}]);

