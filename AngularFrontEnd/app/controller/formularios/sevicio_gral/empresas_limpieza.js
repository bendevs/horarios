app.controller('empresaController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
      //listar roles
    $scope.getEmpresas = function(){
        //$.blockUI();
        var resEmpresas = {
            "procedure_name":"emplst"
        };
        //servicio listar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resEmpresas);
        obj.success(function (response) {
            $scope.obtEmpresas = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaEmpresas = new ngTableParams({
                page: 1,          
                count: 10,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtEmpresas.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtEmpresas, params.filter()) :
                    $scope.obtEmpresas;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtEmpresas;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 
            //$.unblockUI();            
        });
        obj.error(function(error) {
            
            $scope.errors["error empresas"] = error; 

        });    

    };
    $scope.adicionarEmpresa = function(datosEmpresa){
        //$.blockUI();
        var empresa = {};
        empresa['empresa_nombre'] = datosEmpresa.nombre;
        empresa['empresa_direccion'] = datosEmpresa.dir;
        empresa['empresa_tel'] = datosEmpresa.tel;
        empresa['empresa_cel'] = datosEmpresa.cel;
        empresa['empresa_correo'] = datosEmpresa.correo;
        empresa['empresa_registrado'] = fechactual;
        empresa['empresa_modificado'] = fechactual;
        empresa['empresa_estado'] = 'A';
        var resEmpresas = {
            table_name:"usg.empresas",
            body:empresa
        };
        
        //servicio insertar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resEmpresas);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
            //handleRoles($scope.conexion.getListSP('roleslst',{}), 'post');
            $route.reload();
        })
        .error(function(data){
            console.log(data);
            sweet.show('', 'Registro no insertado', 'error');
        })

    };

    $scope.modificarEmpresa = function(empresaId,datosEmpresa){
       // $.blockUI();
        var empresa = {};
        empresa['empresa_nombre'] = datosEmpresa.nombre;
        empresa['empresa_direccion'] = datosEmpresa.dir;
        empresa['empresa_tel'] = datosEmpresa.tel;
        empresa['empresa_cel'] = datosEmpresa.cel;
        empresa['empresa_correo'] = datosEmpresa.correo;
        empresa['empresa_modificado'] = fechactual;
        //rol['rls_usr_id'] = sessionService.get('IDUSUARIO');
        //handleRoles($scope.conexion.update(rolId,rol), 'update');
        var resEmpresas = {
            table_name:"usg.empresas",
            id:empresaId,
            body:empresa
        };
        //servicio modificar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resEmpresas);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro modificado', 'success');
         
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
        //$route.reload();
    };
    $scope.eliminarEmpresa = function(empresaId){
        //$.blockUI();
        var empresa = {};
       empresa['empresa_modificado'] = fechactual;
        empresa['empresa_estado'] = 'B';
        //rol['rls_usr_id'] = sessionService.get('IDUSUARIO');
         var resEmpresas = {
            table_name:"usg.empresas",
            id:empresaId,
            body:empresa
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resEmpresas);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 
    $scope.modificarEmpresaCargar = function(empresa){
        $scope.only=false;
        $scope.datosEmpresa=empresa;
        $scope.boton="upd";
        $scope.titulo="Modificar Empresas";
    };
    $scope.eliminarEmpresaCargar = function(empresa){
        $scope.only=true;
        $scope.datosEmpresa=empresa;
        $scope.boton="del";
        $scope.titulo="Eliminar Empresas";
    };
    $scope.limpiar = function(){
        $scope.only=false;
        $scope.datosEmpresa = '';
        $scope.boton="new";
        $scope.titulo="Registro de Empresas";
    }; 
    $scope.$on('api:ready',function(){
        $scope.getEmpresas();       
    });
    $scope.inicioEmpresas = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getEmpresas();          
        }
    }; 

});