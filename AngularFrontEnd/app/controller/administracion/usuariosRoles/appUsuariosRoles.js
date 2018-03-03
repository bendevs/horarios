app.controller('UsuariosRolesController', function ($scope,$route,DreamFactory, $rootScope, CONFIG,sessionService,ngTableParams,$filter,sweet) {
    var respuestaSuccess = "TRUE";
    var handleUsuarios = function(obj, name){
        obj.success(function(response){
            $scope.usuarios = response;
        }).error(function(response){  
            $scope.errors[name] = $scope.conexion.error(response)
        })
    }
    $scope.getRoles = function(usrId){
        var resRoles = {
            "procedure_name":"roles_no_asignados",
            "body":{"params": [{"name":"idusr","param_type":"IN","value":usrId}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            $scope.roles = response;           
        })
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;            
        });
    }
    $scope.getUsuRoles = function(usrId){
        var resUsuRoles = {
            "procedure_name":"roles_asignados_usuario",
            "body":{"params": [{"name":"idusr","param_type":"IN","value":usrId}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuRoles);
        obj.success(function(response){
            $scope.usuariosRoles = response;
        })
        obj.error(function(response){  
            $scope.errors["error_UsuarioRol"] = error;            
        })
    }
    //**** listado usando procedimientos almacenados
    $scope.getUsuarios = function(){
        //$.blockUI();
        var resUsuario = {
            "procedure_name":"usuarioslst"
        };
        //servicio listar usuarios
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
            $scope.usuarios = response;
            //$.unblockUI(); 
        })
        obj.error(function(error) {
            $scope.errors["error_usuario"] = error;            
        });
    };
    $scope.seleccionarUsuario = function(usrId,nombre_usuario){
            $rootScope.idusu=usrId;
            $scope.nombre_usuario= " a " + nombre_usuario + ":";
            $scope.getUsuRoles(usrId);
            $scope.getRoles(usrId);
            $scope.checkboxes = { 'checked': true, items: {} };
            $scope.checkboxesi = { 'checked': true, items: {} };
    }
    $rootScope.idusu="";
    $scope.subir = function(){
        //$.blockUI();
        var id_usu=$rootScope.idusu;
        angular.forEach($scope.roles,function(celda, fila){
            var id_rol=celda['rlid'];
            if($scope.checkboxes.items[id_rol])
            {
                var usuRoles = {};
                var fecha= new Date();
                var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
                usuRoles['usrls_rls_id'] = id_rol;
                usuRoles['usrls_usr_id'] = id_usu;
                usuRoles['usrls_registrado'] = fechactual;
                usuRoles['usrls_modificado'] = fechactual;
                usuRoles['usrls_usuarios_usr_id'] = sessionService.get('IDUSUARIO');
                usuRoles['usrls_estado'] = 'A';
                var resUsuarioRol = {
                    table_name:"_bp_usuarios_roles",
                    body:usuRoles
                };
                //servicio insertar usuarios
                var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resUsuarioRol);
                obj.success(function(data){
                    $scope.getRoles(id_usu);
                    $scope.getUsuRoles(id_usu);
                    if (respuestaSuccess == "TRUE") { 
                        sweet.show('', 'Asignacion exitosa', 'success');
                        respuestaSuccess = "FALSE";
                    };   
                })
                .error(function(data){
                    sweet.show('', 'Falla asignacion', 'error');
                })
            } 
        });
        
        //$.unblockUI(); 
    }

    $scope.bajar = function(){
        //$.blockUI();
        var id_usu=$rootScope.idusu;
        angular.forEach($scope.usuariosRoles,function(celda, fila){
            var id_Usurol=celda['usrlsid'];

            if($scope.checkboxesi.items[id_Usurol])
            {
                var usuRoles = {};
                var fecha= new Date();
                var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
                usuRoles['usrls_modificado'] = fechactual;
                usuRoles['usrls_estado'] = 'B';
                usuRoles['usrls_usr_id'] = sessionService.get('IDUSUARIO');
                var resUsuarioRol = {
                    table_name:"_bp_usuarios_roles",
                    id:id_Usurol,
                    body:usuRoles
                };
                //servicio modificar usuarios
                var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resUsuarioRol);
                obj.success(function(data){
                    $scope.getRoles(id_usu);
                    $scope.getUsuRoles(id_usu);
                    if (respuestaSuccess == "TRUE") { 
                        sweet.show('', 'Desasignacion exitosa', 'success');
                        respuestaSuccess = "FALSE";
                    };  
                })
                .error(function(data){
                    sweet.show('', 'Falla desasignacion', 'error');
                })
            } 
        });
        //$.unblockUI(); 
    }
    $scope.$on('api:ready',function(){
        $scope.getUsuarios();       
    });
    $scope.inicioUsuariosRoles = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getUsuarios();
            
        }
    };
});