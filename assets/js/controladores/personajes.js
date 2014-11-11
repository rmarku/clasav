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
            front: [],
            frontShadow: [],
            back: [],
            frontColored: new Image(),
            backColored: new Image()
        },
        pantalon: new Image(),
        torso: new Image(),
        zapato: new Image(),
        cuerpo: {
            c1: new Image(),
            c2: new Image()
        }
    };
    var img_h = 0;
    var img_v = 0;

    $scope.$parent.getUser().then(function (data) {
        sexo = data.sexo;
        img.torso.src = "data/sprites/characters/" + sexo + "/shirt/1.png";
        img.zapato.src = "data/sprites/characters/" + sexo + "/foot/1.png";
        img.pantalon.src = "data/sprites/characters/" + sexo + "/pants/1.png";
        img.cuerpo.c1.src = "data/sprites/characters/" + sexo + "/basic/1f.png";
        img.cuerpo.c2.src = "data/sprites/characters/" + sexo + "/basic/1b.png";


        for (var i = 1; i < 16; i++) {
            img.pelo.front[i] = new Image();
            img.pelo.front[i].src = "data/sprites/characters/" + sexo + "/hair/front/" + i + "hair.png";
            img.pelo.frontShadow[i] = new Image();
            img.pelo.frontShadow[i].src = "data/sprites/characters/" + sexo + "/hair/front/" + i + ".png";
            img.pelo.back[i] = new Image();
            img.pelo.back[i].src = "data/sprites/characters/" + sexo + "/hair/back/" + i + ".png";
        }
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

        if (color_pelo_ant_front != color_pelo && img.pelo.front[pelo].complete && img.pelo.front[pelo].naturalWidth > 0) {
            setTimeout(function () {
                color_pelo_ant_front = color_pelo;
                img.pelo.frontColored = tintImage(img.pelo.front[pelo], color_pelo);
            }, 201);
        }
        if (color_pelo_ant_back != color_pelo && img.pelo.back[pelo].complete && img.pelo.back[pelo].naturalWidth > 0) {
            setTimeout(function () {
                color_pelo_ant_back = color_pelo;
                img.pelo.backColored = tintImage(img.pelo.back[pelo], color_pelo);
            }, 201);
        }
// 1 el cuerpo de fondo
        if (img.cuerpo.c2.naturalWidth > 0)
            context.drawImage(img.cuerpo.c2, sx, sy, 32, 48, 0, 0, 32, 48);
// 2 el pelo de fondo
        if (img.pelo.backColored.width > 0) {
            context.drawImage(img.pelo.backColored, sx, sy, 32, 48, 0, 0, 32, 48);
        }
// 3 el cuerpo normal
        if (img.cuerpo.c1.naturalWidth > 0)
            context.drawImage(img.cuerpo.c1, sx, sy, 32, 48, 0, 0, 32, 48);
// 4 zapato
        if (img.zapato.naturalWidth > 0)
            context.drawImage(img.zapato, sx, sy, 32, 48, 0, 0, 32, 48);

        if (img.pantalon.naturalWidth > 0)
            context.drawImage(img.pantalon, sx, sy, 32, 48, 0, 0, 32, 48);


        if (img.torso.naturalWidth > 0)
            context.drawImage(img.torso, sx, sy, 32, 48, 0, 0, 32, 48);


        if (img.pelo.frontColored.width > 0) {
            context.drawImage(img.pelo.frontColored, sx, sy, 32, 48, 0, 0, 32, 48);
        }

        if (img.pelo.frontShadow[pelo].naturalWidth > 0 && img.pelo.frontColored.width > 0)
            context.drawImage(img.pelo.frontShadow[pelo], sx, sy, 32, 48, 0, 0, 32, 48);

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
        pantalon: 1,
        torso: 1,
        zapato: 1,
        "x": 900,
        "y": 200,
        "direccion": 0,
        "mapa_instancia": 1,
        "masRecientementeUtilizado":true,
        "conectado": false
    };

    io.socket.get("/api/user/getUser", function (data) {
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

        io.socket.get('/api/personaje?where={"nombre":"' + $scope.pj.nombre + '"}', function (data) {
            if (data.length > 0) {
                toastr.error('El nombre del personaje ya existe');
                return;
            }
            if ($scope.pj.nombre === "") {
                toastr.error('Por favor introduce un nombre');
                return;
            }

            io.socket.post("/api/personaje", $scope.pj, function (data) {
                toastr.info('Personaje creado, ahora a Jugar!!!!');
                setTimeout(function () {

                    $location.path('/game');
                }, 1000);
            });
        });
    };
}]);
