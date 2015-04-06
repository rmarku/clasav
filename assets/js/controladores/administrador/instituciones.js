/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('institucionesAdministradorController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {


    $scope.get_misInstituciones = function () {

        if ($scope.$parent.institucionesCargadas === true) {
            return;
        }

        $scope.$parent.misClases                    = [];
        $scope.$parent.misClasesSituacionEspera     = [];
        $scope.$parent.misClasesSituacionRechazado  = [];

        io.socket.get('/api/instituciones/get_misInstituciones_conProfesores', function (instituciones) {

            instituciones                           = $scope.$parent.definirSituacionProfesores(clases);
            $scope.$parent.misInstituciones         = instituciones;
            $scope.$parent.institucionesCargadas    = true;

            $scope.$apply();
        });


    };
    $scope.get_misInstituciones();

    $scope.set_institucionActual = function (index) {
        $scope.$parent.institucionActual        = $scope.$parent.misInstituciones[index];
        $scope.$parent.institucionActual.activa = true;
        toastr.info('Institución Actual: '+$scope.$parent.institucionActual.nombre+'.\n Recorre sus detalles en el Panel Principal.');
    };


    $scope.definirSituacionProfesores = function (clases) {

        clases.forEach(function (clase) {

            clase.profesores_situacionEspera = [];
            clase.profesores_situacionAceptado = [];
            clase.profesores_situacionRechazado = [];
            $scope.definirSituacionProfesores_enInstitucion(clase).then(function (data) {
                clase = data;
            });
        });
        return clases;
    };

    $scope.definirSituacionProfesores_enInstitucion = function (institucion) {

        var deferred = $q.defer();

        $.get('/api/institucion_x_user?institucion=' + institucion.id, function (instituciones_x_users) {

            for (var y = 0; y < institucion.users.length; y++) {

                var user = institucion.users[y];

                for (var x = 0; x < institucion.users.length; x++) {
                    var institucion_x_user = instituciones_x_users[x];

                    if (institucion_x_user.user.id == user.id) {

                        user.clase_x_user = [];

                        if (institucion_x_user.situacion == 'espera') {

                            user.clase_x_user[0] = institucion_x_user;
                            institucion.users_situacionEspera.push(user);

                        } else if (institucion_x_user.situacion == 'aceptado') {

                            user.clase_x_user[0] = institucion_x_user;
                            institucion.users_situacionAceptado.push(user);

                        } else if (clase_x_user.situacion == 'rechazado') {

                            user.clase_x_user[0] = institucion_x_user;
                            institucion.users_situacionRechazado.push(user);

                        } else if (institucion_x_user.situacion == 'administrador') {

                            user.clase_x_user[0] = institucion_x_user;
                            institucion.users_situacionAdministrador.push(user);
                        }
                    }
                }
                if (y == clase.users.length - 1) {
                    institucion.users = [];
                    deferred.resolve(institucion);
                }
            }
        });
        return deferred.promise;
    };

}]);

