app.controller('LoginController', function ($scope) {
    $scope.credentials = {
        email: '',
        contrasena: ''
    };
    /**
     * Description
     * @method login
     * @param {} credentials
     * @return
     *
     $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
     */
})

app.controller('gamePageController', ['$scope', '$location', function ($scope, $location) {
    /**
     * Description
     * @method init
     * @return
     */
    $scope.$parent.getUser().then(function (data) {
            if (angular.isUndefined(data.id))
                $location.path('/');
            else
                $scope.init();
        }
    );

    $scope.init = function () {
        setTimeout(function () {
            game.onload();
        }, 1000);
    };
}
])

