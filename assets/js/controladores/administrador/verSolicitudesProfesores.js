/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verSolicitudesProfesoresController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if($scope.$parent.institucionActual.activa === false){
        window.location.href = '#/institucionesAdministrador';
    }

    /**
     * Description
     * @method aceptarProfesorEnInstitucion
     * @param {} user
     * @param {} index
     * @return 
     */
    $scope.aceptarProfesorEnInstitucion = function (user,index) {

        if (!confirm('¿Está seguro que desea habilitar a '+user.apellido+' '+user.nombre +" como profesor para gestionar alumnos?")){
            return;
        }

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
                toastr.success('Profesor aceptado');
            }
        );
    };

    /**
     * Description
     * @method rechazarProfesorEnInstitucion
     * @param {} user
     * @param {} index
     * @return 
     */
    $scope.rechazarProfesorEnInstitucion = function(user,index) {

        if (!confirm('¿Está seguro que desea rechazar la solicitud de '+user.apellido+' '+user.nombre +" como profesor para gestionar alumnos?")){
            return;
        }

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
                toastr.warning('Solicitud de profesor eliminada');
            }
        );
    };



}]);
