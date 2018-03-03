app.controller('graf_vales_combustible', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
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
  $scope.fechini='';
  $scope.fechfin='';
  $scope.numero='';
  $scope.categoria=function(numero,cod,registro){
    $scope.numero= numero;
    switch ($scope.numero){
      case '1':
      $scope.getRep_tipo_combustible(cod,registro);
      break;
      case '2':
      $scope.getRep_valescombus(cod,registro);
      break;
      case '3':
      $scope.getRep_unidad(cod,registro);    
      break;
      case '4':
      $scope.getRep_vales(cod,registro);    
      break;
      default: ;
    }      
  };
  $scope.getRep_tipo_combustible = function(cod,registro){
    $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
    $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
    $scope.TablaCreacion = true;
    var reslocal = {
      "procedure_name":"sp_graf_combustible",
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

    $scope.getRep_valescombus = function(cod,registro){
      $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
      $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
      $scope.TablaCreacion = true;
      var reslocal = {
        "procedure_name":"sp_graf_motor",
        "body":{
          "params": [            
          {
            "name":"fechini",
            "param_type":"IN","value": $scope.fechini
          },
          {
            "name":"fechfin",
            "param_type":"IN","value": $scope.fechfin
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

      $scope.getRep_unidad = function(cod,registro){
        $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
        $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
        $scope.TablaCreacion = true;
        var reslocal = {
          "procedure_name":"sp_graf_unidad",
          "body":{
            "params": [            
            {
              "name":"fechini",
              "param_type":"IN","value": $scope.fechini
            },
            {
              "name":"fechfin",
              "param_type":"IN","value": $scope.fechfin
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
        $scope.getRep_vales = function(cod,registro){
          $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
          $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
          $scope.TablaCreacion = true;
          var reslocal = {
            "procedure_name":"sp_graf_adicional",
            "body":{
              "params": [            
              {
                "name":"fechini",
                "param_type":"IN","value": $scope.fechini
              },
              {
                "name":"fechfin",
                "param_type":"IN","value": $scope.fechfin
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
                text: 'GRÁFICO'
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
                name: 'GRÁFICO',
                data: mapaObjectFinal
              }]
            });
          };
          $scope.pdf = function(image){
            var doc = new jsPDF('p', 'pt');

            var header = function (data) {
              doc.setFontSize(13);
              doc.setTextColor(40);
              doc.setFontStyle('normal');
              doc.addImage(USG, 'JPEG', data.settings.margin.left, 35, 540, 60);
              doc.text('VALES DE COMBUSTIBLE', data.settings.margin.left + 150, 110);
            };
            doc.setFontSize(10);
            doc.text('Del: ' + $scope.fechini+   '    Al:  ' + $scope.fechfin,  210, 140,0,235);

            switch ($scope.numero){
              case '1':
              doc.setFontSize(11);
              doc.text('Reporte - Gráfico Por Tipo de Combustible',  175, 125);
              break;
              case '2':
              doc.setFontSize(11);
              doc.text('Reporte - Gráfico Por Tipo de Motorizado',  175, 125);
              break;
              case '3':
              doc.setFontSize(11);
              doc.text('Reporte - Gráfico Por Unidad Solicitante',  185, 125);  
              break;
              case '4':
              doc.setFontSize(11);
              doc.text('Reporte - Gráfico Por Vales Adicionales',  185, 125);  
              break;
            }  


            var res = doc.autoTableHtmlToJson(document.getElementById("Tramite"));
            doc.autoTable(res.columns, res.data, {theme: 'mary',startY: 160,beforePageContent: header,headerStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},bodyStyles: {rowHeight: 12, fontSize: 7, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto'});
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
          $scope.mostrarConsulta=function(){
            if ($scope.verConsulta==true) {
              $scope.divConsulta = null;
            } else {
              $scope.divConsulta = "mostrar";
            }
          }

          $scope.generarReporte=function(consulta){
            $scope.graficaP= false;
            $scope.tablatramite=true;
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
          });
          $scope.inicioActuaciones = function () {
            if(DreamFactory.isReady()){
            }
          };
        });