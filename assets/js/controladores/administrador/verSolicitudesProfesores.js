/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verSolicitudesProfesoresController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.aceptarProfesorEnInstitucion = function (user,index) {

        $.get("/api/institucion_x_user/set_situacion",
            {
                institucion_x_user : user.institucion_x_user[0].id,
                situacion:"profesor",
                institucion: $scope.$parent.institucionActual.id
            },
            function (err,detail) {
                if(detail != "success"){
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.institucionActual.profesores_situacionAceptado.push(user);
                $scope.$parent.institucionActual.profesores_situacionEspera.splice(index, 1);
                $scope.$parent.institucionesCargadas = false;
                toastr.info('Profesor aceptado.');
            }
        );
    };

    $scope.rechazarProfesorEnInstitucion = function(user,index) {

        $.get("/api/institucion_x_user/set_situacion",
            {
                institucion_x_user : user.institucion_x_user[0].id,
                situacion:"rechazadoProfesor",
                institucion: $scope.$parent.institucionActual.id
            },
            function (err,detail) {
                if(detail != "success"){
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.institucionActual.profesores_situacionRechazado.push(user);
                $scope.$parent.institucionActual.profesores_situacionEspera.splice(index, 1);
                $scope.$parent.institucionesCargadas = false;
                toastr.info('Profesor rechazado.');
            }
        );
    };



}]);
