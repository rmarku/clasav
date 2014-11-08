app.controller('ChatController', ['$scope', '$sailsBind', function ($scope, $sailsBind) {
    $scope.chats = [];
    var tiempo = new Date();
    $sailsBind.bind('api/chat', $scope, {"dateTime": {">": tiempo}});
    
    
    /**
     * Description
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
     * Description
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
          e.stopImmediatePropagation();
      });
    }
  };
});
