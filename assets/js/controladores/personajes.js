app.controller('personajeController', ['$scope', '$http', '$interval', 'toastr', '$location', function ($scope, $http, $interval, toastr, $location) {
    /**
     * Description
     * @method init
     * @return
     */
    var pelo = 1;
    var color_pelo_ant_back = '';
    var color_pelo_ant_front = '';
    var sexo = '';
    var img = {
        pelo: {
            front: new Image(),
            frontColored: new Image(),
            backColored: new Image(),
            frontShadow: new Image()
        },
        pantalon: new Image(),
        torso: new Image(),
        zapato: new Image(),
        cuerpo: new Image()
    };
    var img_h = 0;
    var img_v = 0;

    $scope.$parent.getUser().then(function (data) {
        sexo = data.sexo;
        img.torso.src = "data/sprites/characters/" + sexo + "/shirt.png";
        img.zapato.src = "data/sprites/characters/" + sexo + "/foot.png";
        img.pantalon.src = "data/sprites/characters/" + sexo + "/pants.png";
        img.cuerpo.src = "data/sprites/characters/" + sexo + "/basic.png";
        img.pelo.front.src = "data/sprites/characters/" + sexo + "/hairFront.png";
    });


    /**
     * Description
     * @method animacion
     * @return
     */
    var animacion = function () {

        var cnv = document.getElementById('pj');
        if (typeof cnv == 'undefined') {
            return;
        }
        var ctx = cnv.getContext('2d');

        cnv.width = cnv.width;
        var canvas = document.createElement('canvas');
        canvas.height = cnv.height;
        canvas.width = cnv.width;
        var context = canvas.getContext('2d');

        var sx = 32 * (img_h % 4);
        var sy = 48 * img_v;
        var color_pelo = document.getElementById('pelo_color').value;
        //TODO: Cambiar WM por el sexo del usuario

        if (color_pelo_ant_front != color_pelo && img.pelo.front.complete && img.pelo.front.naturalWidth > 0) {
            color_pelo_ant_front = color_pelo;
            img.pelo.frontColored.src = tintImage(img.pelo.front, color_pelo, (pelo - 1) * 128, 0, 128, 192).toDataURL();
        }
        if (color_pelo_ant_back != color_pelo && img.pelo.front.complete && img.pelo.front.naturalWidth > 0) {
            color_pelo_ant_back = color_pelo;
            img.pelo.backColored.src = tintImage(img.pelo.front, color_pelo, (pelo - 1) * 128, 192 * 2, 128, 192).toDataURL();
        }
// 1 el cuerpo de fondo
        if (img.cuerpo.naturalWidth > 0)
            context.drawImage(img.cuerpo, sx, 192 + sy, 32, 48, 0, 0, 32, 48);
// 2 el pelo de fondo
        if (img.pelo.backColored.naturalWidth > 0)
            context.drawImage(img.pelo.backColored, sx, sy, 32, 48, 0, 0, 32, 48);

// 3 el cuerpo normal
        if (img.cuerpo.naturalWidth > 0)
            context.drawImage(img.cuerpo, sx, sy, 32, 48, 0, 0, 32, 48);
// 4 zapato
        if (img.zapato.naturalWidth > 0)
            context.drawImage(img.zapato, sx, sy, 32, 48, 0, 0, 32, 48);

        if (img.pantalon.naturalWidth > 0)
            context.drawImage(img.pantalon, sx, sy, 32, 48, 0, 0, 32, 48);

        if (img.torso.naturalWidth > 0)
            context.drawImage(img.torso, sx, sy, 32, 48, 0, 0, 32, 48);

        if (img.pelo.frontColored.naturalWidth > 0)
            context.drawImage(img.pelo.frontColored, sx, sy, 32, 48, 0, 0, 32, 48);

        if (img.pelo.frontShadow.naturalWidth > 0 )
            context.drawImage(img.pelo.frontShadow, (pelo - 1) * 128 + sx, 192 + sy, 32, 48, 0, 0, 32, 48);

        ctx.drawImage(canvas, 0, 0);

        img_h++;
        if (img_h > 15) {
            img_h = 0;
            img_v++;
            if (img_v > 3) {
                img_v = 0;
            }
        }
    };
    var int = $interval(animacion, 200);
    $scope.$on('$destroy', function () {
        // Make sure that the interval is destroyed too
        if (angular.isDefined(int)) {
            $interval.cancel(int);
            int = undefined;
        }
    });

    $scope.pj = {
        nombre: '',
        pelo: 1,
        pelo_color: "#ffffff",
        "x": 900,
        "y": 200,
        "direccion": 0,
        "masRecientementeUtilizado": true,
        "conectado": false
    };

    $.get("/api/user/getUser", function (data) {
        if (typeof data.userId == 'undefined') {
            window.location.href = '/';
            return;
        }
        $scope.pj.duenio = data.userId;
        $scope.$apply();
    });


    /**
     * Description
     * @method peloSiguiente
     * @return
     */
    $scope.peloSiguiente = function () {
        if (pelo < 15)
            pelo++;
        $scope.pj.pelo = pelo;
        color_pelo_ant_back = '';
        color_pelo_ant_front = '';
        img.pelo.frontColored = new Image();
        img.pelo.backColored = new Image();

    };

    /**
     * Description
     * @method peloAnterior
     * @return
     */
    $scope.peloAnterior = function () {
        if (pelo > 1)
            pelo--;
        $scope.pj.pelo = pelo;
        color_pelo_ant_back = '';
        color_pelo_ant_front = '';
        img.pelo.frontColored = new Image();
        img.pelo.backColored = new Image();
    };

    /**
     * Description
     * @method crearPj
     * @return
     */
    $scope.crearPj = function () {

        $.get('/api/personaje?where={"nombre":"' + $scope.pj.nombre + '"}', function (data) {
            if (data.length > 0) {
                toastr.error('El nombre del personaje ya existe');
                return;
            }
            if ($scope.pj.nombre === "") {
                toastr.error('Por favor introduce un nombre');
                return;
            }

            $.post("/api/personaje", $scope.pj, function (data) {
                toastr.info('Personaje creado, ahora a Jugar!!!!');
                setTimeout(function () {

                    $location.path('/game');
                }, 1000);
            });
        });
    };
}]);
