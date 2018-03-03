app.controller('RbusquedaController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };
    $scope.getBusquedas = function(){
        $.blockUI();

        var reslocal = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",

                    "param_type":"IN","value":"SELECT bsq_id, bsq_registrado, bsq_modificado, prc_nombre as bsq_prs_nombre, bsq_prs_id, bsq_campo, bsq_nombre FROM _fr_busquedas A, _fr_proceso B WHERE bsq_estado ='A' and bsq_ws_id = "+sessionService.get('WS_ID')+" and  prc_id = bsq_prs_id"
                }]
            }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
          obj.success(function (response) {
              $scope.obtBusquedas = JSON.parse(response[0].ejecutartojson);
              var data = $scope.obtBusquedas;
              
               $.unblockUI();
               $scope.tablaBusquedas = new ngTableParams({
                page: 1,          
                count: 10,
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

          });
          obj.error(function(error) {
               $.unblockUI();
              console.log("se fue al error osea mary....");
          });
    };
    $scope.getEstados = function(){
       var reslocal = {
            "procedure_name":"ejecutartojson",
            "body":{
                "params": [
                {
                    "name":"expression",

                    "param_type":"IN","value":"SELECT * FROM  _fr_proceso B WHERE prc_estado ='A' and prc_ws_id = "+sessionService.get('WS_ID')+" "
                }]
            }
        };      
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal)
        .success(function (response) {
            $scope.estados = JSON.parse(response[0].ejecutartojson);
            console.log($scope.estados);          
        }).error(function(error) {
            $scope.errors["error_reg_civil"] = error;            
        });
    }
    $scope.adicionarBusqueda = function(datosBusqueda){
        $.blockUI();
        console.log(datosBusqueda);
        var busqueda = {};
        busqueda['bsq_ws_id'] = sessionService.get('WS_ID'); 
        busqueda['bsq_registrado'] = fechactual;
        busqueda['bsq_modificado'] = fechactual;
        busqueda['bsq_prs_id'] = datosBusqueda.bsq_prs_id;
        busqueda['bsq_campo'] = datosBusqueda.bsq_campo;
        busqueda['bsq_nombre'] = datosBusqueda.bsq_nombre;     
        
        var resBusqueda = {
            table_name:"_fr_busquedas",
            body:busqueda
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resBusqueda);
        obj.success(function(data){
            $scope.getEstados();
            $.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
            $route.reload();
            $scope.getBusquedas();
        })
        .error(function(data){
            $.unblockUI();
            console.log(data);
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarBusqueda = function(bsq_id,datosBusqueda){
        console.log(bsq_id,datosBusqueda);
        $.blockUI();
         var reslocal = {
            "procedure_name":"modificar_busqueda",
            "body":{
                "params": [
                {
                        "name": "bsqid",
                        "value": bsq_id
                    },
                    {
                        "name": "proceso",
                        "value": datosBusqueda.bsq_prs_id
                    },
                    {
                        "name": "fecha",
                        "value": fechactual
                    },
                    {
                        "name": "campo",
                        "value": datosBusqueda.bsq_campo
                    },
                    {
                        "name": "nombre",
                        "value": datosBusqueda.bsq_nombre
                    }
                    ]
            }
        };      
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
        obj.success(function(data){
            $scope.getEstados();
            $.unblockUI(); 
            sweet.show('', 'Registro modificado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
            console.log(data);
            $.unblockUI(); 
        })
    };
    $scope.eliminarBusqueda = function(bsq_id){
        console.log(fechactual,bsq_id)
        $.blockUI();
         var reslocal = {
            "procedure_name":"eliminar_busqueda",
            "body":{
                "params": [
                {
                        "name": "bsqid",
                        "value": bsq_id
                    },
                    {
                        "name": "fecha",
                        "value": fechactual
                    }
                    ]
            }
        };      
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal)
        .success(function (response) {
            $scope.getEstados();
            $.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            $route.reload();
        }).error(function(error) {
            $.unblockUI(); 
            console.log(error);
            sweet.show('', 'Registro no eliminado', 'error');          
        });       
    }; 
    $scope.modificarBusquedaCargar = function(busqueda){
        $scope.desabilitado=false;
        $scope.datosBusqueda = busqueda;
        $scope.boton="upd";
        $scope.titulo="Modificar Busquedas";
    };
    $scope.eliminarBusquedaCargar = function(busqueda){
        $scope.desabilitado=true;
        $scope.datosBusqueda = busqueda;
        $scope.boton="del";
        $scope.titulo="Eliminar Busquedas";
    };
    $scope.limpiar = function(){
        $scope.datosBusqueda='';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Busquedas";
    };
    $scope.$on('api:ready',function(){
        $scope.getBusquedas();
        $scope.getEstados();
    });
    $scope.inicioBusquedas = function () {
        if(DreamFactory.isReady()){
            $scope.getBusquedas();
            $scope.getEstados();
        }
    };    
    
});
