/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('detallesPersonajeController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if(Object.keys($scope.$parent.misClases).length === 0){
        window.location.href = '#/clasesAlumno';
    }


    $scope.miPersonaje = {};
    $scope.mostrarLogrosClase = [];

    $scope.get_personaje = function(id) {
        $.get('/api/personaje?duenio='+id, function (pj) {
            $scope.miPersonaje = pj[0];

            $scope.$parent.misClases.forEach(function (clase){
                $scope.mostrarLogrosClase[clase.id] = false;
            });

            $scope.$apply();
        });
    };



    //Esto es solo por si recarga la pagina con F5
    if(typeof $scope.user.tipo  === 'undefined'){
        $scope.$parent.getUser().then(function(user){
            $scope.get_personaje(user.id);

        });
    }
    else
        $scope.get_personaje($scope.$parent.user.id);

}]);

