app.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    $scope.credentials = {
        email: '',
        contrasena: ''
    };
    /**
     * Description
     * @method login
     * @param {} credentials
     * @return 
     */
    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
})

app.controller('gamePageController', function ($scope) {
    /**
     * Description
     * @method init
     * @return 
     */
    $scope.init = function () {
        setTimeout(function (){
            game.onload();
        },1000);
    };
    $scope.init();
})

