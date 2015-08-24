/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verSolicitudesController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if($scope.$parent.claseActual.activa === false){
        window.location.href = '#/clasesProfesor';
    }



    /**
     * Description
     * @method aceptarAlumnoEnClase
     * @param {} user
     * @param {} index
     * @return 
     */
    $scope.aceptarAlumnoEnClase = function (user,index) {
        if (!confirm('¿Está seguro que desea habilitar a '+user.apellido+' '+user.nombre+' '+" como alumno para que pueda realizar misiones y utilizar el chat?")){
            return;
        }

        $.get("/api/clase_x_user/set_situacion",
            {
                clase_x_user: user.clase_x_user[0].id,
                situacion: "aceptado",
                clase: $scope.$parent.claseActual.id
            },
            function (err, detail) {
                if (detail != "success") {
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.claseActual.users_situacionAceptado.push(user);
                $scope.$parent.claseActual.users_situacionEspera.splice(index, 1);
                $scope.$parent.clasesCargadas = false;
                toastr.success('Usuario Aceptado!');
            }
        );

    };

    /**
     * Description
     * @method rechazarAlumnoEnClase
     * @param {} user
     * @param {} index
     * @return 
     */
    $scope.rechazarAlumnoEnClase = function(user,index) {

        if (!confirm('¿Está seguro que desea rechazar la solicitud de '+user.apellido+' '+user.nombre+' '+" como alumno para que pueda realizar misiones y utilizar el chat?")){
            return;
        }

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
                toastr.warning('Solicitud de usuario eliminada!');
            }
        );
    };





}]);
