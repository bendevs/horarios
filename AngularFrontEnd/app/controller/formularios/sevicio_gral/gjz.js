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
            console.log("sp_reportes", error);
            $.unblockUI();
        });
    };
 $scope.categoria=function(numero){
     $scope.getReportesGraficaArqueologia();

     /*
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

       */


    };
/*
//funcion para la grafica
    $scope.getReportesGrafica = function(){
    //  $.blockUI();
    console.log('grafica',$scope.fechai);
var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select count(*) as suma, cas_datos ->> 'g_tipo' as tipo from _fr_casos where cas_nombre_caso like '%PTR%' and cas_datos ->> 'g_tipo' like '%PTR%' group by cas_datos ->> 'g_tipo'"}]
        }
    };

     mapaObjectFinal = [];
      mapaObject = [];
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (response) {
         $scope.grupos = JSON.parse(response[0].ejecutartojson);
         $scope.grupos[0].nombre='CONJUNTOS';
         $scope.grupos[1].nombre='INMUEBLES';
         $scope.grupos[2].nombre='ESPACIOS ABIERTOS';
         $scope.grupos[3].nombre='ARQUITECTONICO';
         $scope.grupos[4].nombre='MONUMENTOS Y ESCULTURAS';
        $scope.grupos[5].nombre='INMATERIAL';

        $scope.datatramite= $scope.grupos;
        //console.log("datossss",$scope.datatramite);
        $scope.cantidad=0;
         for(i=0; i<$scope.grupos.length;i++)
          {
              mapaObject = new Object();
              var longi = $scope.grupos[i].tipo;
              mapaObject.name = longi;
              mapaObject.y = parseInt($scope.grupos[i].suma);
              mapaObjectFinal[i] = mapaObject;
             // console.log('Contador longitud: ',longi);
             // console.log('Contador suma: ',mapaObject);
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
    //  $.blockUI();
    console.log('grafica',$scope.fechai);
var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select count(*) as suma, cas_datos ->> 'g_tipo' as tipo from _fr_casos where cas_nombre_caso like '%PTR%' and cas_datos ->> 'g_tipo' like '%PTR%' group by cas_datos ->> 'g_tipo'order by tipo"             }]
        }
    };

     mapaObjectFinal = [];
      mapaObject = [];
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (response) {
        $scope.grupos = JSON.parse(response[0].ejecutartojson);
         $scope.grupos[0].nombre='DIAGNOSTICO';
         $scope.grupos[1].nombre='DIAGNOSTICO Y MANTENIMIENTO';
         $scope.grupos[2].nombre='MANTENIMIENTO';

        $scope.datatramite= $scope.grupos;
        //console.log("datossss",$scope.datatramite);
        $scope.cantidad=0;
         for(i=0; i<$scope.grupos.length;i++)
          {
              mapaObject = new Object();
              var longi = $scope.grupos[i].tipo;
              mapaObject.name = longi;
              mapaObject.y = parseInt($scope.grupos[i].suma);
              mapaObjectFinal[i] = mapaObject;
             // console.log('Contador longitud: ',longi);
             // console.log('Contador suma: ',mapaObject);
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
    //  $.blockUI();
    console.log('grafica',$scope.fechai);
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select count(*) as suma, cas_datos ->> 'PTR_AREAS' as tipo from _fr_casos where cas_nombre_caso like '%PTR%' and cas_datos ->> 'PTR_AREAS'like '%%' group by cas_datos ->> 'PTR_AREAS' order by tipo"}]
        }
    };

     mapaObjectFinal = [];
      mapaObject = [];
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (response) {
         $scope.grupos = JSON.parse(response[0].ejecutartojson);
         $scope.grupos[0].nombre='DOMINIO I TRADICIONES Y EXPRESIONES ORALES';
         $scope.grupos[1].nombre='DOMINIO II ARTES DEL ESPECTACULO';
         $scope.grupos[2].nombre='DOMINIO III RITUALES Y ACTOS FESTIVOS';
         $scope.grupos[3].nombre='DOMINIO IV CONOCIMIENTOS Y PRACTICAS';
         $scope.grupos[4].nombre='DOMINIO V SABERES Y TÉCNICAS';
        $scope.grupos[5].nombre='DOMINIO VI LENGUAJES Y HABLAS';
        $scope.grupos[6].nombre='PERSONAJES ';
        $scope.grupos[7].nombre='PATRIMONIO INMATERIAL ';

        $scope.datatramite= $scope.grupos;
        console.log("datossss",$scope.datatramite);
        $scope.cantidad=0;
         for(i=0; i<$scope.grupos.length;i++)
          {
              mapaObject = new Object();
              var longi = $scope.grupos[i].tipo;
              mapaObject.name = longi;
              mapaObject.y = parseInt($scope.grupos[i].suma);
              mapaObjectFinal[i] = mapaObject;
              console.log('Contador longitud: ',longi);
              console.log('Contador suma: ',mapaObject);
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
  };*/
   $scope.getReportesGraficaArqueologia = function(){
    //  $.blockUI();
    console.log('grafica',$scope.fechai);
var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select count(*) as suma, cas_datos ->> 'USG_SOL_VH_VALOR' as tipo  from _fr_casos where cas_datos ->> 'USG_SOL_VH_VALOR' like '%MANTENIMIENTO' or cas_datos ->> 'USG_SOL_VH_VALOR' like '%DIAGNÓSTICO' and cas_datos ->>'USG_ASIGNADO'<>'undefined' and cas_datos ->>'USG_ASIGNADO'<>'' AND cas_datos ->> 'USG_SOL_VH_VALOR'<>'undefined' AND cas_datos ->> 'USG_SOL_VH'<>'undefined' group by cas_datos ->> 'USG_SOL_VH_VALOR'"}]
        }
    };

     mapaObjectFinal = [];
      mapaObject = [];
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (response) {
         $scope.grupos = JSON.parse(response[0].ejecutartojson);
         $scope.grupos[0].nombre='DIAGNOSTICO';
         $scope.grupos[1].nombre='DIAGNOSTICO Y MANTENIMIENTO';
         $scope.grupos[2].nombre='MANTENIMIENTO';

        $scope.datatramite= $scope.grupos;
        console.log("datossss",$scope.datatramite);
        $scope.cantidad=0;
         for(i=0; i<$scope.grupos.length;i++)
          {
              mapaObject = new Object();
              var longi = $scope.grupos[i].tipo;
              mapaObject.name = longi;
              mapaObject.y = parseInt($scope.grupos[i].suma);
              mapaObjectFinal[i] = mapaObject;
              console.log('Contador longitud: ',longi);
              console.log('Contador suma: ',mapaObject);
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
         //     color:['#FF9933','#3333FF','#66FFF0','#FF99FF','#FF4000','#FF6633','#FFF360',,'#123456'],
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
                  //console.log(categories);
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
   // doc.text("From HTML", 40, 50);
    var header = function (data) {
        doc.setFontSize(9);
        doc.setTextColor(40);
        doc.setFontStyle('bold');
        doc.addImage(logoLaPaz, 'JPEG', data.settings.margin.left, 40, 50, 50);
        doc.text('GOBIERNO AUTONÓMO MUNICIPAL DE LA PAZ', data.settings.margin.left + 130, 55);
        doc.text('OFICIALÍA MAYOR DE CULTURAS-DIRECCIÓN DE PATRIMONIO CULTURAL Y NATURAL', data.settings.margin.left + 55, 70);
        doc.text('UNIDAD DE PATRIMONIO INMATERIAL E INVESTIGACIÓN CULTURAL', data.settings.margin.left + 90, 85);

        doc.setDrawColor(0,0,0);
        doc.setLineWidth(1.5);
        doc.line(30,100,555,100);
        doc.text('REPORTE GRAFICO DEL PATRIMONIO CULTURAL DEL MUNICIPIO DE LA PAZ', data.settings.margin.left + 55, 110);

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
            console.log('nombre archivo',$scope.filename);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $scope.datadocumentos1 = response;
            console.log('datadocumentos1',$scope.datadocumentos1);

            var i=0;
            if(response.record[0].rep_filtrado != null)
            {
                titulos = "[{";
                camposBD = response.record[0].rep_filtrado;
                $scope.datadocumentos = camposBD.split("|");
                console.log('datadocumentos',$scope.datadocumentos);
            }
            if ($scope.datadocumentos != undefined)
            {
                while(i<$scope.datadocumentos.length) {
                    valores = $scope.datadocumentos[i].split("#");
                    titulo = valores[0];
                    idName = valores[1];
                    dominio = valores[2];
                    titulos = titulos + '"label":"' + titulo +'"}, {';
                    console.log('Val',valores);
                    console.log('Tit',titulo);
                    console.log('idNombre',valores[i]);
                    console.log('dom',dominio);
                    console.log('titulos',titulos);
                    console.log('id nombre:  ',idName);
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
                      //console.log('Dominio',switch(dominio));
                        $scope.html = $scope.html + '<div class="col-md-3">';
                        $scope.html = $scope.html + '<div class="form-group">';
                        $scope.html = $scope.html + '<label class="col-sm-4 control-label no-padding-right" for="url">' + titulo +  ':</label>';
                        $scope.html = $scope.html + '<div class="col-sm-8">';
                        $scope.html = $scope.html + '<input type="text" name="'+idName+'" id="registro[]" readonly="readonly" ng-change="validarfecha()" class="fecha form-control" data-date-format="yyyy-mm-dd" placeholder="'+titulo+'" ng-model="registro.'+idName+'"/>';
                        //$scope.html = $scope.html + '<input type="text" name="'+idName+'" id="registro[]" class="form-control" placeholder="'+titulo+'" ng-model="registro.'+idName+'"/>';
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
            //console.log('scope html ',$scope.get_pre($scope.html))
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
        //console.log('Registros JSON',$scope.obtRegistroReporte);
        angular.forEach($scope.obtRegistroReporte,function(celda, fila){
            $scope.html2 = $scope.html2 + '<tr class="column">';
            $scope.html2 = $scope.html2 + '<td>' + cont + '</td> ';
            cont ++;
            control = 0;
            angular.forEach(celda,function(celda1, fila1){
                    dato[control] = celda1;
                    $scope.html2 = $scope.html2 + '<td>' + celda1+ '</td> ';
                    //console.log('area de tablas ',dato[control]);

                control ++;
            });
            $scope.html2 = $scope.html2 + '</tr>';
        });

        $scope.html2 = $scope.html2 + '</tbody> </table>';

        deferred.resolve($scope.html2);
        return deferred.promise;
    }

    //iniciando el controlador
    $scope.$on('api:ready',function(){
        //$scope.reporteVista();
        $scope.getReportes();
    });
    $scope.inicioActuaciones = function () {
        if(DreamFactory.isReady()){
            //$scope.reporteVista();
          //  $scope.selecReporte();

        }
    };
});
