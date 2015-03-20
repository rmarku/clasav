/**
 * Created by Fabricio on 19/03/2015.
 */
app.controller('clasesAlumnoController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    $scope.get_clases = function () {
        $.get('/api/clase', function (clases) {
            $scope.todasLasClases = clases;
            $scope.$apply();
            return $scope.todasLasClases;
        });
    };

    $scope.get_clases();

}

]);
