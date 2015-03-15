app.controller('editUsuario', ['$scope', '$http', 'toastr', '$location', function ($scope, $http, toastr, $location) {
    /**
     * Contiene datos del usuario
     *
     * @method init
     * @return
     */
    $scope.usuario = {
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
        local: true,
        clase: 1,
        tipo:''
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

    // Segun si es editar o crear muestro el titulo y el boton
    if ($location.path() == '/cuenta') {
        $scope.editar = true;
        $scope.Titulo = 'Editar Cuenta';
        $scope.Boton = 'Guardar Cambios';
        $scope.$parent.getUser().then(function (data) {
            $scope.usuario = data;
            delete $scope.usuario.passports;
        });
    } else {

        $scope.editar = false;
        $scope.Titulo = 'Cuenta Nueva';
        $scope.Boton = 'Crear';
    }


    /**
     * Envia el formulario
     *
     * @method subirForm
     * @return
     */
    $scope.subirForm = function () {

        if ($scope.usuario.password != $scope.usuario.password2) {
            toastr.error('Las contraseñas no coinciden');
            return;
        }
        if ($scope.usuario.sexo != 'masculino' && $scope.usuario.sexo != 'femenino') {
            toastr.error('Seleccione un Genero');
            return;
        }

        if ($scope.usuario.tipo != 'profesor' && $scope.usuario.tipo != 'alumno') {
            toastr.error('Seleccione un Tipo de Cuenta');
            return;
        }
        if ($scope.editar) {  // Voy a editar una cuenta

            $.post("/api/user/" + $scope.usuario.id, $scope.usuario, function (data) {


                $.get('/api/personaje?where={"duenio":"' + $scope.usuario.id + '"}', function (data) {
                    console.log(data);
                    if (data.lenght > 0) {
                        toastr.info('Datos actualizados!!!!');
                        setTimeout(function () {
                           // $location.path('/');
                            //hacer algo aca para que dentro de las pestas aparezca "juego"
                            //document.location.href = ('/');
                            location.reload();
                        }, 1000);
                    } else {
                        toastr.info('Datos actualizados');
                        setTimeout(function () {
                            window.location.href = '#/personaje';
                        }, 2000);
                    }
                });
            });
        } else {   // Voy a crear una nueva cuenta.

            if ($scope.usuario.password === '') {
                toastr.error('Contraseña no valida');
            }

            var req = $http({
                method: 'POST',
                url: "/auth/local/register",
                data: $.param($scope.usuario),
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

                    toastr.info('Cuenta Creada!!! ahora puedes crear tu personaje!!');
                    setTimeout(function () {
                        location.reload();
                        window.location.href = '#/personaje';

                    }, 2000);
                }
            });
        }
    };
}]);
