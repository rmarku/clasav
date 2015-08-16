/**
 * Created by Fabricio on 24/03/2015.
 */
app.controller('verAlumnosController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if($scope.$parent.claseActual.activa === false){
        window.location.href = '#/clasesProfesor';
    }

    /**
     * Description
     * @method ver_detallesAlumno
     * @param {} index
     * @return 
     */
    $scope.ver_detallesAlumno = function (index){
        $scope.$parent.alumnoActual = $scope.$parent.claseActual.users_situacionAceptado[index];
        window.location.href = '#/detallesAlumno';
    };


    /**
     * Description
     * @method suspenderAlumno
     * @param {} user
     * @param {} index
     * @return 
     */
    $scope.suspenderAlumno = function (user,index){
        if (!confirm('¿Está seguro que desea deshabilitar a '+user.apellido+' '+user.nombre+' '+" como alumno?")){
            return;
        }

        $.get("/api/clase_x_user/set_situacion",
            {
                clase_x_user: user.clase_x_user[0].id,
                situacion: "espera",
                clase: $scope.$parent.claseActual.id
            },
            function (err, detail) {
                if (detail != "success") {
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.claseActual.users_situacionEspera.push(user);
                $scope.$parent.claseActual.users_situacionAceptado.splice(index, 1);
                $scope.$parent.clasesCargadas = false;
                toastr.warning('Usuario ha sido suspendido y se encuentra nuevamente en espera');
            }
        );
    };

}]);
