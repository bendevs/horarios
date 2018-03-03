app.controller('reportesController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.errors = {};
    $scope.tablaReportes = {};
    $scope.obtReportes = "";    
    
      //listar roles
    $scope.getReportes = function(wsId){
          $scope.wsId=sessionService.get('WS_ID');
          console.log($scope.wsId);
          $.blockUI();

          var resReportes = {
              "procedure_name":"sp_reportes",
              "body":{"params": [{"name":"ws_id","value":wsId}]
              }
          };
          //servicio listar roles
          var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resReportes);
          obj.success(function (response) {
              $scope.obtReportes = response;
              var data = response;   //grabamos la respuesta para el paginado
              $scope.tablaReportes.reload();
              $.unblockUI();
          })
          obj.error(function(error) {
              $scope.errors["error_roles"] = error;
          });
      };

    $scope.tablaReportes = new ngTableParams({
                page: 1,
                count: 5,
                filter: {},
                sorting: {}
            }, {
                total: $scope.obtReportes.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtReportes, params.filter()) :
                    $scope.obtReportes;
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtReportes;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

    $scope.getProcesos = function(){
        //$.blockUI();
        var resOpcion = {
            function_name: "procesolst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
            $scope.obtProcesos=response;
            //$.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };



    $scope.validar=function(datosReporte){
        $("#btnCerrar" ).click();
        $scope.adicionarReporte(datosReporte);
    };


    $scope.adicionarReporte = function(datosReporte){
        $.blockUI();
        console.log(datosReporte.rconsultasql);
        var reporte = {};
        reporte['rep_reporte'] = datosReporte.rnombre;
        reporte['rep_titulo'] = datosReporte.rtitulo;
        reporte['rep_titulo_columnas'] = datosReporte.rtitcolumnas;
        reporte['repc_consulta_sql'] = datosReporte.rconsultasql;
        reporte['rep_filtrado'] = datosReporte.rfiltrado;
        reporte['rep_ws_id'] = $scope.wsId;
        reporte['rep_registrado'] = fechactual;
        reporte['rep_modificado'] = fechactual;
        reporte['rep_estado'] = 'A';
         var resReporte = {
            table_name:"_bp_reportes",
            body:reporte
        };
        console.log("datos de reporte    ",reporte);
        
        //servicio insertar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resReporte);
        obj.success(function(data){
            $scope.getReportes();
            $.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };


    $scope.modificarReporte = function(datosReporte){
        $.blockUI();
        var reporte = {};         
        reporte['rep_reporte'] = datosReporte.rnombre;
        reporte['rep_titulo'] = datosReporte.rtitulo;        
        reporte['rep_titulo_columnas'] = datosReporte.rtitcolumnas;
        reporte['repc_consulta_sql'] = datosReporte.rconsultasql;
        reporte['rep_filtrado'] = datosReporte.rfiltrado;
        reporte['rep_ws_id'] = $scope.wsId;        
        reporte['rep_modificado'] = fechactual;        
        var resReporte = {
            table_name:"_bp_reportes",
            id:datosReporte.rid,
            body:reporte
        };
        //servicio modificar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resReporte);
        obj.success(function(data){
            $.unblockUI(); 
            $scope.getReportes();
            sweet.show('', 'Registro modificado', 'success');
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };


    $scope.eliminarReporte = function(datosReporte){
        $.blockUI();
        var reporte = {}; 
        reporte['rep_modificado'] = fechactual;
        reporte['rep_estado'] = 'B';
        var resReporte = {
            table_name:"_bp_reportes",
            id:datosReporte.rid,
            body:reporte
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resReporte);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $scope.getReportes();
            $.unblockUI(); 
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 

    
    $scope.modificarReporteCargar = function(reporte){
        $scope.only=false;
        $scope.getProcesos();
        $scope.datosReporte=reporte;
        $scope.boton="upd";
        $scope.titulo="Modificar Reporte";
    };
    $scope.eliminarReporteCargar = function(reporte){
        $scope.datosReporte=reporte;
        $scope.getProcesos();
        $scope.only=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Reporte";
    };

    $scope.limpiar = function(){
        $scope.only=false;
        $scope.getProcesos();
        $scope.datosReporte = '';
        $scope.boton="new";
        $scope.titulo="Registro de Reporte";
    }; 
    $scope.$on('api:ready',function(){
        $scope.getReportes(sessionService.get('WS_ID'));   
    });
    $scope.inicioReportes = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){           
            $scope.getReportes(sessionService.get('WS_ID'));
        }
    }; 

});