/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('clasesProfesorController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {


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

    $scope.crearClase = function () {
        window.location.href = '#/crearClase';
    };

/*
    $scope.definirMapasCentrales = function (clases) {

        ////Recorremos cada mapa_instancia: solo nos quedamos con el mapa_principal
        clases.forEach(function (clase) {

            var mapa_instancia = $scope.get_mapaCentral(clase);
            clase.mapas_instancias.pop(mapa_instancia);
            clase.mapaCentral = mapa_instancia;
        });
        return clases;
    };

    $scope.get_mapaCentral = function (clase) {

        var mapaToReturn = "";

        clase.mapas_instancias.forEach(function (mapa_instancia) {

            if (mapa_instancia.tipo == 'central') {
                mapaToReturn = mapa_instancia;
            }
        });

        return mapaToReturn;
    };

    //Hecho para solo un profesor
    $scope.definirProfesores = function (clases) {

        clases.forEach(function (clase) {

            var user = $scope.get_profesor(clase);
            clase.users.pop(user);
            clase.profesor = user;
        });
        return clases;
    };

    $scope.get_profesor = function (clase) {

        var userToReturn = "";

        clase.users.forEach(function (user) {

            if (user.tipo == 'profesor') {
                userToReturn = user;
                return;
            }
        });

        return userToReturn;
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
                if (y == clase.users.length - 1) {
                    clase.users = [];
                    deferred.resolve(clase);
                }
            }
        });
        return deferred.promise;
    };
    */

    $scope.set_claseActual = function (index) {
        $scope.$parent.claseActual = $scope.$parent.misClases[index];
        $scope.$parent.claseActual.activa = true;
        toastr.info('Clase Actual: '+$scope.$parent.claseActual.nombre+'.\n Recorre sus detalles en el Panel Principal.');


     //   $('#button_navBar_alumnos').trigger('click');
       // $('[href=#button_navBar_alumnos]').tab('show');


    };


}]);

