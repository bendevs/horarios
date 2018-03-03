app.controller('ct_nodoController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.errors = {};
    $scope.tablaAsignausuario = {};
    $scope.obtusuarios_nodos = "";
    $scope.estadoNodo=false;
    $scope.tablaCTNODO = {};
    $scope.obtCTNODO = "";
      //listar roles
    $scope.getCT_NODOS = function(){
        //$.blockUI();
        var resRoles = {
            "procedure_name":"sp_lst_ct_nodos"
        };
        //servicio listar roles 
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            $scope.obtCTNODO = response;
            $scope.obtArbol = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaCTNODO.reload();
            //$.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };

    $scope.actualizarArbol=function(){
        //$.blockUI();
        var resRoles = {
            "procedure_name":"sp_lst_nodos_arbol"
        };
        //servicio listar roles 
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            $scope.obtArbol = response;
            var obtArbol=JSON.stringify($scope.obtArbol);
            var parametros = {
                "NODOS" : obtArbol
            };
            $.ajax({
                data: parametros,
               // url: "http://gmlppc05905:9292/dreamfactory/dist/generaArbolAjax.php",
				url: [CONFIG.DSP]+'/dreamfactory/dist/generaArbolAjax.php',
                type: 'POST',
                error: function (response) {
                    $.unblockUI();
                    sweet.show('Exito', 'Se realizó la actualización correctamente', 'success');
                }
            });
        })
        obj.error(function(error) {
            //$.unblockUI();
            sweet.show('', 'Actualización no realizada, intentelo nuevamente', 'warning');
        });
    }

    $scope.tablaCTNODO = new ngTableParams({
                page: 1,          
                count: 5,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtCTNODO.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtCTNODO, params.filter()) :
                    $scope.obtCTNODO;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtCTNODO;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 



    $scope.asignacionUsuarios = function(datosUsuario,datosNodo){
        var nodoUsuario = {};
        nodoUsuario['nu_nodo_id'] = datosNodo.vnodo_id;
        nodoUsuario['nu_usr_usuario'] = datosUsuario.usu_usuario;
        nodoUsuario['nu_estado'] = 'ACTIVO';
        nodoUsuario['nu_registrado'] = fechactual;
        nodoUsuario['nu_modificado'] = fechactual;
        nodoUsuario['nu_usuario'] = 'ADMIN';
        nodoUsuario['nu_responsable'] = 'NO';
        console.log("datos que se adicionaran   ",nodoUsuario);
        var resNodoUsuario = {
            table_name:"_bp_nodos_usuarios",
            body:nodoUsuario
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resNodoUsuario);
        obj.success(function(data){
        sweet.show('', 'Registro insertado', 'success');
        $scope.getNodo_Usuarios(datosNodo.vnodo_id);
        $scope.datosUsuario = "";
        $scope.getUsuarios(  $scope.datosnodo1,$scope.usuario1);
        //$.unblockUI(); 
        //************************rosmery
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };


    $scope.getUsuarios = function(datosNodo, usuario){
        console.log("para buscar NODO    ", datosNodo,"USUARIO    ",usuario);
        $scope.datosnodo1=datosNodo;
        $scope.usuario1=usuario;
        var resUsuario = {
            "procedure_name":"sp_lst_usuarios_combo",
            "body":{
                            "params": [
                                {
                                    "name": "idnodo",
                                    "value": datosNodo
                                },
                                {
                                    "name": "usuario",
                                    "value": usuario
                                }                                
                            ]
                    }
        }; 
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario)
        .success(function (response) {          
            $scope.usuarios=response;          
        }).error(function(error) {
            $scope.errors["error_usuario"] = error;            
        })
    };

    $scope.buscarUsuario = function (datosNodo, datosUsuario) { 
        $scope.getUsuarios(datosNodo, datosUsuario);
    };


    $scope.buscarNodoEstado = function (estado) { 
        console.log("el estado essss:    ",estado);
        if (estado=='TODOS') {
            $scope.getCT_NODOS();
        }
        else{
        resNodo = {
            "procedure_name":"sp_lst_nodos_estado",
            "body":{
                            "params": [
                                {
                                    "name": "estado",
                                    "value": estado
                                }                              
                            ]
                    }
                };
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodo);
        obj.success(function (response) {
            $scope.obtCTNODO = response;
            $scope.obtArbol = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaCTNODO.reload();
            //$.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_roles"] = error;            
        });
        //$scope.getUsuarios(datosNodo, datosUsuario);
    };



//listado de nodos asignados a usuarios
    $scope.getNodo_Usuarios = function(datosNodo){
        //$.blockUI();
        var resnodo_id = {
            "procedure_name":"sp_asignacion_de_usuarios",
             "body":{
                            "params": [
                                {
                                    "name": "nombre_nodo",
                                    "value": datosNodo
                                }                                
                            ]
                    }
        };
        //servicio listar roles 
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resnodo_id);
        obj.success(function (response) {
            $scope.obtusuarios_nodos = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaAsignausuario.reload();
            //$.unblockUI();           
        })
        obj.error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };


    $scope.tablaAsignausuario = new ngTableParams({
            page: 1,          
            count: 5,
            filter: {},
            sorting: {}      
            }, {
                total: $scope.obtusuarios_nodos.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtusuarios_nodos, params.filter()) :
                    $scope.obtusuarios_nodos;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtusuarios_nodos;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 



    $scope.getNodoPadre = function(datosNodo, tipo){
        var resNodo = {
            "procedure_name":"sp_lst_nodopadre_combo",
            "body":{
                            "params": [
                                {
                                    "name": "nombre_nodo",
                                    "value": datosNodo
                                }                               
                            ]
                    }
        }; 
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodo)
        .success(function (response) {
            if(tipo == 1)
            {          
            $scope.nodopadres = response;
            }
            else
            {
            $scope.nodounidades = response;
            }            
        }).error(function(error) {
            $scope.errors["error_usuario"] = error;            
        })
    }; 


    $scope.buscarNodo = function (datosNodo, tipo) { 
        $scope.getNodoPadre(datosNodo, tipo);
    };


    $scope.getIdNuevo = function(){
        //$.blockUI();
        var resId = {
            "procedure_name":"sp_lst_ct_nuevoid"
        };
        //servicio listar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resId);
        obj.success(function (response) {
            $scope.obtId = response[0].vnodo_id;
            //$.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };


    $scope.adicionarNodo = function(datosNodo){
        //$.blockUI();
        var nodo = {};
        nodo['nodo_id'] = $scope.obtId; 
        nodo['nodo_nombre'] = datosNodo.vnodo_nombre;
        nodo['nodo_sigla'] = datosNodo.vnodo_sigla;
        nodo['nodo_padre'] = datosNodo.vnodo_padre;
        nodo['nodo_gestion'] = fecha.getFullYear();
        nodo['nodo_id_uo'] = datosNodo.vnodo_id_uo;
        nodo['nodo_tipouo'] = '0';
        nodo['nodo_nivel'] = '0';
        nodo['nodo_estado'] = datosNodo.vnodo_estado;
        nodo['nodo_registrado'] = fechactual;
        nodo['nodo_modificado'] = fechactual;
        nodo['nodo_usuario'] = sessionService.get('USUARIO');
        nodo['nodo_anterior_id'] = '0';
        if (datosNodo.vnodo_cierre_tramiteF) {
            nodo['nodo_cierre_tramite']='SI';
        } else{
            nodo['nodo_cierre_tramite']='NO';
        };
         var resNodo = {
            table_name:"ct_nodos",
            body:nodo
        };
        //servicio insertar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resNodo);
        obj.success(function(data){
            $scope.getCT_NODOS();
            //$.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };


    $scope.modificarNodo = function(datosNodo){
        //$.blockUI();
        var nodo = {}; 
        nodo['nodo_nombre'] = datosNodo.vnodo_nombre;
        nodo['nodo_sigla'] = datosNodo.vnodo_sigla;
        nodo['nodo_padre'] = datosNodo.vnodo_padre;
        nodo['nodo_gestion'] = fecha.getFullYear();
        nodo['nodo_id_uo'] = datosNodo.vnodo_id_uo;
        nodo['nodo_tipouo'] = '0';
        nodo['nodo_nivel'] = '0';
        nodo['nodo_estado'] = datosNodo.vnodo_estado;
        nodo['nodo_modificado'] = fechactual;
        nodo['nodo_usuario'] = sessionService.get('USUARIO');;
        nodo['nodo_anterior_id'] = '0';
        if (datosNodo.vnodo_cierre_tramiteF) {
            nodo['nodo_cierre_tramite']='SI';
        } else{
            nodo['nodo_cierre_tramite']='NO';
        };
        var resNodo = {
            table_name:"ct_nodos",
            id:datosNodo.vnodo_id,
            body:nodo
        };
        //servicio modificar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resNodo);
        obj.success(function(data){
            //$.unblockUI(); 
            $scope.getCT_NODOS();
            sweet.show('', 'Registro modificado', 'success');
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };


    $scope.activarDesactivarNodo = function(nodoId,estado){
        //$.blockUI();
        var nodo = {};
        if(estado==1)
        {
        nodo['nodo_modificado'] = fechactual;
        nodo['nodo_estado'] = 'ACTIVO';
        nodo['nodo_usuario'] = sessionService.get('IDUSUARIO');
        }
        else
        {
        nodo['nodo_modificado'] = fechactual;
        nodo['nodo_estado'] = 'INACTIVO';
        nodo['nodo_usuario'] = sessionService.get('IDUSUARIO');
        };
        var resNodo = {
            table_name:"ct_nodos",
            id:nodoId,
            body:nodo
        };
        //servicio eliminar personas
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resNodo);
        obj.success(function(data){
            //$.unblockUI();
            sweet.show('', 'Registro almacenado ', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no almacenado', 'error');
        })
    }; 

    $scope.eliminarNodoUsuario = function(nodouser, idNodo){
        //$.blockUI();
        var nodoUsuario = {};
        nodoUsuario['nu_modificado'] = fechactual;
        nodoUsuario['nu_estado'] = 'INACTIVO';
         var resNodo = {
            table_name:"_bp_nodos_usuarios",
            id:nodouser.asig_nodo_user,
            body:nodoUsuario
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resNodo);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $scope.getNodo_Usuarios(idNodo);
            $scope.getUsuarios(idNodo);
            //$.unblockUI(); 
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 



    $scope.asignarResponsable = function (nodouser,datosNodo,usuario) {
        //$.blockUI();
         var pasarNodo = datosNodo;
                var datosResponsable = {
                            "procedure_name":"sp_asignacion_responsable",
                            "body":{
                                  "params": [
                                    {
                                      "name": "idtabla",
                                      "value": nodouser
                                    },
                                    {
                                      "name": "idnodo",
                                      "value": datosNodo
                                    },
                                    {
                                      "name": "usuario",
                                      "value": usuario
                                    }
                                  ]
                            }                
                };        
                DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosResponsable).success(function (response){
                sweet.show('', 'Asignación Exitosa', 'success');
                               console.log("MI NODOOOO  ", pasarNodo);
                               $scope.getNodo_Usuarios(pasarNodo);
                            //$.unblockUI(); 
        }).error(function(response){
        });

    };
    

     $scope.asignarUser = function(nodo,idnodo){
        console.log("mis datos del nodo",nodo, "id del nodo  ",idnodo);
        $scope.only = false;
        $scope.datosNodo = nodo;
        $scope.getNodo_Usuarios(idnodo);
        $scope.titulo = "Asignación de Usuarios";
    };

    
    $scope.modificarNodoCargar = function(nodo){
        $scope.only=false;
        $scope.estadoNodo=true;
        $scope.datosNodo=nodo;
        if (nodo.vnodo_cierre_tramite == 'SI') {
            nodo.vnodo_cierre_tramiteF = true;
        } else{
            nodo.vnodo_cierre_tramiteF = false;
        };
        $scope.getNodoPadre(nodo.vnodo_nombre_padre, 1);
        $scope.getNodoPadre(nodo.vnodo_nombre_uo, 2);
        $scope.boton="upd";
        $scope.titulo="Modificar Nodos";
    };

    $scope.limpiar = function(){
        $scope.only=false;
        $scope.estadoNodo=true;
        $scope.datosNodo = '';
        $scope.getIdNuevo();
        $scope.boton="new";
        $scope.titulo="Registro de Nodo";
    }; 
    $scope.$on('api:ready',function(){
        $scope.getCT_NODOS();   
    });
    $scope.inicioCT_NODO = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
             $scope.getCT_NODOS();
        }
    }; 

});