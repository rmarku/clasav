/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('misionesClaseController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {


    $scope.logrosDisponibles_claseActual = [];

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
        $scope.get_misionesClaseActual();
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


}]);

