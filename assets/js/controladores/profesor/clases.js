/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('clasesProfesorController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {


    /**
     * Description
     * @method get_misClases
     * @return 
     */
    $scope.get_misClases = function () {

        if ($scope.$parent.clasesCargadas === true) {
            return;
        }

        $scope.$parent.misClases = [];
        $scope.$parent.misClasesSituacionEspera = [];
        $scope.$parent.misClasesSituacionRechazado = [];

        io.socket.get('/api/clase/get_misClases_conUsers', function (clases) {

            clases = $scope.$parent.definirMapasCentrales(clases);
            clases = $scope.$parent.definirSituacionUsers(clases);
            $scope.$parent.misClases = clases;
            $scope.$parent.clasesCargadas = true;

            $scope.$apply();
        });


    };

    $scope.get_misClases();

    /**
     * Description
     * @method crearClase
     * @return 
     */
    $scope.crearClase = function () {
        if($scope.$parent.misInstituciones.length === 0){
            toastr.error('Ahún no tiene una institución que lo habilite a dar clases.');
            return;
        }
        window.location.href = '#/crearClase';
    };


    /**
     * Description
     * @method set_claseActual
     * @param {} index
     * @return 
     */
    $scope.set_claseActual = function (index) {
        $scope.$parent.claseActual = $scope.$parent.misClases[index];
        $scope.$parent.claseActual.activa = true;

        if($scope.$parent.claseActual.users_situacionAceptado.length > 0 ){
            window.location.href = '#/verAlumnos';
        }
        else{
            window.location.href = '#/verSolicitudes';
        }

        toastr.info('Clase Actual: '+$scope.$parent.claseActual.nombre);
    };


    //////////////////// Funciones para obtener instituciones  //////////////////////
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

    //////////////////// Funciones para obtener instituciones  //////////////////////



}]);

