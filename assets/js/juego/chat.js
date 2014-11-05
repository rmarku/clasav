app.controller('ChatController', ['$scope', '$sailsBind', function ($scope, $sailsBind) {
    $scope.chats = [];
    var tiempo = new Date();
    $sailsBind.bind('api/chat', $scope, {"dateTime": {">": tiempo}});
    
    
    /*PRUEBA
    
            io.socket.get('/api/personaje?where={"nombre":"' + $scope.pj.nombre + '"}', function (data) {
            var nombrePj = $scope.pj.nombre;
        });
    PRUEBA*/
    
    

    $scope.envMsj = function () {
        if ($scope.mensaje !== "") {
            io.socket.put('/api/chat/create/', {nick: 'Lizz', mensaje: $scope.mensaje});

        }
        $scope.mensaje = "";
    };

}]);