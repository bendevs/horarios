app.controller('controllerGralsemdes', function ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// VARIABLES GLOBALES /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + (fecha.getMonth() +1)+ "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var fechactualnuevoformasto=fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " - " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    $scope.registro = {};
    $scope.tablaReporte = null;
    $scope.filename = "reporteDinamico";
    $scope.graficaP=false;
    $scope.tablatramite=true;
    var mapaObject = new Object();
    var mapaObjectFinal = new Array();

    var mapaObjectp = new Object();
    var mapaObjectFinap = new Array();   

    var fechactual11='';
    var fechactual22='';
    $scope.graficaPa= false;
    $scope.graficaG= false;
    $scope.graficaR= false;
    $scope.graficaD= false;

///////////////////////////////////////////////// FIN VARIABLES GLOBALES 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// FUNCIONES INICIO /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.startDateOpen1 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.startDateOpened1 = true;
    };
    $scope.startDateOpen2 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.startDateOpened2 = true;
    };

    $scope.limpiar=function()
    {
      $scope.fechaIni = "";
      $scope.fechafin = "";
    }

    $scope.generarReporteSemdes=function()
    {
            $.blockUI()
        var fechactual1=$scope.fechaIni.getFullYear() + "-" + ($scope.fechaIni.getMonth()+1) + "-" + $scope.fechaIni.getDate() ;
        var fechactual2=$scope.fechafin.getFullYear() + "-" + ($scope.fechafin.getMonth()+1) + "-" + $scope.fechafin.getDate() ;
        $scope.fechaIni1=fechactual1;
        $scope.fechafin1=fechactual2;
        
        var parametros = {
          "procedure_name":"sp_reporte_semdes_1",
          "body":{"params": 
            [
              {"name":"fecha1","param_type":"IN","value":fechactual1},
              {"name":"fecha2","param_type":"IN","value":fechactual2}
            ]
          }        
        };

        var ss =  DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
              $.unblockUI();
          $scope.datosFinalReporte = response;
          console.log($scope.datosFinalReporte);
          $scope.getReporteSmdsParentesco();
        });
        ss.error(function(results){
          $.unblockUI();  
          alert("error sp_reporte_semdes_1");
        });
    }
///////////////////////////////////////////////// FIN FUNCIONES INICIO


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// REPORTE PARENTESCO /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.getReporteSmdsParentesco = function(){
        var obj = JSON.parse($scope.datosFinalReporte[0].vjson_todo);
        $scope.dataParentesco = obj; 
        //console.log(obj);

        mapaObjectFinal1 = [];
        $scope.cantidadpp=0;
        $scope.cantidadppc=0;

        for(var i=0; i<obj.length; i++)
        {
            mapaObject = new Object();
            
            var longi = obj[i].parentesco;
            mapaObject.name = longi;
            mapaObject.y = parseFloat(obj[i].porcentaje.trim());
            mapaObjectFinal1[i] = mapaObject;             
            $scope.cantidadppc = $scope.cantidadppc + parseFloat(obj[i].nino.trim());
            $scope.cantidadpp = $scope.cantidadpp + mapaObject.y;
        }
        
        //console.log(mapaObjectFinal1);
        $scope.graficaP= true;
        $scope.graficarBarra();
        $scope.getReporteSmdsGenero();
    };

    $scope.graficarBarra = function () {
              $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Reporte de parentesco de '+ $scope.fechaIni1 +' hasta ' + $scope.fechafin1
            },
            subtitle: {
                // text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Total en porcentaje'
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: mapaObjectFinal1
            }]
        });
    };
///////////////////////////////////////////////// FIN REPORTE PARENTESCO


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// REPORTE GENERO /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.getReporteSmdsGenero = function(){
        var obj = JSON.parse($scope.datosFinalReporte[1].vjson_todo);
        $scope.dataGenero = obj;
        //console.log(obj);
        
        mapaObjectFinal2 = [];
        $scope.cantidadg = 0;
        $scope.cantidadgc = 0;

        for (var i = 0; i < obj.length; i++) {
            mapaObject = new Object();
            var name = obj[i].gen.replace(/"M"/g, "M").replace(/"F"/g, "F");
            mapaObject.name = name;
            mapaObject.y = parseFloat(obj[i].porcentaje.trim());
            mapaObjectFinal2[i] = mapaObject;             
            
            $scope.cantidadgc = $scope.cantidadgc + parseFloat(obj[i].nino.trim());
            $scope.cantidadg = $scope.cantidadg + mapaObject.y;
            
         };           
        //console.log(mapaObjectFinal2);
        $scope.graficarGenero();
        $scope.getReporteSmdsRango();

    };

    $scope.graficarGenero = function () {
            $('#containerG').highcharts({
          chart: {
              type: 'column'
          },
          title: {
              text: 'Reporte de genero de '+ $scope.fechaIni1 +' hasta ' + $scope.fechafin1
          },
          subtitle: {
              // text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
          },
          xAxis: {
              type: 'category'
          },
          yAxis: {
              title: {
                  text: 'Total porcentaje'
              }

          },
          legend: {
              enabled: false
          },
          plotOptions: {
              series: {
                  borderWidth: 0,
                  dataLabels: {
                      enabled: true,
                      format: '{point.y:.1f}%'
                  }
              }
          },

          tooltip: {
              headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
              pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> total<br/>'
          },

          series: [{
              name: 'Brands',
              colorByPoint: true,
              data: mapaObjectFinal2
          }]
      });
    };
///////////////////////////////////////////////// FIN REPORTE GENERO


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// REPORTE EDADES /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.getReporteSmdsRango = function(){
        var obj = JSON.parse($scope.datosFinalReporte[2].vjson_todo);
        $scope.dataRango = obj;

        mapaObjectFinal4 = [];
        $scope.cantidadr=0;
        $scope.cantidadrc=0;
        
        for (var i = 0; i<obj.length; i++) 
        {
            mapaObject = new Object();
            var longi = obj[i].grupo_etario;
            mapaObject.name = longi;
            mapaObject.y =  parseFloat(obj[i].round.trim());
            mapaObjectFinal4[i] = mapaObject;             
            $scope.cantidadr = $scope.cantidadr + parseFloat(obj[i].cantidad.trim());
            $scope.cantidadrc = $scope.cantidadrc + mapaObject.y;
        };
        
        
        //console.log(mapaObjectFinal2);
        $scope.graficarRango();
        $scope.getReporteSmdsDestino();

    };

    $scope.graficarRango = function () {
            $('#containerR').highcharts({
          chart: {
              type: 'column'
          },
          title: {
             text: 'Reporte de ragos  de edades de '+ $scope.fechaIni1 +' hasta ' + $scope.fechafin1
          },
          subtitle: {
              // text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
          },
          xAxis: {
              type: 'category'
          },
          yAxis: {
              title: {
                  text: 'Total porcentaje'
              }

          },
          legend: {
              enabled: false
          },
          plotOptions: {
              series: {
                  borderWidth: 0,
                  dataLabels: {
                      enabled: true,
                      format: '{point.y:.1f}%'
                  }
              }
          },

          tooltip: {
              headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
              pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b>total<br/>'
          },

          series: [{
              name: 'Brands',
              colorByPoint: true,
              data: mapaObjectFinal4
          }]
      });
    };
///////////////////////////////////////////////// FIN REPORTE EDADES


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////// REPORTE DESTINOS /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.getReporteSmdsDestino = function(){
       
        var obj = JSON.parse($scope.datosFinalReporte[3].vjson_todo);
        $scope.dataDestino = obj;

        mapaObjectFinal3 = [];
        $scope.cantidadd=0;
        $scope.cantidaddc=0;

        for (var i = 0; i < obj.length; i++) {
          mapaObject = new Object();
          var longi = obj[i].destino;
           mapaObject.name = longi;
           mapaObject.y = parseFloat(obj[i].porcentaje.trim());
           mapaObjectFinal3[i] = mapaObject;             
           
           $scope.cantidaddc = $scope.cantidaddc + parseFloat(obj[i].nino.trim());
           $scope.cantidadd = $scope.cantidadd + mapaObject.y;
        };
        $scope.graficarDestino();
    };


    $scope.graficarDestino = function () {
            $('#containerD').highcharts({
          chart: {
              type: 'column'
          },
          title: {
              text: 'Reporte por destino de '+ $scope.fechaIni1 +' hasta ' + $scope.fechafin1
          },
          subtitle: {
              // text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
          },
          xAxis: {
              type: 'category'
          },
          yAxis: {
              title: {
                  text: 'Total porcentaje'
              }

          },
          legend: {
              enabled: false
          },
          plotOptions: {
              series: {
                  borderWidth: 0,
                  dataLabels: {
                      enabled: true,
                      format: '{point.y:.1f}%'
                  }
              }
          },

          tooltip: {
              headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
              pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b>total<br/>'
          },

          series: [{
              name: 'Brands',
              colorByPoint: true,
              data: mapaObjectFinal3
          }]
      });
    };
///////////////////////////////////////////////// FIN REPORTE DESTINOS

    $scope.$on('api:ready',function(){
    });

    $scope.inicioActuaciones = function () {
        if(DreamFactory.isReady()){
        }
    };
});
