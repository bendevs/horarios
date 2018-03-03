app.controller('grafica_sdm', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
  $scope.registro = {};
  $scope.tablaReporte = null;
  $scope.filename = "reporteDinamico";
  $scope.graficaP=false;
  $scope.tablatramite=true;
  var mapaObject = new Object();
  var mapaObjectFinal = new Array();
  $scope.startDateOpen = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.startDateOpened = true;
  };
  $scope.startDateOpen1 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.startDateOpened1 = true;
  };
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
  $scope.categoria=function(numero,cod,registro){
    $scope.getReportesGraficaArqueologia(cod,registro);
  };
  $scope.fechini='';
  $scope.fechfin='';
  $scope.getReportesGraficaArqueologia = function(cod,registro){
    $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
    $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
    $scope.TablaCreacion = true;
    var reslocal = {
      "procedure_name":"sp_graf_sdm",
      "body":{
        "params": [            
        {
          "name":"fechini",
          "param_type":"IN","value":$scope.fechini
        },
        {
          "name":"fechfin",
          "param_type":"IN","value":$scope.fechfin
        }
        ] }
      };

      mapaObjectFinal = [];
      mapaObject = [];
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (response) {
        $scope.grupos =response; 
        for(var x=0;x<$scope.grupos.length;x++){
          $scope.nom=$scope.grupos[x].nombres;
        }
        $scope.datatramite= $scope.grupos;
        $scope.cantidad=0;
        for(i=0; i<$scope.grupos.length;i++)
          {   mapaObject = new Object();
            var longi = $scope.grupos[i].nombres;
            mapaObject.name = longi;
            mapaObject.y = parseInt($scope.grupos[i].countpart);
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
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.addImage(USG, 'JPEG', data.settings.margin.left, 35, 540, 60);
        doc.text('REPORTE GRAFICO DE SERVICIO DE DIAGNOSTICO Y MANTENIMIENTO VEHICULAR ESTADISTICO ', data.settings.margin.left + 20, 110);
      };
      doc.setFontSize(10);
      doc.text('DEL: ' + $scope.fechini+   '    AL:  ' + $scope.fechfin,  210, 140,0,235);
      var res = doc.autoTableHtmlToJson(document.getElementById("Tramite"));
      doc.autoTable(res.columns, res.data, {theme: 'plain',startY: 160,beforePageContent: header,headerStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},bodyStyles: {rowHeight: 12, fontSize: 7, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto'});
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


    $scope.reporteVista = function(){
      $.blockUI();
      $scope.html = "";
      $scope.doct_tps_doc_id = 2;

      var resDatos = {
        "table_name":"_bp_reportes",
        "filter": "rep_id= "+ $scope.idReporte +" and rep_estado='A'"
      };

      var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
      obj.success(function (response) {
        $scope.nombReporte = response.record[0].rep_titulo;
        $scope.filename = $scope.nombReporte;
        $scope.tituloColumnas = (response.record[0].rep_titulo_columnas).split("|");
        $scope.datadocumentos = undefined;
        $scope.datadocumentos1 = response;
        var i=0;
        if(response.record[0].rep_filtrado != null)
        {
          titulos = "[{";
          camposBD = response.record[0].rep_filtrado;
          $scope.datadocumentos = camposBD.split("|");
        }
        if ($scope.datadocumentos != undefined)
        {
          while(i<$scope.datadocumentos.length) {
            valores = $scope.datadocumentos[i].split("#");
            titulo = valores[0];
            idName = valores[1];
            dominio = valores[2];
            titulos = titulos + '"label":"' + titulo +'"}, {';
            switch(dominio)
            {
              case "TXT":
              $scope.html = $scope.html + '<div class="col-md-3">';
              $scope.html = $scope.html + '<div class="form-group">';
              $scope.html = $scope.html + '<label class="col-sm-4 control-label no-padding-right" for="url">' + titulo + ':</label>';
              $scope.html = $scope.html + '<div class="col-sm-8">';
              $scope.html = $scope.html + '<input type= "text" id="registro[]" name="' + idName + '" onkeyUp="return conMayusculas(this)" class="form-control" placeholder="'+titulo+'" ng-model="registro.'+idName+'">';
              $scope.html = $scope.html + '</div></div></div> ';
              break;
              case "FEC":
              $scope.html = $scope.html + '<div class="col-md-3">';
              $scope.html = $scope.html + '<div class="form-group">';
              $scope.html = $scope.html + '<label class="col-sm-4 control-label no-padding-right" for="url">' + titulo +  ':</label>';
              $scope.html = $scope.html + '<div class="col-sm-8">';
              $scope.html = $scope.html + '<input type="text" name="'+idName+'" id="registro[]" readonly="readonly" ng-change="validarfecha()" class="fecha form-control" data-date-format="yyyy-mm-dd" placeholder="'+titulo+'" ng-model="registro.'+idName+'"/>';
              $scope.html = $scope.html + ' <script type="text/javascript"> $(document).ready(function() {$(".fecha").fdatepicker();});'
              $scope.html = $scope.html + '</script>';
              $scope.html = $scope.html + '</div></div></div> ';
              break;
              case "combo":
              $scope.html = $scope.html + '<div class="col-md-3"> ';
              $scope.html = $scope.html + '<div class="form-group" >';
              $scope.html = $scope.html + '<label for="url">'+titulo+':</label>';
              $scope.html = $scope.html + '<div class="controls">';
              $scope.html = $scope.html + '<select id="registro[]" name="registro[]" class="form-control" type="'+titulo+'" ng-model="registro.'+idName+'" >';
              var arrayDatos = datosCmb.split("|");
              for(i=0; i<arrayDatos.length; i++)
              {
                var arrayOptions = arrayDatos[i].split("%");
                if(arrayOptions.length > 0)
                {
                  $scope.html = $scope.html + '<option value="'+arrayOptions[1]+'">'+arrayOptions[1]+'</option>';
                }
              }
              $scope.html = $scope.html + '</select>';
              $scope.html = $scope.html + '</div>';
              $scope.html = $scope.html + '</div>';
              $scope.html = $scope.html + '</div>';
              break;
              case "NUM":
              $scope.html = $scope.html + '<div class="col-md-3"> ';
              $scope.html = $scope.html + '<div class="form-group">';
              $scope.html = $scope.html + '<label class="col-sm-4 control-label no-padding-right" for="url">' + titulo + ':</label>';
              $scope.html = $scope.html + '<div class="col-sm-8">';
              $scope.html = $scope.html + '<input type="number" id="registro[]" name="' + idName + '" class="form-control" placeholder="' + titulo + '" ng-model="registro.' + idName + '">' ;
              $scope.html = $scope.html + '</div></div></div> ';
              break;
              default:
              $scope.html = $scope.html + '<div class="col-md-3"> ';
              $scope.html = $scope.html + '<div class="form-group" > ' ;
              $scope.html = $scope.html + '<label for="url" >' + titulo + ':</label> ' ;
              $scope.html = $scope.html + '<div class="controls"> ' ;
              $scope.html = $scope.html + '<input id="registro[]" name="registro[]" onkeyUp="return conMayusculas(this)" type="text" class="form-control" placeholder="' + titulo + '" ng-model="registro.' + idName + '">' ;
              $scope.html = $scope.html + '</div></div></div> ';
              break;
            }
            i=i+1;
          }
          titulos = titulos.substring(0,titulos.length - 3);
          titulos = titulos + "]";
          $scope.obtTitulos = JSON.parse(titulos);

        }

        $scope.get_pre($scope.html);
        $.unblockUI();
      })
obj.error(function(error) {
  console.log("_bp_reportes", error);
});
};

$scope.mostrarConsulta=function(){
  if ($scope.verConsulta==true) {
    $scope.divConsulta = null;
  } else {
    $scope.divConsulta = "mostrar";
  }
}
$scope.generarReporte=function(consulta){
  console.log('consulta : ',consulta);
  $scope.graficaP= false;
  $scope.tablatramite=true;
  console.log('consulta de entrada',consulta);
  var resQuery = {
    "procedure_name":"sp_reporte_dinamico123",
    "body":{
      "params": [
      {
        "name": "sql",
        "value": consulta
      }
      ]
    }
  };
  DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery).success(function (response){
    var promise = $scope.getTabla(response);
    promise.then(function(respuesta) {
      $scope.get_pre2(respuesta);
      console.log('genera reporte: ',respuesta);
    }, function(reason) {
      alert('Failed: ' + reason);
    });
  });
}
$scope.getTabla = function(returnedData) {
  var cont = 1;
  var contcol = 1;
  var control = 0;
  var dato = {};
  $scope[name] = 'Running';
  var deferred = $q.defer();
  $scope.html2 = '';
  $scope.html2 = $scope.html2 + '<table id="tblReportesDinamicos" show-filter="true" class="table table-striped table-bordered">';
  $scope.html2 = $scope.html2 + '<thead>';
  $scope.html2 = $scope.html2 + '<th> # </th>';
  angular.forEach($scope.tituloColumnas, function(value, key) {
    $scope.html2 = $scope.html2 + '<th> ' + value.trim() + ' </th>';
    contcol++;
  }, log);
  $scope.html2 = $scope.html2 + '</thead>';
  $scope.html2 = $scope.html2 + '<tbody>';
  $scope.obtRegistroReporte = JSON.parse(returnedData[0].sp_reporte_dinamico123);
  var obtregistros= JSON.parse(returnedData[0].sp_reporte_dinamico123);
  angular.forEach($scope.obtRegistroReporte,function(celda, fila){
    $scope.html2 = $scope.html2 + '<tr class="column">';
    $scope.html2 = $scope.html2 + '<td>' + cont + '</td> ';
    cont ++;
    control = 0;
    angular.forEach(celda,function(celda1, fila1){
      dato[control] = celda1;
      $scope.html2 = $scope.html2 + '<td>' + celda1+ '</td> ';
      control ++;
    });
    $scope.html2 = $scope.html2 + '</tr>';
  });
  $scope.html2 = $scope.html2 + '</tbody> </table>';
  deferred.resolve($scope.html2);
  return deferred.promise;
}
$scope.$on('api:ready',function(){
  $scope.getReportes();
});
$scope.inicioActuaciones = function () {
  if(DreamFactory.isReady()){
  }
};
});
