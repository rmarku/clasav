/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('clasesProfesorController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.visibilidad_nuevaInstitucion = false;
    $scope.misClases = [];

    $scope.get_misClases = function () {
        $.get('/api/clase/get_misClases_conUsers', function (clases) {

            clases              = $scope.definirMapasCentrales(clases);
         // clases              = $scope.definirProfesores(clases);
            clases              = $scope.definirSituacionUsers(clases);
            $scope.misClases    = clases;

            $scope.$apply();

            return $scope.misClases;
        });
    };

    $scope.get_misClases();

    $scope.get_instituciones = function () {
         $.get('/api/institucion', function (local_instituciones) {

             $scope.instituciones = local_instituciones;
             $scope.institucion_seleccionada = $scope.instituciones[0];
             $scope.$apply();

             return $scope.instituciones;
         });
    };
    $scope.get_instituciones();

    $scope.get_mapas = function () {
        $.get('/api/mapa_generico?tipo=central', function (local_mapas) {
            $scope.mapas = local_mapas;
            $scope.mapa_seleccionado = $scope.mapas[0];
            $scope.$apply();
            return $scope.mapas;
        });
    };
    $scope.get_mapas();

    $scope.crearClase = function () {
        window.location.href = '#/crearClase';
    };

    $scope.set_visibilidad_nuevaInstitucion = function (state) {
        $scope.visibilidad_nuevaInstitucion = state;
    };

    $scope.subirClase = function () {

        if($scope.visibilidad_nuevaInstitucion){
            $scope.createInstitucion().then(function (returned_data) {
                $scope.createClase();
            });
        }
        else{
            $scope.createClase();
        }
    };

    $scope.createClase = function () {
        $.get("/api/clase/crearClaseProfesor",
            {
                nombre:             $scope.clase.nombre,
                mapa_genericoID:    $scope.mapa_seleccionado.id,
                institucionID:      $scope.institucion_seleccionada.id
            },
            function (data) {
                toastr.info('Nueva Clase Creada');
                window.location.href = '#/clasesProfesor';
        });
    };

    $scope.createInstitucion = function () {
        var deferred = $q.defer();
            $.post("/api/institucion/create", $scope.institucion_nueva,
                function (institucionCreada) {
                    $scope.institucion_seleccionada = institucionCreada;
                    deferred.resolve();
                }
            );
        return deferred.promise;
    };



    $scope.definirMapasCentrales = function (clases) {

        ////Recorremos cada mapa_instancia: solo nos quedamos con el mapa_principal
        clases.forEach(function(clase) {

            var mapa_instancia = $scope.get_mapaCentral(clase);
            clase.mapas_instancias.pop(mapa_instancia);
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

    $scope.definirProfesores = function (clases) {

        clases.forEach(function(clase) {

            var user = $scope.get_profesor(clase);
            clase.users.pop(user);
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

    $scope.definirSituacionUsers = function (clases) {

        clases.forEach(function(clase){


            clase.users_situacionEspera            = [];
            clase.users_situacionAceptado          = [];
            clase.users_situacionRechazado         = [];
            clase.users_situacionAdministrador     = [];
            $scope.definirSituacionUsers_enClase(clase).then(function (data){
                clase=data;
            });
        });
        return clases;
    };

    $scope.definirSituacionUsers_enClase = function (clase) {

        var deferred = $q.defer();

        $.get('/api/clase_x_user?clase='+clase.id, function (clases_x_users) {

            for (var y = 0; y < clase.users.length; y++) {

                var user = clase.users[y];

                for (var x = 0; x < clase.users.length; x++) {
                    var clase_x_user = clases_x_users[x];

                    if (clase_x_user.user.id == user.id) {

                        if (clase_x_user.situacion == 'espera') {

                            user.clase_x_user = clase_x_user;
                            clase.users_situacionEspera.push(user);

                        } else if (clase_x_user.situacion == 'aceptado') {

                            user.clase_x_user = clase_x_user;
                            clase.users_situacionAceptado.push(user);

                        } else if (clase_x_user.situacion == 'rechazado') {

                            user.clase_x_user = clase_x_user;
                            clase.users_situacionRechazado.push(user);

                        } else if (clase_x_user.situacion == 'administrador') {

                            user.clase_x_user = clase_x_user;
                            clase.users_situacionAdministrador.push(user);
                        }
                    }
                }
                if(y == clase.users.length-1){
                    clase.users = [];
                    deferred.resolve(clase);
                }
            }
        });
        return deferred.promise;
    };

    $scope.verSolicitudesDeClase = function (index) {
        $scope.$parent.claseActual = $scope.misClases[index];
        //$scope.$apply();
        window.location.href = '#/verSolicitudes';

    };

    $scope.aceptarAlumnoEnClase = function (user) {


        $.get("/api/clase_x_user/update/"+user.clase_x_user.id+"?situacion=aceptado",
            function (err,detail) {
                if(detail != "success"){
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.claseActual.users_situacionAceptado.push(user);
                $scope.$parent.claseActual.users_situacionEspera.pop(user);
                toastr.info('Usuario Aceptado!');
            }
        );
    };

    $scope.rechazarAlumnoEnClase = function(user,user_index) {

        $.get("/api/clase_x_user/update/"+user.clase_x_user.id+"?situacion=rechazado",
            function (err,detail) {
                if(detail != "success"){
                    toastr.error('Hubo un problema. Intente nuevamente.');
                    return;
                }
                $scope.$parent.claseActual.users_situacionRechazado.push(user);
                $scope.$parent.claseActual.users_situacionEspera.pop(user);
                toastr.info('Usuario Aceptado!');
            }
        );
    };


    }

]);

