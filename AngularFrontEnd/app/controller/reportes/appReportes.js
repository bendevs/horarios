app.controller('reporteDinamicoController', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {

    $scope.registro = {};
    $scope.tablaReporte = null;
    $scope.filename = "reporteDinamico";
    $scope.graficaP=false;
    $scope.tablatramite=true;
    var mapaObject = new Object();
    var mapaObjectFinal = new Array();


    /*hash = hex_sha1("1"); /* SHA-1 */
    //console.log(hash);

    cadVariables = location.hash;
    arrVariables = cadVariables.split("?");
    console.log(arrVariables);
    for (i=1; i<arrVariables.length; i++) {
        arrVariableActual = arrVariables[i];
        console.log(arrVariableActual);
        if (isNaN(parseFloat(arrVariableActual[0]))){
            console.log(unescape(arrVariableActual[0]));
            $scope.rptSelec = unescape(arrVariableActual);
        }else{
            $scope.rptSelec = arrVariableActual;
        }
        console.log('Seleccion de Reportes: ',$scope.rptSelec);
    }

    $scope.get_pre = function(x){
        return $sce.trustAsHtml(x);
        console.log('fecha ini: ', $sce.trustAsHtml(x));
    };


    $scope.get_pre2 = function(x){
        return $sce.trustAsHtml(x);
    };

    $scope.validarfecha = function(){
      alert('12 fecha');
    }

    $scope.getReportes = function(){
        $.blockUI();
        var resReportes = {
            "procedure_name":"sp_reportes"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resReportes);
        obj.success(function (response) {
            $scope.obtReportes = response;

            $scope.datos=response[0].wsid;
            $.unblockUI();
        })
        obj.error(function(error) {
            console.log("sp_reportes", error);
            $.unblockUI();
        });
    };

    $scope.getEspacioTrabajo = function(){
        $.blockUI();
        var resEspacioT = {
            "procedure_name":"sp_lst_workspace1"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resEspacioT);
        obj.success(function (response) {
            $scope.obtEspacioT = response;

            console.log('espacio ',$scope.obtEspacioT);
            $.unblockUI();
        })
        obj.error(function(error) {
            console.log("sp_lst_workspace1", error);
            $.unblockUI();
        });
    };
//funcion para la grafica
    $scope.getReportesGrafica = function(datos){
    //  $.blockUI();
    console.log('Id de espacio de trabajo ',datos.wsid);
    console.log('id reportes : ', $scope.idReporte);
    $scope.datosw=datos.wsid;
    console.log('grafica',$scope.datos);
     var resespera = {
          //"procedure_name":"plt_lst_contadortiposervicios_v1"
          "procedure_name":"sp_lst_grafica_espaciorep",
          "body":{
                  "params": [
                    {
                      "name": "repid",
                      "value": $scope.idReporte
                    },
                    {
                      "name": "wsid",
                      "value": datos.wsid
                    },
                      {
                        "name": "fechainicial",
                        "value": $scope.fechai
                      },
                      {
                        "name": "fechafinal",
                        "value": $scope.fechaf
                      }
                  ]
          }
      };
      //new response;
     mapaObjectFinal = [];
      mapaObject = [];

      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resespera);
      obj.success(function (response) {
        $scope.datatramite= response;
        console.log($scope.datatramite);
        $scope.cantidad=0;

         for(i=0; i<response.length;i++)
          {
              mapaObject = new Object();
              var longi = response[i].tipomotivo.substring(0,30);
              if(response[i].tipomotivo.length>20){
                  mapaObject.name = longi+"...";
              }
              else{
                mapaObject.name = response[i].tipomotivo;
              }

              mapaObject.y = parseInt(response[i].contador);
              mapaObjectFinal[i] = mapaObject;
              console.log('Contador longitud: ',longi);
              $scope.cantidad=$scope.cantidad+mapaObject.y;
              //console.log('Cantidad',$scope.cantidad)

          }
          $scope.graficaP= true;
          $scope.tablatramite=false;
            $scope.graficarTorta();
            $scope.graficaColumna();

           //////Nuevo
          $.unblockUI();

        })
        obj.error(function(error) {
            sweet.show('', 'error', 'error');
        });
  };

//grafica torta extraida datos de la funcion
  $scope.graficarTorta = function () {
      // Create the chart
          $('#containerdato').highcharts({
              color:['#FF9933','#3333FF','#66FFF0','#FF99FF','#FF4000','#FF6633','#FFF360',,'#123456'],
                  chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie'
              },
              title: {
                  text: 'Tramites'
              },
              subtitle: {
              text: 'De acuerdo a fecha ' + $scope.fechai + ' al '+ $scope.fechaf
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
                  name: 'cantidad: ',
                  data: mapaObjectFinal
              }]
          });
      };

      $scope.graficaColumna = function (){

        $('#container').highcharts({
          chart: {
            type: 'column'
          },
          exporting: { enabled: false },
          title: { text: 'Cantidad de tramites ingresados según tipo de tramite' },
          //subtitle: { text: 'Periodo del '+fechaOperativo1+' al '+fechaOperativo2 },
          xAxis: {
            type: 'category',
            labels: {
                    style: {
                        color: 'black',
                        fontSize:'10px'
                    }
                }

          },
          yAxis: {
            title: { text: 'Valores totales: ' +$scope.cantidad}
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:12px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> tramites<br/>'
          },
          series: [{
            name: 'Total tramites',
            colorByPoint: true,
            data: mapaObjectFinal
          }]
        });
      };
    $scope.selecReporte = function() {
        $scope.idReporte = $scope.rptSelec;
        $scope.reporteVista();
        $scope.html2 = "";
        $scope.get_pre2($scope.html2);
    }


    $scope.cargarDatos = function()
  {

        var resDatos = {
            "table_name":"_bp_reportes",
             "filter": "rep_id= "+ $scope.idReporte +" and rep_estado='A'"
        };
        console.log('idreporte: ',$scope.idReporte);
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
        obj.success(function (response) {
            console.log("response", response);
            var mutli_education = document.reportForm.elements["registro[]"];
            var query = response.record[0].repc_consulta_sql
            console.log('registro: ',mutli_education);
            //$scope.idrep=response.record[1].rep_id;
            $scope.reporteConsulta=response.record[0].repc_consulta_sql;

            if(mutli_education.length > 0 )
            {
                for (var i = 1; i < mutli_education.length; i++)

                {
                    $scope.fechai=mutli_education[1].value;
                    $scope.fechaf=mutli_education[2].value;

                    nombreCampo = mutli_education[i].name;
                    valorCampo = mutli_education[i].value;
                    tipoCampo = mutli_education[i].type;
                    nombreCampo = new RegExp("@"+nombreCampo+"@", "g");
                    //console.log('fecha a enviar',$scope.fechai,$scope.fechaf);
                    //console.log('nombre Campo',mutli_education[i].name);
                    //console.log('Fecha inicial / final',mutli_education[i].value);
                    //console.log('tipo ',mutli_education[i].type);
                    if (mutli_education[i].value.length>0)
                    {
                        if(tipoCampo=='text')
                        {
                            query= query.replace(nombreCampo,"'"+valorCampo+"'");
                        }else{
                            query= query.replace(nombreCampo,valorCampo);
                        }
                    }
                };
            }

              console.log('consulta de Genera Reporte:',query);
              $scope.generarReporte(query);

              //$scope.getReportesGrafica($scope.idReporte,query);

        })
        obj.error(function(error) {
            console.log("_bp_reportes", error);
        });
    }


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
                        $scope.html = $scope.html + '<p class="input-group"><input type="text" name="'+idName+'" id="registro[]" readonly="readonly" is-open="startDateOpened" class="fecha form-control" data-date-format="yyyy-mm-dd" placeholder="'+titulo+'" ng-model="registro.'+idName+'" ng-required="true" close-text="Close" ng-disabled="desabilitado" ><span class="input-group-btn"><button type="button" class="btn btn-default fecha" ng-click=""><i class="glyphicon glyphicon-calendar"></i></button></span></p>';
                        //$scope.html = $scope.html + '<input type="text" name="'+idName+'" id="registro[]" readonly="readonly" class="fecha form-control" data-date-format="yyyy-mm-dd" placeholder="'+titulo+'" ng-model="registro.'+idName+'">';
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
      console.log('consulta : ',$scope.idReporte);
      $scope.graficaP= false;
        $scope.tablatramite=true;
        console.log('grafica',$scope.datosw);

        console.log('consulta de entrada',consulta);
        console.log('wsid ',$scope.datos.wsid);
        var resQuery = {
            "procedure_name":"sp_lst_reporte_espacio4",
            "body":{
                    "params": [
                        {
                            "name": "repid",
                            "value": $scope.idReporte
                        },
                        {
                            "name": "wsid",
                            "value": $scope.datos.wsid
                        },
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

    /*$scope.generarReporte=function(consulta){
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
    }*/

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
        $scope.obtRegistroReporte = JSON.parse(returnedData[0].sp_lst_reporte_espacio4);
        var obtregistros= JSON.parse(returnedData[0].sp_lst_reporte_espacio4);
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

    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };

    //iniciando el controlador
    $scope.$on('api:ready',function(){
        //$scope.reporteVista();
        $scope.getReportes();
        $scope.getEspacioTrabajo();
    });
    $scope.inicioActuaciones = function () {
        if(DreamFactory.isReady()){
            //$scope.reporteVista();
            $scope.selecReporte();
              $scope.getEspacioTrabajo();

        }
    };
});
