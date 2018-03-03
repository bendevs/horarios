app.controller('usgvehController', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
  color=["#04FCAD","#02C895", "#05DEA6", "07BE8F", "#20E5A7", "#2FD5A0","#34D19F","#3ACD9E","#3EC69A","#42BC95","#48BA96","#50B495","#53A68C","#4E9C84","#509781","#528F7C","#4F8171","#446D60","#3A6255","#385B50","#335248","#5B6B66","#5B6361","#055641"]
  $scope.vehiculo = function() {
    $.blockUI();
    var parametros = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",
          "param_type":"IN","value":" select count(*) as suma, cas_datos ->> 'USG_SOL_VH_VALOR' as tipo from _fr_casos where cas_datos ->> 'USG_SOL_VH_VALOR' like '%MANTENIMIENTO' or cas_datos ->> 'USG_SOL_VH_VALOR' like '%DIAGNÓSTICO' and cas_datos ->>'USG_ASIGNADO'<>'undefined' and cas_datos ->>'USG_ASIGNADO'<>'' AND cas_datos ->> 'USG_SOL_VH_VALOR'<>'undefined' and cas_datos ->> 'USG_SOL_VH'<>'undefined' group by cas_datos ->> 'USG_SOL_VH_VALOR'"
        }]
      }
    };
    DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
      jsonData = JSON.parse(response[0].ejecutartojson);
      var doughnutData = [];
      $scope.totalvehiculo = 0;
      $scope.diagnostico = 0;
      $scope.diagnosticomantenimiento = 0;
      $scope.mantenimiento =0;
      i=0;
      angular.forEach(jsonData,function(celda, fila){
        if (celda.tipo =='DIAGNÓSTICO') 
        {
          $scope.diagnostico =  $scope.diagnostico + parseInt(celda.suma);
        }
        if (celda.tipo =='DIAGNÓSTICO Y MANTENIMIENTO') 
        {
          $scope.diagnosticomantenimiento =  $scope.diagnosticomantenimiento + parseInt(celda.suma);
        }
        if (celda.tipo =='MANTENIMIENTO') 
        {
          $scope.mantenimiento =  $scope.mantenimiento + parseInt(celda.suma);
        }
        $scope.totalvehiculo = $scope.diagnostico + $scope.diagnosticomantenimiento + $scope.mantenimiento;
        doughnutData[i] = {
          value: celda.suma,
          color: color[i],
          highlight: "#1C604E",
          label: celda.tipo
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
  $scope.graficarColumna = function () {
    var chart1;
    $(function() {
      var newh = $("#box").height();
      $( window ).resize(function() {
        newh = $("#box").height();
        chart1.redraw();
        chart1.reflow();
      });
      chart1 = new Highcharts.Chart({
        title: {
          text: ' ' 
        },
        chart: {
          type: 'column',
          renderTo: 'container'
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
  $scope.unidad = function() {
    $.blockUI();
    var parametros = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",
          "param_type":"IN","value":" select count(cas_id)as suma ,cas_datos ->>'USG_UO_SOL_VALOR' as unidad from _fr_casos where cas_datos->>'g_tipo' = 'USG_VHTEM' and cas_datos ->>'USG_UO_SOL_VALOR' <>'undefined'and cas_datos ->>'USG_UO_SOL_VALOR'<>'-- Seleccione --' group by cas_datos ->>'USG_UO_SOL_VALOR' ORDER BY  unidad ASC"
        }]
      }
    };
    DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
      jsonData = JSON.parse(response[0].ejecutartojson);
      $scope.grupos = JSON.parse(response[0].ejecutartojson);
      $scope.cantidad=0;
      for(i=0; i<$scope.grupos.length;i++)
      {
        mapaObject = new Object();
        mapaObject.data = [];
        mapaObject.name = $scope.grupos[i].unidad;
        mapaObject.data[0] = parseInt($scope.grupos[i].suma);
        mapaObjectFinal[i] = mapaObject;
        $scope.cantidad = $scope.cantidad + parseInt($scope.grupos[i].suma);
      }
      $scope.graficarColumna();
      $.unblockUI();
      $scope.leyendaser= JSON.parse(response[0].ejecutartojson);           
    }).error(function(error) {
    });
  };
  $scope.$on('api:ready', function() {
    Highcharts.setOptions(Highcharts.theme);
    $scope.vehiculo();
    $scope.unidad();
  });
  $scope.inicioGrafica = function() {
    if(DreamFactory.api[CONFIG.SERVICE]){ 
      Highcharts.setOptions(Highcharts.theme);         
      $scope.vehiculo();
      $scope.unidad();
    }
  }; 
});
