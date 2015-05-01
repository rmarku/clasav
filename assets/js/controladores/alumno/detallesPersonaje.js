/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('detallesPersonajeController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.miPersonaje = {};

    $scope.get_personaje = function(id) {
        $.get('/api/personaje?duenio='+id, function (pj) {
            $scope.miPersonaje = pj[0];

            var a = $scope.$parent.misClases;
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

