/**
 * Created by Fabricio on 16/03/2015.
 */
app.controller('preguntasColiseoController', ['$scope', '$rootScope', "toastr",'$location','$q', function ($scope, $rootScope, toastr, $location,$q) {

    if($scope.$parent.claseActual.activa === false){
        window.location.href = '#/clasesProfesor';
    }

    /**
     * Description
     * @method reset_preguntaForm
     * @return 
     */
    $scope.reset_preguntaForm = function () {
        $scope.preguntaForm = {
            "pregunta"      : '',
            "respuesta1"    : '',
            "respuesta2"    : '',
            "respuesta3"    : '',
            "respuesta4"    : '',
            "respuesta5"    : '',
            "respuesta6"    : '',
            "respuesta7"    :'',
            "respuesta8"    :''
        };
    };
    $scope.reset_preguntaForm();


    $scope.preguntas = [];
    $scope.mostrarRespuestasPregunta = [];
    $scope.mostrarFormPreguntaNueva = false;


    /**
     * Description
     * @method get_misPreguntasColiseo_claseActual
     * @return 
     */
    $scope.get_misPreguntasColiseo_claseActual = function () {

        $.get('/api/preguntas_coli?clase='+$scope.$parent.claseActual.id, function (preguntas) {

            $scope.preguntas= preguntas;

            $scope.preguntas.forEach(function (pregunta){
                $scope.mostrarRespuestasPregunta[pregunta.id] = false;
            });

            $scope.$apply();
        });
    };
    $scope.get_misPreguntasColiseo_claseActual();


    /**
     * Description
     * @method subir_preguntaNueva
     * @return 
     */
    $scope.subir_preguntaNueva= function () {
        $scope.mostrarFormPreguntaNueva = false;

        $.post('/api/preguntas_coli/create?' +
        'clase=' + $scope.$parent.claseActual.id +
        '&pregunta=' + $scope.preguntaForm.pregunta         +
        '&respuesta1=' + $scope.preguntaForm.respuesta1     +
        '&respuesta2=' + $scope.preguntaForm.respuesta2     +
        '&respuesta3=' + $scope.preguntaForm.respuesta3     +
        '&respuesta4=' + $scope.preguntaForm.respuesta4     +
        '&respuesta5=' + $scope.preguntaForm.respuesta5     +
        '&respuesta6=' + $scope.preguntaForm.respuesta6     +
        '&respuesta7=' + $scope.preguntaForm.respuesta7     +
        '&respuesta8=' + $scope.preguntaForm.respuesta8, function (created) {

            if(!created){
                return;
            }
            $scope.preguntas.push($scope.preguntaForm);
            $scope.reset_preguntaForm();
            toastr.info('Pregunta nueva creada.');
            $scope.$apply();
        });
    };
}]);

