app.controller('ChatController', ['$scope', '$sailsBind', function ($scope, $sailsBind) {
    $scope.chats=[];
    var tiempo = new Date();
    $sailsBind.bind('api/chat',$scope, {"dateTime": {">": tiempo}});
    
    $scope.envMsj = function(){
    	if($scope.mensaje!="")
    		io.socket.put('/api/chat/create/', {nick: 'pepe', mensaje: $scope.mensaje});
    	$scope.mensaje="";
    };
    
}]);