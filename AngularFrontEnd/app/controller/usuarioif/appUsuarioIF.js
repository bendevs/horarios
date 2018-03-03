app.controller('usrifController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
      //listar roles
    $scope.getRoles = function(){
        $.blockUI();
        var resRoles = {
            "procedure_name":"usuario_ifsig_lst"
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
            $.unblockUI();
        })
        obj.error(function(error) {
            $.unblockUI();
            console.log("error");
        });
           

    };
    $scope.adicionarRol = function(datosRol){
        //$.blockUI();
        console.log(datosRol);
        var rol = {};
        rol['usuario_if'] = datosRol.usuarioif;
        rol['usuario_genesis'] = datosRol.usuariogenesis;
        rol['uig_registrado'] = fechactual;
        rol['uig_modificado'] = fechactual;
        rol['uig_usuario_id'] = sessionService.get('IDUSUARIO');
        rol['uig_estado'] = 'A';
        var resRol = {
            table_name:"_bp_usuarios_if_genesis",
            body:rol
        };
        //servicio insertar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resRol);
        obj.success(function(data){
            //$.unblockUI(); 
            console.log(data);
            sweet.show('', 'Registro insertado', 'success');
            //handleRoles($scope.conexion.getListSP('roleslst',{}), 'post');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
            console.log(data);            
        })
    };

    $scope.modificarRol = function(rolId,datosRol){
        //$.blockUI();
        console.log(rolId,datosRol);
        var rol = {};
        rol['usuario_if'] = datosRol.usuarioif;
        rol['usuario_genesis'] = datosRol.usuariogenesis;
        rol['uig_modificado'] = fechactual;
        rol['uig_usuario_id'] = sessionService.get('IDUSUARIO');
        //handleRoles($scope.conexion.update(rolId,rol), 'update');
        var resRol = {
            table_name:"_bp_usuarios_if_genesis",
            id:rolId,
            body:rol
        };
            //  console.log(datosRol);
        console.log("datos que estan en el sistema",rol);
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
        console.log(rolId);
        var rol = {};
        rol['uig_modificado'] = fechactual;
        rol['uig_estado'] = 'B';
        rol['uig_usuario_id'] = sessionService.get('IDUSUARIO');
         var resRol = {
            table_name:"_bp_usuarios_if_genesis",
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



    $scope.getIF = function(){
         
         console.log('IF');
        
        var resmacros = {
           "procedure_name":"usuariosif"
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resmacros)
        .success(function (response){
            $scope.ifs = response;
      //      console.log("esta es la respuesta:" + response);  
        })
        .error(function(error){
              $.unblockUI(); 
            $scope.errors["error_reg_localidad"]=error;
        });

    };
     $scope.genesis = function(){
         var resEnlaces = {
            "table_name":"GENERAL.Usuario"
        };
       var obj=DreamFactory.api[CONFIG.SERVICEGENESIS].getRecords(resEnlaces);
        obj.success(function (data) {
            $scope.genes=data.record;
        })
        obj.error(function(error) {
            defered.reject(error);
        });
    };
    $scope.getIF2 = function(){
         console.log('IF2');
        $.blockUI();
        var resmacros = {
           "procedure_name":"usuariolst"
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resmacros)
        .success(function (response){
            $scope.ifs = response;
            $.unblockUI();
        })
        .error(function(error){
              $.unblockUI(); 
            $scope.errors["error_reg_localidad"]=error;
        });

    };
    $scope.modificarRolCargar = function(rol){
        console.log(rol);
        $scope.only=false;
        $scope.datosRol=rol;
        $scope.boton="upd";
        $scope.titulo="Modificar Roles";
    };
    $scope.eliminarRolCargar = function(rol){
        $scope.only=true;
        $scope.datosRol=rol;
     //   console.log(rol,datosRol);
        $scope.boton="del";
        $scope.titulo="Eliminar Roles";
    };
    $scope.limpiar = function(){
        $scope.only=false;
        $scope.datosRol = '';
        $scope.boton="new";
        $scope.titulo="Registro de Roles";
		$scope.getIF();
    }; 
    $scope.$on('api:ready',function(){
        $scope.getRoles();
        $scope.getIF2();
        $scope.genesis();       
    });
    $scope.inicioRoles = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getRoles();
            $scope.getIF2();
            $scope.genesis();
            
        }
    }; 

});
