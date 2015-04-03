app.controller('ChatController', ['$scope', '$sailsBind', function ($scope, $sailsBind) {
    $scope.chats = [];
    var tiempo = new Date();
    $scope.mensaje = "";
    $sailsBind.bind('api/chat', $scope, {">": {"createdAt": tiempo}});

    $("#glyChat").click(function () {
        var e = $("#ChatGame");
        if (e.css('height') != '30px')
            e.animate({'height': '30px'}, 400);
        else
            e.animate({'height': e.css('max-height')}, 400);
    });

    $("#ventAmigos").click(function () {
        var e = $("#ventAmigos");
        if (e.css('height') != '23px')
            e.animate({'height': '23px'}, 400);
        else
            e.animate({'height': e.css('max-height')}, 400);
    });
    /**
     * Funcion que envia mensaje a la ventana(div) de Chat, y luego blanquea el campo del "input"
     * @return
     * @method envMsj
     * @return
     */
    $scope.envMsj = function () {
        if ($scope.mensaje !== "") {
            $scope.chats.push({nick: game.mainPlayer.data.nombre, mensaje: $scope.mensaje});
        }
        $scope.mensaje = "";
    };

}]);

app.directive('chat', function () {
    return {
        restrict: 'A',
        /**
         * Para la propagacion del evento para poder escribir en el campo de "input", y que no se mueva el personaje
         * @return
         * @method link
         * @param {} scope
         * @param {} elem
         * @param {} attrs
         * @return
         */
        link: function (scope, elem, attrs) {
            elem.bind('keydown', function (e) {
                e.stopImmediatePropagation();
            });
            elem.bind('keyup', function (e) {
                if (e.keyCode == 13) {
                    scope.$apply(attrs.chat);
                }
                e.stopImmediatePropagation();
            });
        }
    };
});
