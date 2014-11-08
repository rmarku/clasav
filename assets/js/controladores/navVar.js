app.controller('bodyController', ['$scope', 'toastr', '$location', '$q', function ($scope, toastr, $location, $q) {
    /**
     * Description
     * @method init
     * @return
     */

    $scope.user = {};

    /**
     * Description
     * @method getUser
     * @return MemberExpression
     */
    $scope.getUser = function () {
        var deferred = $q.defer();
        if (angular.isUndefined($scope.user.id)) {
            io.socket.get("/api/user/getUser", function (data) {
                if (angular.isUndefined(data.userId)) {
                    toastr.info('Inicia para Jugar');
                    deferred.resolve({});
                    return {};
                }

                io.socket.get("/api/user/" + data.userId, function (data) {
                    $scope.user = data;
                    $scope.$apply();
                    if (angular.isUndefined(data.sexo) && $location.path() != '/cuenta') {
                        toastr.info('Completa tu información para poder jugar.');
                    }
                    deferred.resolve($scope.user);
                });
            });
        } else {
            deferred.resolve($scope.user);
        }
        return deferred.promise;
    };

    $scope.getUser();

    /**
     * Description
     * @method verCuenta
     * @return 
     */
    $scope.verCuenta = function () {
        $location.path('/cuenta');
    };
}])
;