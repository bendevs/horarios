app.controller('usgvalesController', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
    color=['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee']
    $scope.combustible = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",
                    "param_type":"IN","value":" select count(*) as suma ,cas_datos ->'USG_TIP_COMB_VALOR'as nom from _fr_casos where cas_datos->>'g_tipo' ='USG_COMB' and cas_datos ->> 'USG_TIP_COMB_VALOR'<>'undefined' and cas_datos ->> 'USG_TIP_COMB'='1' group by cas_datos ->'USG_TIP_COMB_VALOR' UNION select count(*) ,cas_datos ->'USG_TIP_COMB_VALOR'as nom from _fr_casos where cas_datos->>'g_tipo' ='USG_COMB' and cas_datos ->> 'USG_TIP_COMB_VALOR'<>'undefined' and cas_datos ->> 'USG_TIP_COMB'='2' group by cas_datos ->'USG_TIP_COMB_VALOR'"
                }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
            var barData = [];
            titulos = [];
            valores = [];
            $scope.totalcomb = 0 ;
            $scope.leyendatip= JSON.parse(response[0].ejecutartojson);
            i = 0;
            angular.forEach(jsonData,function(celda, fila){
                $scope.totalcomb = $scope.totalcomb  + parseInt(celda.suma);
                titulos[i] = celda.nom;
                valores[i] = celda.suma;
                barData[i] = {
                    value: celda.suma,
                    color: color[i],    
                    highlight: "#1C604E",
                    label: celda.nom
                };
                i++;
            });
            
            var barOptions = {
                segmentShowStroke: true,
                segmentStrokeColor: "#fff",
                segmentStrokeWidth: 2,
                percentageInnerCutout: 45, 
                animationSteps: 100,
                animationEasing: "easeOutBounce",
                animateRotate: true,
                animateScale: false,
                responsive: true,
            }
            var ctx = document.getElementById("barChart1").getContext("2d");
            var myNewChart = new Chart(ctx).Doughnut(barData, barOptions);
            $.unblockUI();
        }).error(function(error) {
        });
    };
    $scope.vales = function(){
        $scope.totalVales = 0;
        $scope.totalValesAsignados = 0;
        $scope.totalValesDevueltos = 0;
        var parametros = {
                "procedure_name":"ejecutartojson",
                "body":{
                    "params": [
                    {
                        "name":"expression",
                        "param_type":"IN","value":"select jsonb_array_length(cas_datos ->'USG_USA_DOS'),cas_datos ->'USG_USA_DOS' as vales from _fr_casos  where cas_datos->>'g_tipo' ='USG_COMB' and cas_datos ->>'USG_USA_DOS' not like '%unde%' and  jsonb_array_length(cas_datos ->'USG_USA_DOS') > 1 "
                    }]
                }
            };
            DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
                jsonData = JSON.parse(response[0].ejecutartojson); 
                for(var i = 0; i< jsonData.length ; i++){ 
                    for(var j = 1; j< jsonData[i].jsonb_array_length ; j++){
                        var val = jsonData[i].vales;
                        if(val[j].USG_CANT_UTIL == ''){
                            val[j].USG_CANT_UTIL = 0;
                        }
                        if(val[j].USG_CANT_VNO_UTIL == ''){
                            val[j].USG_CANT_VNO_UTIL = 0;
                        }
                        $scope.totalValesAsignados = $scope.totalValesAsignados + parseInt(val[j].USG_CANT_UTIL);
                        $scope.totalValesDevueltos = $scope.totalValesDevueltos + parseInt(val[j].USG_CANT_VNO_UTIL);
                        $scope.totalVales = $scope.totalValesDevueltos + $scope.totalValesAsignados;
                    } 
                }
                $.unblockUI();
            }).error(function(error){   
                $.unblockUI();
            });
    }
    $scope.vehiculo = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",

                    "param_type":"IN","value":" select count(*) as suma, cas_datos->'USG_TIP_MOT_VALOR' as nom from _fr_casos where cas_datos->>'g_tipo' ='USG_COMB' and cas_datos->>'USG_TIP_MOT_VALOR'<>'undefined' group by cas_datos->'USG_TIP_MOT_VALOR'"
                }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
            $scope.vehiculos = JSON.parse(response[0].ejecutartojson);
            var doughnutData = [];
            $scope.total= 0;
            $scope.moto = 0;
            $scope.totalveh = 0;
            i=0;
            angular.forEach(jsonData,function(celda, fila){
                $scope.totalveh = $scope.totalveh + parseInt(celda.suma);
                doughnutData[i] = {
                    value: celda.suma,
                    color: color[i],    
                    highlight: "#1C604E",
                    label: celda.nom
                };
                i++;
            });
            var doughnutOptions = {
                segmentShowStroke: true,
                segmentStrokeColor: "#fff",
                segmentStrokeWidth: 2,
                percentageInnerCutout: 45,
                animationSteps: 100,
                animationEasing: "easeOutBounce",
                animateRotate: true,
                animateScale: false,
                responsive: true,
            };
            var ctx = document.getElementById("doughnutChart").getContext("2d");
            var myNewChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);
            $.unblockUI();
        }).error(function(error) {
        });
    };
    $scope.$on('api:ready', function() {
        $scope.combustible();
        $scope.vehiculo();
        $scope.vales();
    });

    $scope.inicioGrafica = function() {
      if(DreamFactory.api[CONFIG.SERVICE]){ 
        $scope.combustible();
        $scope.vehiculo();
        $scope.vales();
      }
    }; 
});
