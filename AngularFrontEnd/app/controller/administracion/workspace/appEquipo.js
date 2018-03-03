app.controller('equiposController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
      //listar equipos
    $scope.getEquipos = function(){
        //$.blockUI();
        var resEquipos = {
            "procedure_name":"workspace_lst"
        };
        //servicio listar equipos
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resEquipos);
        obj.success(function (response) {
            $scope.obtEquipos = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaEquipos = new ngTableParams({
                page: 1,          
                count: 10,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtEquipos.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtEquipos, params.filter()) :
                    $scope.obtEquipos;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtEquipos;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 
            //$.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_equipos"] = error;            
        });        
    };
    $scope.adicionarEquipo = function(datosEquipo){
        //$.blockUI();
        var nombre =datosEquipo.wsnombre
        var equipo = {};
        equipo['ws_nombre'] = nombre.toUpperCase();
        equipo['ws_registrado'] = fechactual;
        equipo['ws_modificado'] = fechactual;
        equipo['ws_usr_id'] = sessionService.get('IDUSUARIO');
        equipo['ws_estado'] = 'A';
        var resEquipo = {
            table_name:"_bp_workspace",
            body:equipo
        };
        //servicio insertar equipos
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resEquipo);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
            //handleEquipos($scope.conexion.getListSP('equiposlst',{}), 'post');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarEquipo = function(equipoId,datosEquipo){
        //$.blockUI();
        var equipo = {};
        equipo['ws_nombre'] = datosEquipo.wsnombre;
        equipo['ws_modificado'] = fechactual;
        equipo['ws_usr_id'] = sessionService.get('IDUSUARIO');
        //handleEquipos($scope.conexion.update(equipoId,equipo), 'update');
        var resEquipo = {
            table_name:"_bp_workspace",
            id:equipoId,
            body:equipo
        };
        //servicio modificar equipos
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resEquipo);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro modificado', 'success');
            //handleEquipos($scope.conexion.getListSP('equiposlst',{}), 'post');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
        //$route.reload();
    };
    $scope.eliminarEquipo = function(equipoId){
        //$.blockUI();
          var resOpciones =  {
                        "function_name":"usuario_dlt",
                        "body":{
                                "params": [
                                    {
                                        "name": "wsid",
                                        "value":  equipoId
                                    }
                                ]
                        }
                }; 
                    
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpciones);
        obj.success(function (response) {
            $scope.Opciones = response; 
            var data = response;
            console.log("respuesta de eliminar",data);
            if( data ==0){ 
        var equipo = {};
        equipo['ws_modificado'] = fechactual;
        equipo['ws_estado'] = 'B';
        equipo['ws_usr_id'] = sessionService.get('IDUSUARIO');
         var resEquipo = {
            table_name:"_bp_workspace",
            id:equipoId,
            body:equipo
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resEquipo);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
        }
        else{
            sweet.show('', 'Registro no eliminado', 'error');
        } 

        })
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;            
        });
        



        
    }; 
    $scope.modificarEquipoCargar = function(equipo){
        $scope.only=false;
        $scope.datosEquipo=equipo;
        $scope.boton="upd";
        $scope.titulo="Modificar Equipos";
    };
    $scope.eliminarEquipoCargar = function(equipo){
        $scope.only=true;
        $scope.datosEquipo=equipo;
        $scope.boton="del";
        $scope.titulo="Eliminar Equipos";
    };
    $scope.limpiar = function(){
        $scope.only=false;
        $scope.datosEquipo = '';
        $scope.boton="new";
        $scope.titulo="Registro de Equipos";
    }; 
    $scope.$on('api:ready',function(){
        $scope.getEquipos();       
    });
    $scope.inicioEquipos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getEquipos();
            
        }
    }; 

});