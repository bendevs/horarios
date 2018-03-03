app.controller('asignacionNodosController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.errors = {};
    $scope.tablaAccion = {};
    $scope.obtAsignausuario ="";
    $scope.tablaTramite = {};
    $scope.obtAsignaTramite = "";
      //listar roles
    $scope.getListaUsuario = function(){
        $.blockUI();
        var resListaUsuario = {
            "procedure_name":"sp_lst_usuarios"
        };
        //servicio listar roles 
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resListaUsuario);
        obj.success(function (response) {
            $scope.obtUsuarios = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaUsuario = new ngTableParams({
                page: 1,          
                count: 5,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtUsuarios.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtUsuarios, params.filter()) :
                    $scope.obtUsuarios;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtUsuarios;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 
            $.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };



//listar usuario nodos
    $scope.getAsignacion_de_nodos = function(usuario){
        $.blockUI();
        var resnombreusuario = {
            "procedure_name":"sp_asignacion_de_nodos",
             "body":{
                            "params": [
                                {
                                    "name": "usu_nodo",
                                    "value": usuario
                                }                                
                            ]
                    }
        };
        //servicio listar roles 
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resnombreusuario);
        obj.success(function (response) {
            $scope.obtAsignausuario = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaAccion.reload();
            $.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };

    $scope.tablaAccion = new ngTableParams({
                page: 1,          
                count: 5,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtAsignausuario.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtAsignausuario, params.filter()) :
                    $scope.obtAsignausuario;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtAsignausuario;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 




    $scope.Adiciona_asignacionUsuario = function(usuario, idUsuario){
        $.blockUI();
        var asignarnodo = {}; 
        asignarnodo['nu_nodo_id'] = usuario.vnodo_padre;
        asignarnodo['nu_usr_usuario'] = usuario.usu_usuario;
        asignarnodo['nu_estado'] = 'ACTIVO';
        asignarnodo['nu_registrado'] = fechactual;
        asignarnodo['nu_modificado'] = fechactual;
        asignarnodo['nu_responsable'] = 'NO';
        console.log("datos que se insertaran: ", asignarnodo);
        var resAsignaNodo = {
            table_name:"_bp_nodos_usuarios",
            body:asignarnodo
        };
        //servicio modificar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resAsignaNodo);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $scope.getAsignacion_de_nodos(idUsuario);
            $scope.usuario.vnodo_padre = "";
            $.unblockUI(); 
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };



    $scope.getAsignacion_de_tramites = function(asignaTramite){
        $.blockUI();
        var resusuarioTramite = {
            "procedure_name":"sp_asignacion_de_tramites",
             "body":{
                            "params": [
                                {
                                    "name": "usuario",
                                    "value": asignaTramite
                                }                                
                            ]
                    }
        };
        //servicio listar roles 
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resusuarioTramite);
        obj.success(function (response) {
            $scope.obtAsignaTramite = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaTramite.reload();
            $.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };


    $scope.tablaTramite = new ngTableParams({
                page: 1,          
                count: 5,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtAsignaTramite.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtAsignaTramite, params.filter()) :
                    $scope.obtAsignaTramite;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtAsignaTramite
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 


    $scope.Adiciona_asignacionTramite = function(asignaTramite, usuario){
        $.blockUI();
        var asignartramite = {}; 
        asignartramite['tu_tipo_tramite_cod'] = asignaTramite.cod_tramite;
        asignartramite['tu_usr_usuario'] = asignaTramite.usu_usuario;
        asignartramite['tu_estado'] = 'ACTIVO';
        asignartramite['tu_registrado'] = fechactual;
        asignartramite['tu_modificado'] = fechactual;
        var resAsignaTramite = {
            table_name:"ct_tramites_usuarios",
            body:asignartramite
        };
        //servicio modificar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resAsignaTramite);
        obj.success(function(data){
            $scope.getAsignacion_de_tramites(usuario);
            $scope.getTipoTramite(usuario);
            $scope.asignaTramite.cod_tramite = "";
            $.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };



    $scope.getTipoTramite = function(usuario){
        var restipoTramite = {
            "procedure_name":"sp_lst_tramites_combo",
            "body":{
                            "params": [
                                {
                                    "name": "usuario",
                                    "value": usuario
                                }                                
                            ]
                    }
        };       
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(restipoTramite)
        .success(function (response) {          
            $scope.tipotramites = response;         
        }).error(function(error) {
            $scope.errors["error_reg_civil"] = error;            
        });
    } 



    $scope.getNodoPadre = function(usuario, nombreNodo){
        var resNodoPadre = {
            "procedure_name":"sp_lst_nodos_combo",
             "body":{
                            "params": [
                                {
                                    "name": "usuario",
                                    "value": usuario 
                                },
                                {
                                    "name": "nombre_nodo",
                                    "value": nombreNodo 
                                }                                 
                            ]
                    }
        };      
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodoPadre)
        .success(function (response) {          
            $scope.nodopadres = response;        
        }).error(function(error) {
            $scope.errors["error_reg_civil"] = error;            
        });
    }


    $scope.buscarNodo = function (usuario, datosNodo) { 
        $scope.getNodoPadre(usuario, datosNodo);
    };  



      $scope.eliminarAsignacionUsuario = function(asignaUsuario, usuario){
        $.blockUI();
        var nodoUsuarioAccion = {};
        nodoUsuarioAccion['nu_modificado'] = fechactual;
        nodoUsuarioAccion['nu_estado'] = 'INACTIVO';
        var resNodoUsuario = {
            table_name:"_bp_nodos_usuarios",
            id:asignaUsuario.asig_nodo_user,
            body:nodoUsuarioAccion
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resNodoUsuario);
        obj.success(function(data){
            $.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            console.log("USUARIO:  ",usuario);
            $scope.getAsignacion_de_nodos(usuario);
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 



    $scope.eliminarAsignacionTramite = function(estadoTramite, tramite, asignaTramite, estado){
        $.blockUI();
        if (estado == 1) 
        {
            if (estadoTramite == 'SI')
            {
            sweet.show('', 'El Trámite ya esta Activo', 'warning');
            } 
            else
            {
                var usuarioTramite = {};
                usuarioTramite['tu_modificado'] = fechactual;
                usuarioTramite['tu_estado'] = 'ACTIVO';
                var resUsuarioTramite = {
                table_name:"ct_tramites_usuarios",
                id:tramite,
                body:usuarioTramite
                };
                var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resUsuarioTramite);
                obj.success(function(data){

                setTimeout(function(){             
                    $.unblockUI();  
                },1000);

                sweet.show('', 'Registro Activado', 'success');
                $scope.getAsignacion_de_tramites(asignaTramite);
                })
                .error(function(data){
                sweet.show('', 'Registro no Activado', 'error');
                })
            };
        } 
        else
        {
            if (estadoTramite == 'NO')
            {
            sweet.show('', 'El Trámite ya esta Desactivado', 'warning');
            }
              else
            {
                var usuarioTramite = {};
                usuarioTramite['tu_modificado'] = fechactual;
                usuarioTramite['tu_estado'] = 'INACTIVO';
                var resUsuarioTramite = {
                table_name:"ct_tramites_usuarios",
                id:tramite,
                body:usuarioTramite
                };
                var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resUsuarioTramite);
                obj.success(function(data){
                $.unblockUI(); 
                sweet.show('', 'Registro Eliminado', 'success');
                $scope.getAsignacion_de_tramites(asignaTramite);
                })
                .error(function(data){
                sweet.show('', 'Registro no Eliminado', 'error');
                })
            };
        }    
    };




    $scope.activarAsignacionTramite = function(asignaUsuario){
        $.blockUI();
        var nodoUsuarioAccion = {};
        nodoUsuarioAccion['nu_modificado'] = fechactual;
        nodoUsuarioAccion['nu_estado'] = 'INACTIVO';
         var resNodoUsuario = {
            table_name:"_bp_nodos_usuarios",
            id:asignaUsuario.asig_nodo_user,
            body:nodoUsuarioAccion
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resNodoUsuario);
        obj.success(function(data){
            $.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 


    $scope.asignaAccionUsuario = function(asignaNodo, usuario){
        $scope.only = false;
        $scope.usuario = asignaNodo;
        $scope.getAsignacion_de_nodos(usuario);
        $scope.titulo = "Asignacion de Usuarios";
        $scope.tituloTabla = "Nodos Asignados";
        $scope.usuario.vnodo_padre = "";
    };


     $scope.AsignaTramite = function(asignaNodo, usuario){
        $scope.only = false;
        $scope.asignaTramite = asignaNodo;
        $scope.getAsignacion_de_tramites(usuario);
        $scope.getTipoTramite(usuario);
        $scope.titulo = "Asignacion de Tipos de Trámites";
        $scope.tituloTabla = "Tipos de Trámites Asignados";
        $scope.asignaTramite.tipo_tramite_cod = "";
    };


    $scope.limpiar = function(){
        $scope.only=false;
        $scope.datosNodo = '';
        $scope.getIdNuevo();
        $scope.boton="new";
        $scope.titulo="Registro de Nodo";
    }; 
    $scope.$on('api:ready',function(){
            $scope.getListaUsuario();   
    });
    $scope.inicioAsignacionNodos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getListaUsuario();
        }
    }; 

});