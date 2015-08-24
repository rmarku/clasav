/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('institucionesProfesorController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    /**
     * Description
     * @method solicitarInstitucion
     * @return 
     */
    $scope.solicitarInstitucion = function () {
        window.location.href = '#/solicitarInstitucion';
    };

    /**
     * Description
     * @method definirSituacionInstituciones
     * @param {} instituciones
     * @return 
     */
    $scope.definirSituacionInstituciones = function (instituciones) {

        while(instituciones.length){
            var institucion = instituciones.pop();

            if(institucion.institucion_x_user[0].situacion == "profesor" ){

                $scope.$parent.misInstituciones.push(institucion);
                continue;
            }else

            if(institucion.institucion_x_user[0].situacion =="esperaProfesor" ){

                $scope.$parent.misInstitucionesSituacionEspera.push(institucion);
                continue;
            }else

            if(institucion.institucion_x_user[0].situacion =="rechazadoProfesor"){

                $scope.$parent.misInstitucionesSituacionRechazado.push(institucion);
                continue;
            }
        }

    };

    /**
     * Description
     * @method get_misInstituciones
     * @return 
     */
    $scope.get_misInstituciones = function () {

        if($scope.$parent.institucionesCargadas === true){
            return;
        }
        $scope.$parent.misInstituciones                                     = [];
        $scope.$parent.misInstitucionesSituacionEspera                      = [];
        $scope.$parent.misInstitucionesSituacionRechazado                   = [];

        io.socket.get('/api/institucion/get_misInstituciones_conUsers', function (instituciones) {

            $scope.definirSituacionInstituciones(instituciones);
            $scope.$parent.institucionesCargadas = true;
            $scope.$apply();
        });
    };

    $scope.get_misInstituciones();
}]);

