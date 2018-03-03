app.controller('reporteEstadoController', function ($scope,$location,$route,$rootScope,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.errors = {};
    //$scope.tablaReporteEstado = {};
    //$scope.obtReporteEstado = "";
    $scope.reporteEstado=false;
    $scope.tabReporteEstado=true;
      //listar roles

    $scope.getReporteEstado = function(ci){
        var carnet = "";
        carnet = ci
        console.log("carnet   ",carnet);
        $.blockUI();
        $scope.reporteEstado=true;
        var resReporteEstado = {
            "procedure_name":"sp_reporte_estado",
            "body":{
                "params": [
                    {
                        "name": "ci",
                        "value": carnet
                    }
                ]
            }
        }; 
        //servicio listar roles 
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resReporteEstado).success(function (response) {
            if (response.length>0) {
                $scope.obtReporteEstado = response;
                var data = response;   //grabamos la respuesta para el paginado
            //$scope.tablaReporteEstado.reload();
            $.unblockUI();  
            } else{
                   //$scope.obtReporteEstado = response;
            //var data = response;   //grabamos la respuesta para el paginado
            //$scope.tablaReporteEstado.reload();
                sweet.show('', "No hay Registros con los criterios de busqueda", 'error');
            $.unblockUI(); 
            }; 
        }).error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };

    /*$scope.tablaReporteEstado = new ngTableParams({
                page: 1,          
                count: 5,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtReporteEstado.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtReporteEstado, params.filter()) :
                    $scope.obtReporteEstado;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtReporteEstado;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); */

    $scope.buscarCaso = function(caso){
        console.log("numero de caso   ",caso);
    $scope.getReporteEstado(caso);
    };

   

    $scope.$on('api:ready',function(){
        //$scope.getReportes();   
    });
    $scope.inicioReporteEstado = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            // $scope.getReportes();
        }
    }; 

});