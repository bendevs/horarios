app.controller('serviciosCims', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
  $scope.registro = {};
  $scope.tablaReporte = null;
  $scope.graficaP=false;
  var mapaObject = new Object();
  var mapaObjectFinal = new Array();
  var categorias = new Array();
  var datamasc = new Array();
  var datafem = new Array();
  $scope.limpiar = function(){
    $scope.datatramite='';
    $scope.cantidad = 0;
    document.getElementById('containerdato').innerHTML='';
    $scope.titulorep = '';
  }
  $scope.categoria = function(numero){
    switch (numero){
      case '1':
      $scope.getReportesEtereo();
      $scope.titulorep = "REPORTE ESTADISTICO POR GRUPO ETAREO - CLASIFICACION";
      break;
      case '2':
      $scope.getReportesInscritos();
      $scope.titulorep = "REPORTE ESTADISTICO TIPO DE INSCRITOS"
      break;
      case '3':
      $scope.getReportesCentroInfantil();
      $scope.titulorep = "REPORTE ESTADISTICO POR CENTRO INFANTIL"
      break;
      case '4':
      $scope.getReportesEdadGenero();
      $scope.titulorep = "REPORTE ESTADISTICO POR EDAD Y GENERO"
      break;
      default: console.log("se fue al default--:/");
    }
  };
  $scope.getReportesEtereo = function(){
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select count (cas_id) as suma, cas_datos ->> 'CIM_NN_GRUPO_ETAREO' as tipo , cas_datos ->> 'CIM_NN_GRUPO_ETAREO' as nombre from _fr_casos where cas_nombre_caso like '%cims%' and cas_datos ->> 'CIM_NN_GRUPO_ETAREO' not like '%unde%' and cas_datos ->> 'CIM_NN_PUNTAJE' != ''group by cas_datos ->> 'CIM_NN_GRUPO_ETAREO' "
        }]
      }
    };
    mapaObjectFinal = [];
    mapaObject = [];
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      console.log(response);
      $scope.grupos = JSON.parse(response[0].ejecutartojson);
      $scope.datatramite= $scope.grupos;
      $scope.cantidad=0;
      for(i=0; i<$scope.grupos.length;i++)
      {
        mapaObject = new Object();
        var longi = $scope.grupos[i].tipo;
        mapaObject.name = longi;
        mapaObject.y = parseInt($scope.grupos[i].suma);
        mapaObjectFinal[i] = mapaObject;
        $scope.cantidad=$scope.cantidad+mapaObject.y;
      }
      $scope.graficaP= true;
      $scope.graficarColumna();
      $.unblockUI();
    })
    obj.error(function(error) {
      sweet.show('', 'error', 'error');
    });
  };
  
  $scope.getReportesEdadGenero = function(){
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select count (cas_id) as suma, '0 - 1' as edad, '0 - 24 meses' as nombre,sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 1 else 0 end) femenino , sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 0 else 1 end) masculino from _fr_casos where cas_datos->>'g_tipo' = 'cims'   and  cas_datos ->> 'CIM_NN_EDAD_MESES'  <= '24' group by cas_datos ->> 'CIM_NN_EDAD_MESES'  <= '24 ' union select count (cas_id) as suma , '1 - 2' as edad, '25 - 48 meses' as nombre,sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 1 else 0 end) femenino , sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 0 else 1 end) masculino from _fr_casos where cas_datos->>'g_tipo' = 'cims'   and  cas_datos ->> 'CIM_NN_EDAD_MESES'  <= '48' and cas_datos ->> 'CIM_NN_EDAD_MESES'  > '24' group by cas_datos ->> 'CIM_NN_EDAD_MESES'  <= '48' and cas_datos ->> 'CIM_NN_EDAD_MESES'  > '24' union select count (cas_id) as suma , '2 - 3 meses' as edad, '49 - 72 meses' as nombre,sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 1 else 0 end) femenino , sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 0 else 1 end) masculino from _fr_casos where cas_datos->>'g_tipo' = 'cims'   and  cas_datos ->> 'CIM_NN_EDAD_MESES'  <= '72' and cas_datos ->> 'CIM_NN_EDAD_MESES'  > '48' group by cas_datos ->> 'CIM_NN_EDAD_MESES'  <= '72' and cas_datos ->> 'CIM_NN_EDAD_MESES'  > '48' union select count (cas_id) as suma , '3 - 4 meses' as edad, '73 - 96 meses' as nombre,sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 1 else 0 end) femenino , sum(case when cas_datos ->> 'CIM_NN_GENERO' = '1' then 0 else 1 end) masculino from _fr_casos where cas_datos->>'g_tipo' = 'cims'   and  cas_datos ->> 'CIM_NN_EDAD_MESES'  <= '96' and cas_datos ->> 'CIM_NN_EDAD_MESES'  > '72' group by cas_datos ->> 'CIM_NN_EDAD_MESES'  <= '96' and cas_datos ->> 'CIM_NN_EDAD_MESES'  > '72' order by edad"
        }]
      }
    };
    mapaObjectFinal = [];
    mapaObject = [];
    datafem = [];
    datamasc = [];
    categorias = [];
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      $scope.grupos = JSON.parse(response[0].ejecutartojson);
      $scope.datatramite= $scope.grupos;
      console.log($scope.grupos)
      $scope.cantidadf = 0;
      $scope.cantidadm = 0;
      for(i=0; i<$scope.grupos.length;i++)
      {
        datafem[i] = $scope.grupos[i].femenino;
        datamasc[i] = $scope.grupos[i].masculino;
        categorias[i] = $scope.grupos[i].nombre;
        mapaObject = new Object();
        var longi = $scope.grupos[i].tipo;
        mapaObject.name = longi;
        mapaObject.y = parseInt($scope.grupos[i].suma);
        mapaObjectFinal[i] = mapaObject;
        $scope.cantidad=$scope.cantidad+mapaObject.y;
        $scope.cantidadf =$scope.cantidadf + $scope.grupos[i].femenino;
        $scope.cantidadm=$scope.cantidadm + $scope.grupos[i].masculino;
      }
      $scope.graficaP= true;
      $scope.graficarClasNinos();
      $.unblockUI();
    })
    obj.error(function(error) {
      sweet.show('', 'error', 'error');
    });
  };
  $scope.getReportesInscritos = function(){
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select count (cas_id) as suma, cas_datos ->> 'CIM_NNE_CLASIFICACION_VALOR' as tipo,  cas_datos ->> 'CIM_NNE_CLASIFICACION_VALOR' as nombre from _fr_casos where cas_datos->>'g_tipo' = 'cims' and cas_datos ->> 'CIM_NNE_CLASIFICACION_VALOR' not ilike '%unde%' group by cas_datos ->> 'CIM_NNE_CLASIFICACION_VALOR' "  
        }]
      }
    };
    mapaObjectFinal = [];
    mapaObject = [];
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      $scope.grupos = JSON.parse(response[0].ejecutartojson); 
      $scope.datatramite= $scope.grupos;
      $scope.cantidad=0;
      for(i=0; i<$scope.grupos.length;i++)
      {
        mapaObject = new Object();
        var longi = $scope.grupos[i].tipo;
        mapaObject.name = longi;
        mapaObject.y = parseInt($scope.grupos[i].suma);
        mapaObjectFinal[i] = mapaObject;
        $scope.cantidad=$scope.cantidad+mapaObject.y;
      }
      $scope.graficaP= true;
      $scope.graficarColumna();
      $.unblockUI();

    })
    obj.error(function(error) {
      sweet.show('', 'error', 'error');
    });
  };
  $scope.getReportesCentroInfantil = function(){
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select count (cas_id) as suma, cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR' as tipo,  cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR' as nombre from _fr_casos where cas_datos->>'g_tipo' = 'cims' and cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR' not ilike '%unde%'  group by cas_datos ->> 'CIM_NN_NOMBRE_CIM_VALOR'"
        }]
      }
    };

    mapaObjectFinal = [];
    mapaObject = [];
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      $scope.grupos = JSON.parse(response[0].ejecutartojson);            
      $scope.datatramite= $scope.grupos;
      $scope.cantidad=0;
      for(i=0; i<$scope.grupos.length;i++){
        mapaObject = new Object();
        var longi = $scope.grupos[i].tipo;
        mapaObject.name = longi;
        mapaObject.y = parseInt($scope.grupos[i].suma);
        mapaObjectFinal[i] = mapaObject;
        $scope.cantidad=$scope.cantidad+mapaObject.y;
      }
      $scope.graficaP= true;
      $scope.graficarColumna();
      $.unblockUI();

    })
    obj.error(function(error) {
      sweet.show('', 'error', 'error');
    });
  };
  $scope.graficarTorta = function () {
    Highcharts.setOptions(Highcharts.theme);
    $('#containerdato').highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Grupos'
      },
      plotOptions: {
        column: {
          depth: 25,
          colorByPoint:true
        }
      },
      xAxis: {
        categories: [null, null]
      },
      yAxis: {
        title: {
          text: 'columna'
        }
      },
      series: [{
        name: 'Tramites',
        data: mapaObjectFinal
      }]
    });
  };
  $scope.graficarColumna = function () {
    Highcharts.setOptions(Highcharts.theme);
    $('#containerdato').highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'column'
      },
      title: {
        text: $scope.titulorep 
      },
      plotOptions: {
        column: {
          depth: 25,
          colorByPoint:true
        }
      },
      xAxis: {
        categories: [null, null]
      },
      yAxis: {
        title: {
          text: 'Niñ@s'
        }
      },
      series: [{
        name: '',
        data: mapaObjectFinal
      },
        {
            type: 'pie',
            name: 'Total consumption',
            data: mapaObjectFinal,
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
           }
      
      }]
    });
  };
  Highcharts.theme = {
   colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: null,
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
  $scope.graficarClasNinos = function(){
    Highcharts.setOptions(Highcharts.theme);
     $('#containerdato').highcharts({
        title: {
            text: 'Clasificacion de Niñ@s por Edad y Genero'
        },
        xAxis: {
            categories: categorias
        },
        yAxis: {
          title: {
            text: 'Niñ@s'
          }
        },
        labels: {
            items: [{
                html: 'Total de Niñ@s',
                style: {
                    left: '50px',
                    top: '18px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }]
        },
        series: [{
            type: 'column',
            name: 'Femenino',
            data: datafem
        }, {
            type: 'column',
            name: 'Masculino',
            data: datamasc
        },  {
            type: 'pie',
            name: 'Total consumption',
            data: [{
                name: 'Femenino',
                y: $scope.cantidadf,
                color: Highcharts.getOptions().colors[0] 
            }, {
                name: 'Masculino',
                y: $scope.cantidadm,
                color: Highcharts.getOptions().colors[1] 
            }],
            center: [100, 80],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    });
  };
  $scope.pdf = function(image){
    var doc = new jsPDF('p', 'pt');
    var header = function (data) {
      doc.setFontSize(9);
      doc.setTextColor(40);
      doc.setFontStyle('bold');
      doc.addImage(headerImgservicio1, 'JPEG', 35, 35, 540, 60);
      doc.setDrawColor(0,0,0); 
      doc.setLineWidth(1.5);
      doc.line(30,100,555,100);
      doc.text($scope.titulorep, 140, 110);
    };
    var res = doc.autoTableHtmlToJson(document.getElementById("Tramite"));
    doc.autoTable(res.columns, res.data, {theme: 'mary',startY: 120,beforePageContent: header,headerStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},bodyStyles: {rowHeight: 12, fontSize: 7, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto'});
    doc.text(" ",40,doc.autoTableEndPosY()+10);
    doc.addImage(image,'JPEG', 20, doc.autoTableEndPosY()+30,500, 220);
    doc.save('proceso.pdf');
  };
  $scope.cargarDatos = function()
  {
    html2canvas(document.getElementById("containerdato"),{
      onrendered: function(canvas){
        var img=canvas.toDataURL("image/png");
        $scope.pdf(img);
      }
    });
  };
  $scope.$on('api:ready',function(){
  });
  $scope.inicioActuaciones = function () {
    if(DreamFactory.isReady()){
    }
  };
});

