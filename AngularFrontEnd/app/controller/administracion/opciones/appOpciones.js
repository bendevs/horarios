app.controller('opcionesController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet) { 
    var strfecha= new Date();
    var strfechactual=strfecha.getFullYear() + "-" + strfecha.getMonth() + "-" + strfecha.getDate() + " " + strfecha.getHours() + ":" + strfecha.getMinutes() + ":" + strfecha.getSeconds();
    $scope.getOpciones = function(){
        var resOpcion = {
            function_name: "opcioneslst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
            $scope.obtOpciones=response;
            //$.unblockUI(); //cerrar la mascara 
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaOpciones = new ngTableParams({
                page: 1,          
                count: 10,
                filter: {},
                sorting: {}
            }, {
                total: $scope.obtOpciones.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtOpciones, params.filter()) :
                    $scope.obtOpciones;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtOpciones;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                  
                }
            });          
        }).error(function(response){
            $scope.disabled[name]=false; 
            alert("error al cargar");
        });      
    };
    $scope.getGrupos = function(){
        var resGrupo = {
           function_name: "gruposlst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resGrupo).success(function (response){
            $scope.obtGrupos = response;
            //$.unblockUI(); //cerrar la mascara             
        },function(error) {
            $scope.errors["error"] = error;            
        });        
    };
    $scope.adicionarOpciones = function(datosOpcion){
        var opcion = {}; 
        //$.blockUI();  
        opcion['opc_grp_id'] = datosOpcion.opcGrpId;
        opcion['opc_opcion'] = datosOpcion.opcOpcion;
        opcion['opc_contenido'] = datosOpcion.opcContenido;
        opcion['opc_registrado'] = strfechactual;
        opcion['opc_modificado'] = strfechactual;
        opcion['opc_usr_id'] = sessionService.get('IDUSUARIO');
        var resOpcion = {"table_name":"_bp_opciones",
                        "body":opcion};      
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resOpcion);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            //$.unblockUI(); //cerrar la mascara 
            $route.reload();  
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };
    $scope.modificarOpcionCargar = function(datosOpcion){
        $scope.datosOpcion = datosOpcion;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar Opcion";
    };
    $scope.eliminarOpcionCargar = function(datosOpcion){
        $scope.datosOpcion= datosOpcion;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Opcion";
    };
    $scope.limpiar = function(){
        $scope.datosOpcion = [''];
        $scope.boton="new";
        $scope.desabilitado = false;
        $scope.titulo="Registrar Opcion";
    };
    $scope.modificarOpciones = function(opcId,datosOpcion){
        var opcion = {}; 
        //$.blockUI();   
        opcion['opc_grp_id'] = datosOpcion.opcGrpId;
        opcion['opc_opcion'] = datosOpcion.opcOpcion;
        opcion['opc_contenido'] = datosOpcion.opcContenido;
        opcion['opc_registrado'] = strfechactual;
        opcion['opc_modificado'] = strfechactual;
        opcion['opc_usr_id'] = sessionService.get('IDUSUARIO');
        var resOpcion = {"table_name":"_bp_opciones", 
                        "body":opcion,
                        "id" : opcId}; 
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resOpcion);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            //$.unblockUI(); 
            $route.reload();
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })   
    };
    $scope.EliminarOpciones = function(opcId){
        var opcion = {};
        //$.blockUI();
        opcion['opc_modificado'] = strfechactual;
        opcion['opc_estado'] = 'B';
        opcion['opc_usr_id'] = sessionService.get('IDUSUARIO');
        var resOpcion = {"table_name":"_bp_opciones", 
                        "body":opcion,
                        "id" : opcId}; 
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resOpcion);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            //$.unblockUI();      
            $route.reload();
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })      
    };
    $scope.$on('api:ready',function(){            
        $scope.getOpciones();
        $scope.getGrupos();
    });
    $scope.inicioOpciones = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getOpciones();
            $scope.getGrupos();
            //$.blockUI();
        }
    };     
});