/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verSolicitudesController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.aceptarAlumnoEnClase = function (user) {

        $.get("/api/clase_x_user/update/"+user.clase_x_user.id+"?situacion=aceptado",
            function (err,detail) {
                if(detail != "success"){
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.claseActual.users_situacionAceptado.push(user);
                $scope.$parent.claseActual.users_situacionEspera.pop(user);
                $scope.$parent.clasesCargadas = false;
                toastr.info('Usuario Aceptado!');
            }
        );
    };

    $scope.rechazarAlumnoEnClase = function(user) {

        $.get("/api/clase_x_user/update/"+user.clase_x_user.id+"?situacion=rechazado",
            function (err,detail) {
                if(detail != "success"){
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.claseActual.users_situacionRechazado.push(user);
                $scope.$parent.claseActual.users_situacionEspera.pop(user);
                $scope.$parent.clasesCargadas = false;
                toastr.info('Usuario Aceptado!');
            }
        );
    };





}]);
