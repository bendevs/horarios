app.controller('graficaDemoController', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
 color=["#99FFFF","#99CCFF", "#9999FF", "#9966FF", "#9933FF", "#9900FF"]
   /*radial tela de araña*/
    $scope.genero = function(){
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",
                    "param_type":"IN","value":"select count (cas_id) as suma,  cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR' as nombre, cas_datos ->> 'CIM_NN_GENERO_VALOR' as genero from _fr_casos where cas_datos->>'g_tipo' = 'cims' and cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR' not ilike '%unde%' and cas_datos ->> 'CIM_NN_GENERO_VALOR' not ilike '%unde%' group by cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR', cas_datos ->> 'CIM_NN_GENERO_VALOR' order by cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR', cas_datos ->> 'CIM_NN_GENERO_VALOR'"
                }
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){           
            jsonData = JSON.parse(response[0].ejecutartojson);
            titulos = [];
            femenino = [];
            masculino = [];
            anterior = '';
            i = 0;
            j=0;            
            angular.forEach(jsonData,function(celda, fila){
                if(celda.nombre==anterior)
                {                    
                    anterior = celda.nombre;
                    masculino[i] = celda.suma;
                    j=0;
                    i++;
                }
                else
                {
                    if(j==0)
                    {
                        if(celda.genero=='FEMENINO')
                        {
                            anterior = celda.nombre;
                            titulos[i] = celda.nombre;
                            femenino[i] = celda.suma;
                            j=1;
                        }
                        else
                        {
                            femenino[i] = 0; 
                            anterior = celda.nombre;
                            titulos[i] = celda.nombre;
                            masculino[i] = celda.suma;
                            j=0;
                            i++;
                        }
                    }
                    else
                    {
                        if(celda.genero=='FEMENINO')
                        {
                            masculino[i] = 0;
                            i++;
                            anterior = celda.nombre;
                            titulos[i] = celda.nombre;
                            femenino[i] = celda.suma;
                            j=1;
                        }
                        else
                        {
                            masculino[i] = 0;
                            i++;
                            femenino[i]= 0; 
                            anterior = celda.nombre;
                            titulos[i] = celda.nombre;
                            masculino[i] = celda.suma;
                            j=0;
                            i++;
                        }
                    }
                }
            });
                var radarData = {
                    labels: titulos,// todo lo guardado en el array
                    datasets: [
                    {
                        label: "Femenino",
                        fillColor: "rgba(220,220,220,0.2)", //color de 0 a 225 rojo,verde y azul  dentro del area
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",// los puntos
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: femenino
                    },
                    {
                        label: "Masculino",
                        fillColor: "rgba(26,179,148,0.2)",
                        strokeColor: "rgba(26,179,148,1)",
                        pointColor: "rgba(26,179,148,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: masculino
                    }
                    ]
                };

                var radarOptions = {
                    scaleShowLine: true,
                    angleShowLineOut: true,
                    scaleShowLabels: true,
                    ShowLabels: true,
                    scaleBeginAtZero: true,
                    angleLineColor: "rgba(0,0,0,.1)",
                    angleLineWidth: 1,
                    pointLabelFontFamily: "'Arial'",
                    pointLabelFontStyle: "normal",
                    pointLabelFontSize: 10,
                    pointLabelFontColor: "#666",
                    pointDot: true,
                    pointDotRadius: 1,
                    pointDotStrokeWidth: 1,
                    pointHitDetectionRadius: 10,
                    datasetStroke: true,
                    datasetStrokeWidth: 2,
                    datasetFill: true,
                    responsive: true,
                }

                var ctx = document.getElementById("radarChart").getContext("2d");
                var myNewChart = new Chart(ctx).Radar(radarData, radarOptions);                
                $.unblockUI();
        }).error(function(error) 
        {

        });        
    };
    /*dona*/

$scope.genero1 = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
              "params": [
              {
                "name":"expression",

                "param_type":"IN","value":"select sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 1 else 0 end)as femenino,sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 0 else 1 end) as masculino from _fr_casos where cas_datos->>'g_tipo' = 'cims' and cas_datos ->> 'CIM_NN_APROBAR_INSCRIPCION'='1'"
              }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
            var doughnutData = [];
            
            angular.forEach(jsonData,function(celda, fila){
                $scope.femenino=celda.femenino;
             $scope.masculino=celda.masculino;
             $scope.col=color[0];
             $scope.col1=color[1];
                doughnutData[0] = {
                    value: celda.femenino,
                    color: color[0] ,//color[0] //"#44CC11"
                    highlight: "#9933CC",
                    label: 'Femenino'   
                };  
                 doughnutData[1] = {
                    value: celda.masculino,
                    color:  color[1], //"#a3e1d4",//color[1]
                    highlight: "#9933CC",
                    label: 'Masculino'
                };                     
            });

            var doughnutOptions = {
                segmentShowStroke: true,
                segmentStrokeColor: "#fff",
                segmentStrokeWidth: 2,
                percentageInnerCutout: 45, // This is 0 for Pie charts
                animationSteps: 100,
                animationEasing: "easeOutBounce",
                animateRotate: true,
                animateScale: false,
                responsive: true,
            };

            var ctx = document.getElementById("doughnutChart2").getContext("2d");
            var myNewChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);
            $.unblockUI();
        }).error(function(error) {
        });
    };
    /*-- linea grafica-*/

  $scope.tipoinscritos = function(){
        $.blockUI();
          var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
              "params": [
              {
                "name":"expression",

                "param_type":"IN","value":"select count (cas_id) as suma, cas_datos ->> 'CIM_NNE_CLASIFICACION_VALOR' as tipo,  cas_datos ->> 'CIM_NNE_CLASIFICACION_VALOR' as nombre from _fr_casos where cas_datos->>'g_tipo' = 'cims' and cas_datos ->> 'CIM_NNE_CLASIFICACION_VALOR' not ilike '%unde%' group by cas_datos ->> 'CIM_NNE_CLASIFICACION_VALOR'"
            }]
            }
        };
         DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
                    titulos = [];
                    valores = [];
                    i = 0;
                    $scope.acum = 0;
                    $scope.aportante = 0;
                    $scope.becado = 0;
                    $scope.mediabeca = 0;
                    $scope.becacompleta = 0;
                    angular.forEach(jsonData,function(celda, fila){
                            titulos[i] = celda.nombre;
                            valores[i] = celda.suma;
                            $scope.acum = $scope.acum + parseInt(celda.suma); 
                            i++;

                            if(celda.nombre =='APORTANTE')
                            {
                                $scope.aportante =  $scope.aportante + parseInt(celda.suma);
                            }
                           
                            
                                    if(celda.nombre == 'BECADO')
                                    {
                                         $scope.becado =  $scope.becado + parseInt(celda.suma);
                                    }
                                

                                
                                            if(celda.nombre == 'MEDIA BECA')
                                            {
                                                $scope.mediabeca = $scope.mediabeca + parseInt(celda.suma);
                                            }
                                        
                                        
                                            if(celda.nombre == 'BECA COMPLETA')
                                            {
                                                $scope.becacompleta =  $scope.becacompleta + parseInt(celda.suma);
                                            }
                                
                                
                    });
                        var lineData = {
                            labels: titulos,
                            datasets: [
                                {
                                    label: "Example dataset",
                                    fillColor: "rgba(220,220,220,0.5)",
                                    strokeColor: "rgba(220,220,220,1)",
                                    pointColor: "rgba(220,220,220,1)",
                                    pointStrokeColor: "#fff",
                                    pointHighlightFill: "#fff",
                                    pointHighlightStroke: "rgba(220,220,220,1)",
                                    data:valores
                                }
                            ]
                         };

                var lineOptions = {
                    scaleShowGridLines: true,
                    scaleGridLineColor: "rgba(0,0,0,.05)",
                    scaleGridLineWidth: 1,
                    bezierCurve: true,
                    bezierCurveTension: 0.4,
                    pointDot: true,
                    pointDotRadius: 4,
                    pointDotStrokeWidth: 1,
                    pointHitDetectionRadius: 20,
                    datasetStroke: true,
                    datasetStrokeWidth: 2,
                    datasetFill: true,
                    responsive: true,
                }          
          

            var ctx = document.getElementById("lineChart").getContext("2d");
            var myNewChart = new Chart(ctx).Line(lineData, lineOptions);
            $.unblockUI();
        }).error(function(error) {
        });

    }; 

    $scope.inscritos = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
              "params": [
              {
                "name":"expression",

                "param_type":"IN","value":" select count (cas_id) as suma, cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR' as tipo,  cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR' as nombre from _fr_casos where cas_datos->>'g_tipo' = 'cims' and cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR' not ilike '%unde%'  group by cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR'"
              }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
            titulos = [];
            valores = [];
            i = 0;
         //   $scope.acum = 0;
            angular.forEach(jsonData,function(celda, fila){
                titulos[i] = celda.nombre;
                valores[i] = celda.suma;
             //  $scope.acum = $scope.acum + parseInt(celda.suma); 
                i++;
            });
            var barData = {
                labels: titulos,
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(93, 232, 247, 0.6)",
                        strokeColor: "rgba(93, 232, 247, 0.6)",
                        highlightFill: "rgba(130, 0, 255, 0.6)", //color de cambio
                        highlightStroke: "rgba(220,220,220,1)",
                        data: valores
                    }
                ]
            };
            var barOptions = {
                scaleBeginAtZero: true,
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)", //lineas de fondo
                scaleGridLineWidth: 1,
                barShowStroke: true,
                barStrokeWidth: 2,
                barValueSpacing: 5,
                barDatasetSpacing: 1,
                responsive: true,
            }
            var ctx = document.getElementById("barChart").getContext("2d");
            var myNewChart = new Chart(ctx).Bar(barData, barOptions);
            $.unblockUI();
        }).error(function(error) {
        });
    };

    $scope.grupos = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
              "params": [
              {
                "name":"expression",

                "param_type":"IN","value":" select count (cas_id) as suma, cas_datos ->> 'CIM_NN_GRUPO_ETAREO_VALOR' as tipo , cas_datos ->> 'CIM_NN_GRUPO_ETAREO_VALOR' as nombre from _fr_casos where cas_datos->>'g_tipo' = 'cims' and cas_datos ->> 'CIM_NN_GRUPO_ETAREO_VALOR' not ilike '%unde%' group by cas_datos ->> 'CIM_NN_GRUPO_ETAREO_VALOR' "
              }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
            var doughnutData = [];
            $scope.lactante = 0;
            $scope.preinfante = 0;
            $scope.infante =0;
            i=0;
            angular.forEach(jsonData,function(celda, fila){
                /*if(celda.nombre =='APORTANTE')
                            {
                                $scope.aportante =  $scope.aportante + parseInt(celda.suma);
                            }*/
                if (celda.nombre =='LACTANTE') 
                  {
                    $scope.lactante =  $scope.lactante + parseInt(celda.suma);
                  }

                    if (celda.nombre =='PRE INFANTE') 
                      {
                        $scope.preinfante =  $scope.preinfante + parseInt(celda.suma);
                      }
                        if (celda.nombre =='INFANTE') 
                          {
                            $scope.infante =  $scope.infante + parseInt(celda.suma);
                          }

                doughnutData[i] = {
                    value: celda.suma,
                    color: color[i],//"#a3e1d4", //color[i],
                    highlight: "#9933CC",
                    label: celda.nombre
                };
                i++;
            });
            var doughnutOptions = {
                segmentShowStroke: true,
                segmentStrokeColor: "#fff",
                segmentStrokeWidth: 2,
                percentageInnerCutout: 45, // This is 0 for Pie charts
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
        $scope.inscritos();
        $scope.grupos();
        $scope.tipoinscritos();
        $scope.genero();
        $scope.genero1();
         /*  var ctx = document.getElementById("lineChart").getContext("2d");
            var myNewChart = new Chart(ctx).Line(lineData, lineOptions);*/
       
    });

    $scope.inicioGrafica = function() {
      if(DreamFactory.api[CONFIG.SERVICE]){          
        $scope.inscritos();
        $scope.grupos();
        $scope.tipoinscritos();
        $scope.genero();
        $scope.genero1();
      }
    }; 

});
