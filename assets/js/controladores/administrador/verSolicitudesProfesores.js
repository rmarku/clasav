/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verSolicitudesProfesoresController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.aceptarAlumnoEnClase = function (user,index) {

        $.get("/api/clase_x_user/set_situacion",
            {
                clase_x_user : user.clase_x_user[0].id,
                situacion:"aceptado",
                clase: $scope.$parent.claseActual.id
            },
            function (err,detail) {
                if(detail != "success"){
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.claseActual.users_situacionAceptado.push(user);
                $scope.$parent.claseActual.users_situacionEspera.splice(index, 1);
                $scope.$parent.clasesCargadas = false;
                toastr.info('Usuario Aceptado!');
            }
        );
    };

    $scope.rechazarAlumnoEnClase = function(user,index) {

        $.get("/api/clase_x_user/set_situacion",
            {
                clase_x_user : user.clase_x_user[0].id,
                situacion:"rechazado",
                clase: $scope.$parent.claseActual.id
            },
            function (err,detail) {
                if(detail != "success"){
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.claseActual.users_situacionRechazado.push(user);
                $scope.$parent.claseActual.users_situacionEspera.splice(index, 1);
                $scope.$parent.clasesCargadas = false;
                toastr.info('Usuario Aceptado!');
            }
        );
    };





}]);
