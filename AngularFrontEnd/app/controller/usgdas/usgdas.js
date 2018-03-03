app.controller('usgdasController', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
    color=["#04FCAD","#02C895", "#05DEA6", "07BE8F", "#20E5A7", "#2FD5A0","#34D19F","#3ACD9E","#3EC69A","#42BC95","#48BA96","#50B495","#53A68C","#4E9C84","#509781","#528F7C","#4F8171","#446D60","#3A6255","#385B50","#335248","#5B6B66","#5B6361","#055641"]
    $scope.servicio = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",
                    "param_type":"IN","value":" select count(cas_id) cantidad , cas_datos ->'USG_ASUNTO_CARP'->7->>'resvalor' as nombre from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->'USG_ASUNTO_CARP'->7->>'estado' = 'true' group by cas_datos ->'USG_ASUNTO_CARP'->7->>'resvalor' UNION select count(*) , cas_datos ->'USG_ASUNTO_CARP'->5->>'resvalor' as nom from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->'USG_ASUNTO_CARP'->5->>'estado' = 'true' group by cas_datos ->'USG_ASUNTO_CARP'->5->>'resvalor' UNION select count(*) , cas_datos ->'USG_ASUNTO_CARP'->2->>'resvalor' as nom from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->'USG_ASUNTO_CARP'->2->>'estado' = 'true' group by cas_datos ->'USG_ASUNTO_CARP'->2->>'resvalor' UNION select count(*) , cas_datos ->'USG_ASUNTO_CARP'->1->>'resvalor' as nom from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->'USG_ASUNTO_CARP'->1->>'estado' = 'true' group by cas_datos ->'USG_ASUNTO_CARP'->1->>'resvalor' UNION select count(*) , cas_datos ->'USG_ASUNTO_CARP'->3->>'resvalor' as nom from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->'USG_ASUNTO_CARP'->3->>'estado' = 'true' group by cas_datos ->'USG_ASUNTO_CARP'->3->>'resvalor' UNION select count(*) , cas_datos ->'USG_ASUNTO_CARP'->4->>'resvalor' as nom from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->'USG_ASUNTO_CARP'->4->>'estado' = 'true' group by cas_datos ->'USG_ASUNTO_CARP'->4->>'resvalor' UNION select count(*) , cas_datos ->'USG_ASUNTO_CARP'->6->>'resvalor' as nom from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->'USG_ASUNTO_CARP'->6->>'estado' = 'true' group by cas_datos ->'USG_ASUNTO_CARP'->6->>'resvalor'"
                }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
            titulos = [];
            valores = [];
            $scope.leyenda= JSON.parse(response[0].ejecutartojson); 
            $scope.grupos = JSON.parse(response[0].ejecutartojson);
            $scope.cantidad=0;
            for(i=0; i<$scope.grupos.length;i++)
            {
                mapaObject = new Object();
                mapaObject.data = [];
                var longi = $scope.grupos[i].nombre;
                mapaObject.name = longi;
                mapaObject.data[0] = parseInt($scope.grupos[i].cantidad);
                mapaObjectFinal[i] = mapaObject;
                $scope.cantidad = $scope.cantidad + parseInt($scope.grupos[i].cantidad); 
            }
            $scope.totalservicio = $scope.cantidad;
            $scope.graficarColumna(mapaObjectFinal,2);
        }).error(function(error) {
        });
    };
    $scope.graficarColumna = function (mapaObjectFinal,id) {
        var chart1;
        $(function() {
            var newh = $("#box"+id).height();
            $( window ).resize(function() {
                newh = $("#box"+id).height();
                chart1.redraw();
                chart1.reflow();
            });
            chart1 = new Highcharts.Chart({
                title: {
                    text: ' ' 
                },
                chart: {
                    type: 'column',
                    renderTo: 'container'+id
                },
                series:  mapaObjectFinal
                ,
                yAxis: {
                    title: {
                        text: ' '
                    }
                }
            });
        });
    };
    var mapaObject;
    var mapaObjectFinal=[];
    Highcharts.theme = {
        colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
        '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
            style: {
                fontFamily: 'Dosis, sans-serif'
            }
        },
        title: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }
        },
        tooltip: {
            borderWidth: 0,
            backgroundColor: 'rgba(219,219,216,0.8)',
            shadow: false
        },
        legend: {
            itemStyle: {
                fontWeight: 'bold',
                fontSize: '13px'
            }
        },
        xAxis: {
            gridLineWidth: 1,
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        yAxis: {
            minorTickInterval: 'auto',
            title: {
                style: {
                    textTransform: 'uppercase'
                }
            },
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        plotOptions: {
            candlestick: {
                lineColor: '#404048'
            }
        },
        background2: '#F0F0EA'
    };
    $scope.calificacion = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",

                    "param_type":"IN","value":" select  count(cas_id)as cantidad, cas_datos->>'USG_TRAB1' as calificacion from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->> 'USG_TRAB1' not ilike '%unde%' group by cas_datos ->>'USG_TRAB1'"
                }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
            $scope.calficaciones = JSON.parse(response[0].ejecutartojson);
            var doughnutData = [];
            $scope.totalcalficaciones = 0;
            i=0;
            angular.forEach(jsonData,function(celda, fila){
                $scope.totalcalficaciones = $scope.totalcalficaciones + parseInt(celda.cantidad);
                doughnutData[i] = {
                    value: celda.cantidad,
                    color: color[i],
                    highlight: "#1C604E",
                    label: celda.calificacion
                };
                i++;
            });
            $scope.totalatendido = $scope.totalcalficaciones;
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
    $scope.apoyo = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",
                    "param_type":"IN","value":"select sum(case when cas_datos ->> 'USG_APOYO' = '1' then 1 else 0 end) as suma , 'Apoyo' as nombre from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' UNION select sum(case when cas_datos ->> 'USG_APOYO' = '1' then 0 else 1 end) as suma , 'No Apoyo' as nombre from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT'" 
                }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            jsonData = JSON.parse(response[0].ejecutartojson);
            $scope.apoyo = JSON.parse(response[0].ejecutartojson);
            var doughnutData = [];
            var i = 0;
            $scope.totalapoyo = 0;
            angular.forEach(jsonData,function(celda, fila){
                $scope.totalapoyo = $scope.totalapoyo + parseInt(celda.suma);
                doughnutData[i] = {
                    value: celda.suma,
                    color: color[i],
                    highlight: "#1C604E",
                    label: celda.nombre
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
            var ctx = document.getElementById("doughnutChart3").getContext("2d");
            var myNewChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);
            $.unblockUI();
        }).error(function(error) {
        });
    };
    $scope.unidad_soli = function() {
        $.blockUI();
        var parametros = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",
                    "param_type":"IN","value":" select count(cas_id)as suma ,cas_datos ->>'USG_UO_SOL_VALOR' as unidad from _fr_casos where cas_datos->>'g_tipo' = 'USG-MANT' and cas_datos ->>'USG_UO_SOL_VALOR' <>'undefined'and cas_datos ->>'USG_UO_SOL_VALOR'<>'-- Seleccione --' group by cas_datos ->>'USG_UO_SOL_VALOR' ORDER BY  unidad ASC"
                }]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            console.log("aqui esta el resultado del sp===>",response);
            jsonData = JSON.parse(response[0].ejecutartojson);
            $scope.leyenda1= JSON.parse(response[0].ejecutartojson);
            i=0;
            $scope.grupos = JSON.parse(response[0].ejecutartojson);
            $scope.datatramite= $scope.grupos;
            $scope.cantidad=0;
            console.log("este es el tamaño==>",$scope.grupos.length);
            for(i=0; i<$scope.grupos.length;i++)
            {
                console.log($scope.grupos[i].suma);
                mapaObject = new Object();
                mapaObject.data = [];
                var longi = $scope.grupos[i].unidad;
                mapaObject.name = longi;
                mapaObject.data[0] = parseInt($scope.grupos[i].suma);
                mapaObjectFinal[i] = mapaObject;
                $scope.cantidad = $scope.cantidad + parseInt($scope.grupos[i].suma); 
            }
            $scope.totalunidad = $scope.cantidad;
            $scope.graficarColumna(mapaObjectFinal,1);
            $.unblockUI();
        }).error(function(error) {
        });
    };
    $scope.$on('api:ready', function() {
        $scope.servicio();
        $scope.calificacion();
        $scope.unidad_soli();
        $scope.apoyo(); 
    });
    $scope.inicioGrafica = function() {
        if(DreamFactory.api[CONFIG.SERVICE]){          
            $scope.servicio();
            $scope.calificacion();
            $scope.unidad_soli();
            $scope.apoyo();
        }
    }; 
});
