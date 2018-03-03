app.controller('rolesController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
      //listar roles
    $scope.getRoles = function(){
        //$.blockUI();
        var resRoles = {
            "procedure_name":"roleslst"
        };
        //servicio listar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            $scope.obtRoles = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaRoles = new ngTableParams({
                page: 1,          
                count: 10,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtRoles.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtRoles, params.filter()) :
                    $scope.obtRoles;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtRoles;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 
            //$.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };
    $scope.adicionarRol = function(datosRol){
        //$.blockUI();
        var rol = {};
        rol['rls_rol'] = datosRol.rlsRol;
        rol['rls_registrado'] = fechactual;
        rol['rls_modificado'] = fechactual;
        rol['rls_usr_id'] = sessionService.get('IDUSUARIO');
        rol['rls_estado'] = 'A';
        var resRol = {
            table_name:"_bp_roles",
            body:rol
        };
        //servicio insertar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resRol);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
            //handleRoles($scope.conexion.getListSP('roleslst',{}), 'post');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarRol = function(rolId,datosRol){
        //$.blockUI();
        var rol = {};
        rol['rls_rol'] = datosRol.rlsRol;
        rol['rls_modificado'] = fechactual;
        rol['rls_usr_id'] = sessionService.get('IDUSUARIO');
        //handleRoles($scope.conexion.update(rolId,rol), 'update');
        var resRol = {
            table_name:"_bp_roles",
            id:rolId,
            body:rol
        };
        //servicio modificar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resRol);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro modificado', 'success');
            //handleRoles($scope.conexion.getListSP('roleslst',{}), 'post');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
        //$route.reload();
    };
    $scope.eliminarRol = function(rolId){
        //$.blockUI();
        var rol = {};
        rol['rls_modificado'] = fechactual;
        rol['rls_estado'] = 'B';
        rol['rls_usr_id'] = sessionService.get('IDUSUARIO');
         var resRol = {
            table_name:"_bp_roles",
            id:rolId,
            body:rol
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resRol);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 
    $scope.modificarRolCargar = function(rol){
        $scope.only=false;
        $scope.datosRol=rol;
        $scope.boton="upd";
        $scope.titulo="Modificar Roles";
    };
    $scope.eliminarRolCargar = function(rol){
        $scope.only=true;
        $scope.datosRol=rol;
        $scope.boton="del";
        $scope.titulo="Eliminar Roles";
    };
    $scope.limpiar = function(){
        $scope.only=false;
        $scope.datosRol = '';
        $scope.boton="new";
        $scope.titulo="Registro de Roles";
    }; 
    $scope.$on('api:ready',function(){
        $scope.getRoles();       
    });
    $scope.inicioRoles = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getRoles();
            
        }
    }; 

});