app.controller('bodyController', ['$scope', 'toastr', '$location', '$q', function ($scope, toastr, $location, $q) {
    /**
     * Description
     * @method init
     * @return
     */

    $scope.user = {};
    $scope.misClases = [];
    $scope.claseActual = {};
    $scope.clasesCargadas = false;
    $scope.misClasesSituacionEspera = [];
    $scope.variable123 = false;


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
                    if (angular.isUndefined(data.sexo) && $location.path() != '/cuenta') {
                        toastr.info('Completa tu información para poder jugar.');
                    }
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
     * @method verCuenta
     * @return
     */
    $scope.verCuenta = function () {
        $location.path('/cuenta');
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

}])
;
