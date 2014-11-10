app.controller('ChatController', ['$scope', '$sailsBind', function ($scope, $sailsBind) {
    $scope.chats = [];
    var tiempo = new Date();
    $sailsBind.bind('api/chat', $scope, {"dateTime": {">": tiempo}});


    /**
     * Funcion que envia mensaje a la ventana(div) de Chat, y luego blanquea el campo del "input"
     * @method envMsj
     * @return
     */
    $scope.envMsj = function () {
        if ($scope.mensaje !== "") {
            io.socket.put('/api/chat/create/', {nick: 'Lizz', mensaje: $scope.mensaje});
        }
        $scope.mensaje = "";
    };

}]);

app.directive('chat', function () {
    return {
        restrict: 'A',
        /**
         * Para la propagacion del evento para poder escribir en el campo de "input", y que no se mueva el personaje
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
                    scope[attrs.chat]();
                }
                e.stopImmediatePropagation();
            });
        }
    };
});
