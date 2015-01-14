app.controller('ChatController', ['$scope', '$sailsBind', function ($scope, $sailsBind) {
    $scope.chats = [];
    var tiempo = new Date();
    $scope.mensaje = "";
    $sailsBind.bind('api/chat', $scope, {">": {"createdAt": tiempo}});


    /**
     * Funcion que envia mensaje a la ventana(div) de Chat, y luego blanquea el campo del "input"
     * @method envMsj
     * @return
     */
    $scope.envMsj = function () {
        if ($scope.mensaje !== "") {
            $scope.chats.push({nick: game.mainPlayer.data.nombre, mensaje: $scope.mensaje});
        }
        $scope.mensaje = "";
    };
    
    var config = {};
    $scope.scrollbar = function(direction, autoResize, show) {
        config.direction = direction;
        config.autoResize = autoResize;
        config.scrollbar = {
            color: 'rgba(255,128,0, .6)', // Background color of the scrollbar
            show: true
        };
        config.scrollTo= 'end';
        
        config.scrollbarContainer = {
            width: 12, // Width of the container surrounding the scrollbar. Becomes visible on hover
      		color: 'rgba(255,171,86, .1)' // Background color of the scrollbar container
        };
        
        return config;
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
                    scope.$apply(attrs.chat);
                }
                e.stopImmediatePropagation();
            });
        }
    };
});
