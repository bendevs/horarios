app.controller('busquedaDinamicaController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.errors = {};
    $scope.tablaBusquedas = {};
    $scope.obtBusquedas = "";    
    
      //listar roles
    $scope.getBusquedas = function(wsId){
          $scope.wsId=sessionService.get('WS_ID');
          console.log($scope.wsId);
          $.blockUI();

          var resBusquedas = {
              "procedure_name":"sp_busquedas",
              "body":{"params": [{"name":"ws_id","value":wsId}]
              }
          };
          //servicio listar roles
          var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resBusquedas);
          obj.success(function (response) {
              $scope.obtBusquedas = response;
              var data = response;   //grabamos la respuesta para el paginado
              $scope.tablaBusquedas.reload();
              $.unblockUI();
          })
          obj.error(function(error) {
              $scope.errors["error_roles"] = error;
          });
      };

    $scope.tablaBusquedas = new ngTableParams({
                page: 1,
                count: 5,
                filter: {},
                sorting: {}
            }, {
                total: $scope.obtBusquedas.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtBusquedas, params.filter()) :
                    $scope.obtBusquedas;
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtBusquedas;
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



    $scope.validar=function(datosBusqueda){
        $("#btnCerrar" ).click();
        $scope.adicionarBusqueda(datosBusqueda);
    };


    $scope.adicionarBusqueda = function(datosBusqueda){
        $.blockUI();
        console.log(datosBusqueda.rconsultasql);
        var Busqueda = {};
        Busqueda['bsq_busqueda'] = datosBusqueda.rnombre;
        Busqueda['bsq_titulo'] = datosBusqueda.rtitulo;
        Busqueda['bsq_titulo_columnas'] = datosBusqueda.rtitcolumnas;
        Busqueda['bsq_consulta_sql'] = datosBusqueda.rconsultasql;
        Busqueda['bsq_filtrado'] = datosBusqueda.rfiltrado;
        Busqueda['bsq_ws_id'] = $scope.wsId;
        Busqueda['bsq_registrado'] = fechactual;
        Busqueda['bsq_modificado'] = fechactual;
        Busqueda['bsq_estado'] = 'A';
         var resBusqueda = {
            table_name:"_bp_busqueda_dinamica",
            body:Busqueda
        };
        console.log("datos de Busqueda    ",Busqueda);
        
        //servicio insertar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resBusqueda);
        obj.success(function(data){
            $scope.getBusquedas();
            $.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };


    $scope.modificarBusqueda = function(datosBusqueda){
        $.blockUI();
        var Busqueda = {};         
        Busqueda['bsq_busqueda'] = datosBusqueda.rnombre;
        Busqueda['bsq_titulo'] = datosBusqueda.rtitulo;        
        Busqueda['bsq_titulo_columnas'] = datosBusqueda.rtitcolumnas;
        Busqueda['bsq_consulta_sql'] = datosBusqueda.rconsultasql;
        Busqueda['bsq_filtrado'] = datosBusqueda.rfiltrado;
        Busqueda['bsq_ws_id'] = $scope.wsId;        
        Busqueda['bsq_modificado'] = fechactual;        
        var resBusqueda = {
            table_name:"_bp_busqueda_dinamica",
            id:datosBusqueda.rid,
            body:Busqueda
        };
        //servicio modificar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resBusqueda);
        obj.success(function(data){
            $.unblockUI(); 
            $scope.getBusquedas();
            sweet.show('', 'Registro modificado', 'success');
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };


    $scope.eliminarBusqueda = function(datosBusqueda){
        $.blockUI();
        var Busqueda = {}; 
        Busqueda['bsq_modificado'] = fechactual;
        Busqueda['bsq_estado'] = 'B';
        var resBusqueda = {
            table_name:"_bp_busqueda_dinamica",
            id:datosBusqueda.rid,
            body:Busqueda
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resBusqueda);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $scope.getBusquedas();
            $.unblockUI(); 
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 

    
    $scope.modificarBusquedaCargar = function(Busqueda){
        $scope.only=false;
        $scope.getProcesos();
        $scope.datosBusqueda=Busqueda;
        $scope.boton="upd";
        $scope.titulo="Modificar Busqueda";
    };
    $scope.eliminarBusquedaCargar = function(Busqueda){
        $scope.datosBusqueda=Busqueda;
        $scope.getProcesos();
        $scope.only=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Busqueda";
    };

    $scope.limpiar = function(){
        $scope.only=false;
        $scope.getProcesos();
        $scope.datosBusqueda = '';
        $scope.boton="new";
        $scope.titulo="Registro de Busqueda";
    }; 
    $scope.$on('api:ready',function(){
        $scope.getBusquedas(sessionService.get('WS_ID'));   
    });
    $scope.inicioBusqueda = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){           
            $scope.getBusquedas(sessionService.get('WS_ID'));
        }
    }; 

});