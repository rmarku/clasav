/**
 * Created by Fabricio on 19/03/2015.
 */
app.controller('clasesAlumnoController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.misClases = [];
    $scope.misClasesConfirmacionPendiente = [];

    $scope.get_misClases = function () {
        $.get('/api/clase/get_misClases_conUsers', function (clases) {

            clases              = $scope.definirMapasCentrales(clases);
            clases              = $scope.definirProfesores(clases);
            clases              = $scope.definirClasesConfirmacionPendiente(clases);
            $scope.misClases    = clases;

            $scope.$apply();

            return $scope.misClases;
        });
    };

    $scope.get_misClases();

    $scope.get_instituciones = function () {
        $.get('/api/institucion', function (local_instituciones) {

            //$scope.instituciones = local_instituciones;
            $scope.instituciones = $scope.concatenarDatosInstituciones(local_instituciones);
            $scope.institucion_seleccionada = $scope.instituciones[0];
            $scope.$apply();

            $scope.get_clasesDeInstitucion();

            return $scope.instituciones;
        });
    };
    $scope.get_instituciones();

    $scope.get_clasesDeInstitucion = function () {
        $.get('/api/clase?institucion='+$scope.institucion_seleccionada.id, function (clases) {

            clases = $scope.definirMapasCentrales(clases);
            clases = $scope.definirProfesores(clases);

            $scope.clasesDeInstitucion = $scope.concatenarDatosClases (clases);

            $scope.clase_seleccionada = $scope.clasesDeInstitucion[0];
            $scope.$apply();

            return $scope.clasesDeInstitucion;
        });
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


    $scope.solicitarClase = function () {
        window.location.href = '#/solicitarClase';
    };

    $scope.subirSolicitudClase = function () {

        $.get("/api/clase/solicitarClase",
            {
                claseID: $scope.clase_seleccionada.id
            },
            function (data) {
                toastr.info('Solicitud Enviada');
                window.location.href = '#/clasesAlumno';
            });
    };

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


    $scope.definirClasesConfirmacionPendiente = function (clases) {

        clases.forEach(function(clase){

            if(clase.clase_x_user[0].situacion == "espera"){

                $scope.misClasesConfirmacionPendiente.push(clase);
                
                clases.pop(clase);
            }
        });

        return clases;
    };



    }

]);

