app.controller('editUsuario', ['$scope', '$http', 'toastr', '$location', function ($scope, $http, toastr, $location) {
    /**
     * Contiene datos del alumno
     *
     * @method init
     * @return
     */
    $scope.alumno = {
        nombre: '',
        apellido: '',
        sexo: '',
        email: '',
        fecha_nacimiento: '',
        pais: '',
        provincia: '',
        ciudad: '',
        calle: '',
        numero_calle: '',
        departamento: '',
        password: '',
        password2: '',
        local: true
    };

    var lang = {
        "Welcome": "Bienvenido",
        "A brand new app.": "Una aplicacion de la nueva marca.",

        "Error.Passport.Password.Invalid": "Contraseña invalida",
        "Error.Passport.Password.Wrong": "Esa contraseña no esta muy bien...",
        "Error.Passport.Password.NotSet": "Todavía no has puesto una contraseña",
        "Error.Passport.Username.NotFound": "Uhm, usuario no encontrado",
        "Error.Passport.User.Exists": "Este mail ya es conocido.",
        "Error.Passport.Email.NotFound": "Ese mail no parece correcto",
        "Error.Passport.Email.Missing": "Falta poner el mail.",
        "Error.Passport.Email.Exists": "Este mail ya existe :(",
        "Error.Passport.Username.Missing": "Debes ingresar un usuario",
        "Error.Passport.Password.Missing": "No has puesto una contraseña",
        "Error.Passport.Generic": "Fua, algo salio mal con la autentificacion."
    };

    if ($location.path() == '/cuenta') {
        $scope.editar = true;
        $scope.Titulo = 'Editar Cuenta';
        $scope.$parent.getUser().then(function (data) {
            $scope.alumno = data;
        });
    } else {

        $scope.editar = false;
        $scope.Titulo = 'Cuenta Nueva';
    }


    /**
     * Envia el formulario
     *
     * @method subirForm
     * @return
     */
    $scope.subirForm = function () {

        if ($scope.alumno.password != $scope.alumno.password2) {
            toastr.error('Las contraseñas no coinciden');
            return;
        }
        if ($scope.alumno.sexo != 'masculino' && $scope.alumno.sexo != 'femenino') {
            toastr.error('Seleccione un Genero');
            return;
        }

        if ($scope.editar) {

            io.socket.post("/api/user/" + $scope.alumno.id, $scope.alumno, function (data) {


                io.socket.get('/api/personaje?where={"duenio":"' + $scope.alumno.id + '"}', function (data) {
                    console.log(data);
                    if (data.lenght > 0) {
                        toastr.info('Datos actualizados!!!!');
                        setTimeout(function () {
                            $location.path('/');
                        }, 1000);
                    } else {
                        toastr.info('Datos actualizados, ahora crea tu personaje');
                        setTimeout(function () {
                            window.location.href = '#/personaje';
                        }, 1000);
                    }
                });
            });
        } else {

            if ($scope.alumno.password === '') {
                toastr.error('Contraseña no valida');
            }


            var req = $http({
                method: 'POST',
                url: "/auth/local/register",
                data: $.param($scope.alumno),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

            req.success(function (data) {
                console.log(data);
                if (typeof data.errors != "undefined") {
                    data.errors.forEach(function (e) {
                        toastr.error(lang[e]);
                    });
                }

                if (typeof data.loguedin != "undefined") {

                    toastr.info('Cuenta Creada, ahora crea tu personaje');
                    setTimeout(function () {
                        window.location.href = '#/personaje';
                    }, 1000);
                }
            });
        }
    };
}]);
