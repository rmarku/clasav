/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('institucionesAdministradorController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {
  /*
    if ($scope.user.tipo == 'profesor') {
        $scope.get_misInstituciones();
    }
    else if($scope.user.tipo == 'administrador'){
        $scope.get_misInstituciones();
        $scope.misInstituciones = $scope.definirSituacionProfesores($scope.misInstituciones);
    }
*/
    $scope.set_institucionActual = function (index) {
        $scope.$parent.institucionActual        = $scope.$parent.misInstituciones[index];
        $scope.$parent.institucionActual.activa = true;
        window.location.href = '#/verProfesores';
        toastr.info('Institución Actual: '+$scope.$parent.institucionActual.nombre);

    };


    $scope.crearInstitucion = function () {
        window.location.href = '#/crearInstitucion';
    };



    $scope.definirSituacionInstituciones = function (instituciones) {

        while(instituciones.length){
            var institucion = instituciones.pop();

            if(institucion.institucion_x_user[0].situacion == "administrador"){

                $scope.$parent.misInstituciones.push(institucion);
                continue;
            }else

            if(institucion.institucion_x_user[0].situacion == "esperaAdministrador"){

                $scope.$parent.misInstitucionesSituacionEspera.push(institucion);
                continue;
            }else

            if(institucion.institucion_x_user[0].situacion == "rechazadoAdministrador"){

                $scope.$parent.misInstitucionesSituacionRechazado.push(institucion);
                continue;
            }
        }

    };

    $scope.definirSituacionProfesores = function (instituciones) {

        instituciones.forEach(function (institucion) {

            institucion.profesores_situacionEspera = [];
            institucion.profesores_situacionAceptado = [];
            institucion.profesores_situacionRechazado = [];
            institucion.otros_Administradores = [];
            $scope.definirSituacionProfesores_enInstitucion(institucion).then(function (data) {
                institucion = data;
            });
        });
        return instituciones;
    };

    $scope.definirSituacionProfesores_enInstitucion = function (institucion) {

        var deferred = $q.defer();

        $.get('/api/institucion_x_user?institucion=' + institucion.id, function (instituciones_x_users) {

            for (var y = 0; y < institucion.users.length; y++) {

                var user = institucion.users[y];

                for (var x = 0; x < institucion.users.length; x++) {
                    var institucion_x_user = instituciones_x_users[x];

                    if (institucion_x_user.user.id == user.id) {

                        user.institucion_x_user = [];

                        if (institucion_x_user.situacion == 'esperaProfesor') {

                            user.institucion_x_user[0] = institucion_x_user;
                            institucion.profesores_situacionEspera.push(user);

                        } else if (institucion_x_user.situacion == 'profesor') {

                            user.institucion_x_user[0] = institucion_x_user;
                            institucion.profesores_situacionAceptado.push(user);

                        } else if (institucion_x_user.situacion == 'rechazadoProfesor') {

                            user.institucion_x_user[0] = institucion_x_user;
                            institucion.profesores_situacionRechazado.push(user);

                        } else if (institucion_x_user.situacion == 'administrador') {

                            user.institucion_x_user[0] = institucion_x_user;
                            institucion.otros_Administradores.push(user);
                        }
                    }
                }
                if (y == institucion.users.length - 1) {
                    institucion.users = [];
                    deferred.resolve(institucion);
                }
            }
        });
        return deferred.promise;
    };

    $scope.get_misInstituciones = function () {

        if($scope.$parent.institucionesCargadas === true){
            return;
        }
        $scope.$parent.misInstituciones                                     = [];
        $scope.$parent.misInstitucionesSituacionEspera                      = [];
        $scope.$parent.misInstitucionesSituacionRechazado                   = [];

        io.socket.get('/api/institucion/get_misInstituciones_conUsers', function (instituciones) {

            $scope.definirSituacionInstituciones(instituciones);
            $scope.$parent.misInstituciones = $scope.definirSituacionProfesores($scope.$parent.misInstituciones);
            $scope.$parent.institucionesCargadas = true;
            $scope.$apply();
        });
    };

    $scope.get_misInstituciones();
















}]);

