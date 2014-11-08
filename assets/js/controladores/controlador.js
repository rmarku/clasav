app.controller('gamePageController', ['$scope', '$location', function ($scope, $location) {
    /**
     * Description
     * 
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

    /**
     * Description
     * 
     * @method init
     * @return 
     */
    $scope.init = function () {
        setTimeout(function () {
            game.onload();
        }, 1000);
    };
}
]);

