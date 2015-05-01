/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verProfesoresController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if($scope.$parent.institucionActual.activa === false){
        window.location.href = '#/institucionesAdministrador';
    }



}]);
