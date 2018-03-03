app.controller('reimpresionController', function ($scope, $q,$route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout,fileUpload, $location) {

    $scope.panelCasos=false;
    $scope.panelbuscador=true;
    
    $scope.getcasos10 = function(datos){
        $scope.panelCasos=true;
        console.log(datos.valor);
        var resDatos = {
            "procedure_name":"impresioneslst_82",
            "body":{
                "params": [
                    {
                        "name": "ci",
                        "value": datos.valor
                    }                
                ]
            }
        };
        $.blockUI();
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resDatos);
        obj.success(function (response) {
            var data = response; 
            if(data.length > 0){
                console.log("DATA RESPUESTA: ", response);
                $scope.datos = response;
                $scope.conArchivo = "mostrar";
                $scope.sinArchivo = null;
            }else{
                $scope.mensaje  =   "El C.I. no tiene trámites.";
            }
            $.unblockUI(); 
        }).error(function(results){          
            $.unblockUI();
        });
    };
    
    $scope.busquedaAtenderCaso  =   function(datoson){
        console.log("DATA::", datoson );        
        //actinicio:"SI"
        if(datoson.actinicio == "SI"){
            $.blockUI();
            alert(0);
            $location.path('formularios|misCasos|index.html');
            setTimeout(function(){
                $rootScope.$broadcast('atenderOtro', datoson);
                $.unblockUI();
            }, 600);        
        }else{
            sweet.show('', "Trámite Cerrado ", 'warning');
        }
        //console.log("ATENDER CASO:", datoson);
    }

    $scope.$on('api:ready',function(){
        /*$scope.usuarioid = sessionService.get('IDUSUARIO');
        sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
        sessionService.set('IDNODO', sessionService.get('US_IDNODO'));*/
    });
    $scope.inicioCrear = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            /*$scope.usuarioid = sessionService.get('IDUSUARIO');
            sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
            sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));*/
        }
    };
});
