/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('misionesClaseController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {


    $scope.logrosDisponibles_claseActual = [];
    $scope.tieneLogro = [];
    $scope.habilitarTabla = false;
    $scope.variable = true;

    $scope.get_misionesClaseActual = function () {

        $.get('/api/logro?mapa_generico='+$scope.$parent.claseActual.mapaCentral.mapa_generico, function (logros) {

            $scope.logrosDisponibles_claseActual = logros;
            $scope.$apply();
        });
    };

    if($scope.$parent.claseActual.activa === false){
        window.location.href = '#/clasesProfesor';
    }
    else{
        if(window.location.href == 'http://localhost:1337/#/misionesClase') {
            $scope.get_misionesClaseActual();
        }

    }


    $scope.ver_detallesLogro = function (index){
        $scope.$parent.logroActual = {mision:{}};
        $scope.$parent.logroActual = $scope.logrosDisponibles_claseActual[index];
        $scope.get_misionDeLogroActual($scope.$parent.logroActual.id).then(function(data){
            $scope.$parent.logroActual.mision = data;
            window.location.href = '#/detallesLogro';
        });

    };

    $scope.volver_aMisionesClase = function () {
        window.location.href = '#/misionesClase';
    };

    $scope.get_misionDeLogroActual = function (id) {

        var deferred = $q.defer();

        $.get('/api/misiones?logro='+id, function (mision) {
            deferred.resolve(mision[0]);
        });

        return deferred.promise;
    };

    $scope.set_user_tieneLogro = function () {

        var counter = 0;

        $scope.$parent.claseActual.users_situacionAceptado.forEach(function(alumno) {

            $.get('/api/personaje?duenio='+alumno.id, function (pj1) {

                pj = pj1[0];
                $scope.tieneLogro[pj.duenio.id] = false;

                for (var y = 0; y < pj.logros.length; y++) {
                    var logro = pj.logros[y];

                    if(logro.id == $scope.$parent.logroActual.id){
                        $scope.tieneLogro[pj.duenio.id] = true;
                        break;
                    }
                }

                counter++;

                if(counter == $scope.$parent.claseActual.users_situacionAceptado.length){
                    $scope.habilitarTabla = true;
                    $scope.$apply();
                }

            });

        });

    };

    if(window.location.href == 'http://localhost:1337/#/detallesLogro') {
        $scope.set_user_tieneLogro();
    }



}]);

