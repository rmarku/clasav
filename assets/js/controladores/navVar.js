app.controller('bodyController', ['$scope', 'toastr', '$location', '$q', function ($scope, toastr, $location, $q) {
    /**
     * Description
     * @method init
     * @return
     */

    $scope.user = {};
    $scope.institucionesCargadas = {};

    //Variables para ALUMNOS/PROFESORES//
    $scope.misClases                    = [];
    $scope.clasesCargadas               = false;
    $scope.claseActual                  = {"activa" : false};

    $scope.misInstituciones        = [];
    $scope.misInstitucionesSituacionEspera      = [];
    $scope.misInstitucionesSituacionRechazado  = [];
    //FIN Variables para ALUMNOS/PROFESORES//

    //Variables para PROFESORES
    $scope.alumnoActual = {};
    $scope.logroActual = {};


    //Fin Variables para PROFESORES

    //Variables para ALUMNOS//
    $scope.misClasesSituacionEspera     = [];
    $scope.misClasesSituacionRechazado  = [];
    //FIN Variables para ALUMNOS//

    //Variables para ADMINISTRADORES//
    $scope.institucionActual                    = {"activa" : false};
    $scope.estadoProfesoresCargado               = false;
    //fin Variables para ADMINISTRADORES//

    /**
     * Description
     * @method getUser
     * @return MemberExpression
     */
    $scope.getUser = function () {
        var deferred = $q.defer();
        if (angular.isUndefined($scope.user.id) || angular.isUndefined($scope.user.tipo)) {
            $.get("/api/user/getUser", function (data) {
                if (angular.isUndefined(data.userId)) {
                    toastr.info('Inicia para Jugar');
                    deferred.resolve({});
                    return {};
                }

                $.get("/api/user/" + data.userId, function (data) {
                    $scope.user = data;
                    $scope.$apply();
                    if (angular.isUndefined(data.sexo) && $location.path() != '/cuenta_remota') {
                        $location.path('/cuenta_remota');
                        toastr.info('Completa tu información para poder jugar.');
                    }
                    $scope.$apply();

                    deferred.resolve($scope.user);
                });
            });
        } else {
            deferred.resolve($scope.user);
        }
        return deferred.promise;
    };

    $scope.getUser();

    /**
     * Description
     * @return
     * @method verCuenta
     * @return
     */
    $scope.verCuenta = function () {
        $location.path('/cuenta');
    };

    $scope.volver_aListaClasesProfesor = function (id) {
        $scope.claseActual.activa = false;
        $scope.$apply();
        window.location.href = '#/clasesProfesor';
    };







    //////////// FUNCIONES DE CLASES ///////////////////


    $scope.concatenarDatosInstituciones = function (instituciones) {

        instituciones.forEach(function(institucion) {

            institucion.datosConcatenados = institucion.nombre +' ( Dirección: '+ institucion.direccion + ', Ciudad: ' + institucion.ciudad + ', País: ' + institucion.pais + ')';
        });

        return instituciones;
    };

    $scope.concatenarDatosClases = function (clases) {

        clases.forEach(function(clase) {

            clase.datosConcatenados = clase.nombre +' ( Profesor: '+ clase.profesor.nombre + ' '+ clase.profesor.apellido + ', Mapa: ' + clase.mapaCentral.nombre + ')';
        });

        return clases;
    };

    $scope.definirMapasCentrales = function (clases) {

        ////Recorremos cada mapa_instancia: solo nos quedamos con el mapa_principal
        clases.forEach(function(clase) {

            var mapa_instancia = $scope.get_mapaCentral(clase);
            clase.mapas_instancias.pop();
            clase.mapaCentral = mapa_instancia;
        });
        return clases;
    };

    $scope.get_mapaCentral = function (clase) {

        var mapaToReturn = "";

        clase.mapas_instancias.forEach(function(mapa_instancia){

            if (mapa_instancia.tipo == 'central'){
                mapaToReturn = mapa_instancia;
            }
        });

        return mapaToReturn;
    };


    $scope.definirSituacionUsers = function (clases) {

        clases.forEach(function (clase) {


            clase.users_situacionEspera = [];
            clase.users_situacionAceptado = [];
            clase.users_situacionRechazado = [];
            clase.users_situacionAdministrador = [];
            $scope.definirSituacionUsers_enClase(clase).then(function (data) {
                clase = data;
            });
        });
        return clases;
    };

    $scope.definirSituacionUsers_enClase = function (clase) {

        var deferred = $q.defer();

        $.get('/api/clase_x_user?clase=' + clase.id, function (clases_x_users) {

            for (var y = 0; y < clase.users.length; y++) {

                var user = clase.users[y];

                for (var x = 0; x < clases_x_users.length; x++) {
                    var clase_x_user = clases_x_users[x];

                    if (clase_x_user.user.id == user.id) {

                        user.clase_x_user = [];

                        if (clase_x_user.situacion == 'espera') {

                            user.clase_x_user[0] = clase_x_user;
                            clase.users_situacionEspera.push(user);

                        } else if (clase_x_user.situacion == 'aceptado') {

                            user.clase_x_user[0] = clase_x_user;
                            clase.users_situacionAceptado.push(user);

                        } else if (clase_x_user.situacion == 'rechazado') {

                            user.clase_x_user[0] = clase_x_user;
                            clase.users_situacionRechazado.push(user);

                        } else if (clase_x_user.situacion == 'administrador') {

                            user.clase_x_user[0] = clase_x_user;
                            clase.users_situacionAdministrador.push(user);
                        }
                    }
                }
                if (y == clase.users.length - 1) {
                    clase.users = [];
                    deferred.resolve(clase);
                }
            }
        });
        return deferred.promise;
    };

    $scope.definirProfesores = function (clases) {

        clases.forEach(function(clase) {

            var user = $scope.get_profesor(clase);
            clase.users.pop();
            clase.profesor = user;
        });
        return clases;
    };

    $scope.get_profesor = function (clase) {

        var userToReturn = "";

        clase.users.forEach(function(user){

            if (user.tipo == 'profesor'){
                userToReturn = user;
                return;
            }
        });

        return userToReturn;
    };



    /////////////////////////FIN FUNCIONES DE CLASES
















    ///// SOCKETS

    $scope.listen_to_nuevasSolicitudesDeClases = function () {
        io.socket.on('nuevaSolicitud', function onServerSentEvent(user) {
            $scope.misClases.forEach(function (clase) {
                if (clase.id == user.clase_x_user[0].clase) {
                    clase.users_situacionEspera.push(user);
                    $scope.$apply();
                    return;
                }
            });
        });
    };
    $scope.listen_to_nuevasSolicitudesDeClases();

    $scope.listen_to_clasesEnEspera = function () {

        io.socket.on('userUpdatedFromEspera', function onServerSentEvent(clase_x_user) {

            for(var x=0 ; x < $scope.misClasesSituacionEspera.length ; x++){

                var clase = $scope.misClasesSituacionEspera[x];

                if (clase.clase_x_user[0].id == clase_x_user[0].id) {

                    if (clase_x_user[0].situacion == 'aceptado') {

                        clase.clase_x_user[0].situacion = 'aceptado';
                        $scope.misClases.push(clase);
                        $scope.misClasesSituacionEspera.splice(x, 1);

                        $scope.$apply();
                        return;

                    } else if (clase_x_user[0].situacion == 'rechazado') {

                        clase.clase_x_user[0].situacion = 'rechazado';
                        $scope.misClases.push(clase);
                        $scope.misClasesSituacionEspera.splice(x, 1);
                        $scope.$apply();
                        return;
                    }
                }
            }
        });
    };

    $scope.listen_to_clasesEnEspera();

    //Sockets para instituciones
    $scope.listen_to_nuevasSolicitudesDeInstituciones = function () {
        io.socket.on('nuevaSolicitudInstitucion', function onServerSentEvent(user) {
            $scope.misInstituciones.forEach(function (institucion) {
                if (institucion.id == user.institucion_x_user[0].institucion) {
                    institucion.profesores_situacionEspera.push(user);
                    $scope.$apply();
                    return;
                }
            });
        });
    };
    $scope.listen_to_nuevasSolicitudesDeInstituciones();

    $scope.listen_to_institucionesEnEspera = function () {

        io.socket.on('userUpdatedFromEsperaProfesor', function onServerSentEvent(institucion_x_user) {

            for(var x=0 ; x < $scope.misInstitucionesSituacionEspera.length ; x++){

                var institucion = $scope.misInstitucionesSituacionEspera[x];

                if (institucion.institucion_x_user[0].id == institucion_x_user[0].id) {

                    if (institucion_x_user[0].situacion == 'profesor') {

                        institucion.institucion_x_user[0].situacion = 'profesor';
                        $scope.misInstituciones.push(institucion);
                        $scope.misInstitucionesSituacionEspera.splice(x, 1);

                        $scope.$apply();
                        return;

                    } else if (institucion_x_user[0].situacion == 'rechazadoProfesor') {

                        institucion.institucion_x_user[0].situacion = 'rechazadoProfesor';
                        $scope.misInstituciones.push(institucion);
                        $scope.misInstitucionesSituacionEspera.splice(x, 1);
                        $scope.$apply();
                        return;
                    }
                }
            }
        });
    };

    $scope.listen_to_institucionesEnEspera();

    /////////////////////////////FIN DE SOCKETS

}])
;
