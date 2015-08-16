/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verProfesoresController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if($scope.$parent.institucionActual.activa === false){
        window.location.href = '#/institucionesAdministrador';
    }

    /**
     * Description
     * @method suspenderProfesor
     * @param {} user
     * @param {} index
     * @return 
     */
    $scope.suspenderProfesor = function (user,index){
        if (!confirm('¿Está seguro que desea deshabilitar a '+user.apellido+' '+user.nombre+' '+" como profesor?")){
            return;
        }

        $.get("/api/institucion_x_user/set_situacion",
            {
                institucion_x_user: user.institucion_x_user[0].id,
                situacion: "esperaProfesor",
                clase: $scope.$parent.institucionActual.id
            },
            function (err, detail) {
                if (detail != "success") {
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.institucionActual.profesores_situacionEspera.push(user);
                $scope.$parent.institucionActual.profesores_situacionAceptado.splice(index, 1);
                $scope.$parent.institucionesCargadas = false;
                toastr.warning('El profesor ha sido suspendido y se encuentra nuevamente en espera');
            }
        );
    };

}]);
