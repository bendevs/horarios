app.controller('PatriRep', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
  $scope.registro = {};
  $scope.tablaReporte = null;
  $scope.filename = "reporteDinamico";
  $scope.graficaP=false;
  $scope.tablatramite=true;
  var mapaObject = new Object();
  var mapaObjectFinal = new Array();
  $scope.getReportes = function(){
    $.blockUI();
    var resReportes = {
      "procedure_name":"sp_reportes"
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resReportes);
    obj.success(function (response) {
      $scope.obtReportes = response;
      $.unblockUI();
    })
    obj.error(function(error) {
      $.unblockUI();
    });
  };
  $scope.categoria=function(numero){
    switch (numero){
      case '1':
      $scope.getReportesGrafica();
      break;
      case '2':
      $scope.getReportesGraficaInmuebles();
      break;
      case '3':
      $scope.getReportesGraficaInmaterial();
      break;
      case '4':
      $scope.getReportesGraficaArqueologia();
      break;
      default: console.log("se fue al default--:/");
    }
  };
  $scope.getReportesGrafica = function(){
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select count(*) as suma , cas_datos ->> 'g_tipo' as tipo from _fr_casos where cas_nombre_caso like '%PTR%' and cas_datos ->> 'g_tipo' like '%PTR%' group by cas_datos ->> 'g_tipo' order by cas_datos ->> 'g_tipo' "
        }
        ]
      }
    };

    mapaObjectFinal = [];
    mapaObject = [];
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      $scope.grupos = JSON.parse(response[0].ejecutartojson);
      $scope.grupos[2].nombre='CONJUNTOS';
      $scope.grupos[1].nombre='BIENES INMUEBLES';
      $scope.grupos[3].nombre='ESPACIOS ABIERTOS';
      $scope.grupos[0].nombre='PATRIMONIO ARQUITECTONICO';
      $scope.grupos[4].nombre='MONUMENTOS Y ESCULTURAS';
      $scope.grupos[5].nombre='PATRIMONIO INMATERIAL';
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
      $scope.tablatramite=false;
      $scope.graficarTorta();
      $.unblockUI();
    })
    obj.error(function(error) {
      sweet.show('', 'error', 'error');
    });
  };
  $scope.getReportesGraficaInmuebles = function(){
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select count(*) as suma, cas_datos ->> 'PTR_CATEGORIA' as tipo from _fr_casos where cas_nombre_caso like '%PTR_CBI%' and cas_datos ->> 'g_tipo' like '%PTR_CBI%' group by cas_datos ->> 'PTR_CATEGORIA'order by tipo"
        }
        ]
      }
    };

    mapaObjectFinal = [];
    mapaObject = [];
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      $scope.grupos = JSON.parse(response[0].ejecutartojson);
      for(i=0; i<$scope.grupos.length;i++)
      {
        $scope.grupos[i].nombre='BIENES INMUEBLES DE CATEGORIA '+$scope.grupos[i].tipo;
      }
      $scope.gr
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
      $scope.tablatramite=false;
      $scope.graficarTorta();
      $.unblockUI();

    })
    obj.error(function(error) {
      sweet.show('', 'error', 'error');
    });
  };
  $scope.getReportesGraficaInmaterial = function(){
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select count(*) as suma, cas_datos ->> 'PTR_AREAS' as tipo from _fr_casos where cas_nombre_caso like '%PTR%' and cas_datos ->> 'PTR_AREAS'like '%%' group by cas_datos ->> 'PTR_AREAS' order by tipo"
        }
        ]
      }
    };
    mapaObjectFinal = [];
    mapaObject = [];
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      $scope.grupos = JSON.parse(response[0].ejecutartojson);
      $scope.grupos[0].nombre='AMBITO I TRADICIONES Y EXPRESIONES ORALES';
      $scope.grupos[1].nombre='AMBITO II ARTES DEL ESPECTACULO';
      $scope.grupos[2].nombre='AMBITO III USOS SOCIALES, RITUALES Y ACTOS FESTIVOS';
      $scope.grupos[3].nombre='AMBITO IV CONOCIMIENTOS Y USOS RELACIONADOS CON LA NATURALEZA Y EL UNIVERSO';
      $scope.grupos[4].nombre='AMBITO V TÉCNICAS ARTESANALES TRADICIONALES';
      $scope.grupos[5].nombre='PERSONAJES RELACIONADOS CON LAS TRADICIONES ORALES';
      $scope.grupos[6].nombre='PATRIMONIO CULTURAL INMATERIAL DE LA CIUDAD DE LA PAZ';
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
      $scope.tablatramite=false;
      $scope.graficarTorta();
      $.unblockUI();

    })
    obj.error(function(error) {
      sweet.show('', 'error', 'error');
    });
  };
  $scope.getReportesGraficaArqueologia = function(){
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select count(*) as suma, cas_datos ->> 'PTR_ARQ' as tipo from _fr_casos where cas_nombre_caso like '%PTR%' and cas_datos ->> 'PTR_ARQ' like '%%' group by cas_datos ->> 'PTR_ARQ' order by tipo"
        }
        ]
      }
    };
    mapaObjectFinal = [];
    mapaObject = [];
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      $scope.grupos = JSON.parse(response[0].ejecutartojson);
      $scope.grupos[0].nombre='PATRIMONIO ARQUEOLOGICO MUEBLE';
      $scope.grupos[1].nombre='PATRIMONIO ARQUEOLOGICO INMUEBLE O YACIMIENTO';
      for(i=0; i<$scope.grupos.length;i++)
      {
        $scope.grupos[i].tipo='ARQ'+$scope.grupos[i].tipo
      }
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
      $scope.tablatramite=false;
      $scope.graficarTorta();
      $.unblockUI();

    })
    obj.error(function(error) {
      sweet.show('', 'error', 'error');
    });
  };
  $scope.graficarTorta = function () {
    $('#containerdato').highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Tramites'
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
  $scope.pdf = function(image){
    var doc = new jsPDF('p', 'pt');
    var header = function (data) {
      doc.setFontSize(8);
      doc.setTextColor(255);
      doc.setFontStyle('normal');
      doc.addImage(cultural, 'JPEG', 40, 20, 540, 80);
      doc.text('GOBIERNO AUTONÓMO MUNICIPAL DE LA PAZ', data.settings.margin.left + 160, 65);
      doc.text('SECRETARIA MUNICIPAL DE CULTURAS', data.settings.margin.left + 160, 75);
      doc.text('DIRECCIÓN DE PATRIMONIO CULTURAL', data.settings.margin.left + 160, 85);
      doc.text('REPORTE DE GRAFICO', data.settings.margin.left + 160, 95);
    };
    var res = doc.autoTableHtmlToJson(document.getElementById("Tramite"));
    doc.autoTable(res.columns, res.data, {theme: 'plain',startY: 120,beforePageContent: header,headerStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},bodyStyles: {rowHeight: 12, fontSize: 7, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto'});
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
    $scope.getReportes();
  });
  $scope.inicioActuaciones = function () {
    if(DreamFactory.isReady()){
    }
  };
});
