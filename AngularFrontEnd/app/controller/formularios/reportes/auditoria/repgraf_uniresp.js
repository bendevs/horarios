app.controller('reportgrafAudi', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
  color=["#04FCAD","#FF0000","#02C895" ,"#05DEA6", "07BE8F", "#20E5A7", "#2FD5A0","#34D19F","#3ACD9E","#3EC69A","#42BC95","#48BA96","#50B495","#53A68C","#4E9C84","#509781","#528F7C","#4F8171","#446D60","#3A6255","#385B50","#335248","#5B6B66","#5B6361","#055641"]

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
  $scope.calcular = function(valor){
    console.log("AQUI ESTA EL VALORR",valor);
    $scope.nesecito = parseInt(valor.toString());
    console.log("parse",$scope.nesecito);
  }
  $scope.tercero = false;

  $scope.buscarUO = function(valor){
    $.blockUI();
    if(valor == undefined){
      sweet.show('', 'Ingrese Datos porfavor', 'warning');
      $.unblockUI();
    }
     $scope.cont_si = 0;
     $scope.cont_no = 0;
    console.log("este e el valor=>",valor);
    valor = valor.toUpperCase();
    console.log(valor);
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",
          "param_type":"IN","value":"select distinct (cas_datos -> 'NODO') as cas_nodo_id , nodo_nombre,cas_datos from _fr_casos inner join ct_nodos on (cas_datos ->> 'NODO')::text like nodo_id::text  where cas_nombre_caso like '"+valor+"' and cas_id_padre::text <> ''"
        }]
      }
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      console.log(response.length);
      if(response.length > 0){
        $scope.unidades = JSON.parse(response[0].ejecutartojson);
        $scope.informacion = JSON.parse(response[0].ejecutartojson);
        console.log("datossss", $scope.informacion);
        for (var i = 0; i < $scope.informacion.length; i++) {
        console.log("-----------",$scope.informacion[i].cas_datos.AI_ACEP_RESPUESTAF1_VALOR);
          if($scope.informacion[i].cas_datos.AI_ACEP_RESPUESTAF1_VALOR == "SI"){
            $scope.cont_si = $scope.cont_si + 1;
          }
          else {
            $scope.cont_no = $scope.cont_no + 1;
          }
        }
        $.unblockUI();
      }
      else{
        $.unblockUI();
        sweet.show('', 'Este tramite no cuenta con unidades', 'warning');
      }

    })
    obj.error(function(error) {
      $.unblockUI();
      sweet.show('', 'error', 'error');
    });
  }

  $scope.generarGrafica = function(datos){
    console.log("DATOSSS",datos);
   var uo = parseInt(datos);
    console.log(uo);
    $scope.importante = datos;
    console.log("informacion",$scope.informacion);
    if(datos == undefined || datos == ''){
            $scope.segundo = "false";
            $scope.primero = "true";
            $scope.tercero = "true";
            $scope.valores = $scope.informacion[0].cas_datos.AI_G_ORDEN;
            console.log("VALORESS",$scope.valores);
            $scope.datatramites = $scope.valores;
            var respuestas = [];
            respuestas[0] = $scope.cont_si;
            respuestas[1] = $scope.cont_no;
            $scope.resp_si = parseInt($scope.cont_si);
            $scope.resp_no = parseInt($scope.cont_no);
            $scope.sumaresp = parseInt($scope.cont_si) + parseInt($scope.cont_no);
            var respuestas_valores = [];
            respuestas_valores[0] = "SI";
            respuestas_valores[1] = "NO";
            var doughnutData = [];

            for (var i = 0; i < 2; i++) {
              doughnutData[i] = {
                  value: respuestas[i],
                  color: color[i],
                  highlight: "#1C604E",
                  label: respuestas_valores[i]
              };
            }

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
    }
    else{
      $scope.tercero = "true";
      $scope.primero = "false";
      $scope.segundo = "true";
      for (var i = 0; i < $scope.informacion.length; i++) {
          if($scope.informacion[i].cas_nodo_id == datos){
            $scope.cas_datos = $scope.informacion[i].cas_datos;
            $scope.respuestaa =  $scope.informacion[i].cas_datos.AI_ACEP_RESPUESTAF1_VALOR;
            console.log("ESTOS SON LOS DATOS",$scope.cas_datos.AI_G_ORDEN);
            console.log("ESTOS SON LOS DATOS",$scope.cas_datos.AI_G_ORDEN.length);
            if($scope.respuestaa == "SI"){
              $scope.totalres = $scope.cont_si;
              $scope.color = "#04FCAD";
            }
            else{
              $scope.totalres = $scope.cont_no;
              $scope.color = "#FF0000";
            }
            for (var j = 1; j < $scope.cas_datos.AI_G_ORDEN.length; j++) {
              if (parseInt($scope.informacion[i].cas_nodo_id) == parseInt($scope.cas_datos.AI_G_ORDEN[j].AI_G_ORDEN_UO_valor)) {
                    console.log("datoss",$scope.cas_datos.AI_G_ORDEN[j]);
                    $scope.datatramites = $scope.cas_datos.AI_G_ORDEN[j];
              }
            }
          }
        }
        var respuestas = [];
        respuestas[0] = $scope.cont_si;
        respuestas[1] = $scope.cont_no;
        $scope.resp_si = parseInt($scope.cont_si);
        $scope.resp_no = parseInt($scope.cont_no);
        $scope.sumaresp = parseInt($scope.cont_si) + parseInt($scope.cont_no);
        var respuestas_valores = [];
        respuestas_valores[0] = "SI";
        respuestas_valores[1] = "NO";
        var doughnutData = [];

        for (var i = 0; i < 1; i++) {
          doughnutData[i] = {
              value: $scope.totalres,
              color: $scope.color,
              highlight: "#1C604E",
              label: $scope.respuestaa
          };
        }

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
    }
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
    $scope.deshabilito = "holaad";
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
      $scope.deshabilito = "holaad";
    }
  };
});
