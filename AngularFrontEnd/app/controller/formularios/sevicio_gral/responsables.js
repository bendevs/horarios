app.controller('responsableController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
      //listar roles
    $scope.getResponsables = function(){
        //$.blockUI();
        var resResponsables = {
            "procedure_name":"replst"
        };
        //servicio listar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resResponsables);
        obj.success(function (response) {
            $scope.obtResponsables = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaResponsables = new ngTableParams({
                page: 1,          
                count: 10,
                filter: {},
                sorting: {}      
            }, 
            {
                total: $scope.obtResponsables.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtResponsables, params.filter()) :
                    $scope.obtResponsables;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtResponsables;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            }); 
            //$.unblockUI();            
        });
        obj.error(function(error) {


            $scope.errors["error responsables"] = error; 

            
        });    

    };
   $scope.adicionarResponsable = function(datosResponsable){
        //$.blockUI();
        var responsable = {};
        responsable['responsable_paterno'] = datosResponsable.paterno;
        responsable['responsable_materno'] = datosResponsable.materno;
        responsable['responsable_nombres'] = datosResponsable.nombres;
        responsable['responsable_direccion'] = datosResponsable.dir;
        responsable['responsable_tel'] = datosResponsable.tel;
        responsable['responsable_cel'] = datosResponsable.cel;
        responsable['responsable_correo'] = datosResponsable.correo;
        responsable['responsable_registrado'] = fechactual;
        responsable['responsable_modificado'] = fechactual;
        responsable['responsable_estado'] = 'A';
        var resResponsables = {
            table_name:"usg.responsables",
            body:responsable
        };
        
        //servicio insertar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resResponsables);
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

    $scope.modificarResponsable = function(responsableId,datosResponsable){
       // $.blockUI();
        var responsable = {};
        responsable['responsable_paterno'] = datosResponsable.paterno;
        responsable['responsable_materno'] = datosResponsable.materno;
        responsable['responsable_nombres'] = datosResponsable.nombres;
        responsable['responsable_direccion'] = datosResponsable.dir;
        responsable['responsable_tel'] = datosResponsable.tel;
        responsable['responsable_cel'] = datosResponsable.cel;
        responsable['responsable_correo'] = datosResponsable.correo;  
        responsable['responsable_modificado'] = fechactual;      //rol['rls_usr_id'] = sessionService.get('IDUSUARIO');
        //handleRoles($scope.conexion.update(rolId,rol), 'update');
        var resResponsables = {
            table_name:"usg.responsables",
            id:responsableId,
            body:responsable
        };
        //servicio modificar roles
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resResponsables);
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
    $scope.eliminarResponsable = function(responsableId){
        //$.blockUI();
        var responsable = {};
       responsable['responsable_modificado'] = fechactual;
        responsable['responsable_estado'] = 'B';
        //rol['rls_usr_id'] = sessionService.get('IDUSUARIO');
         var resResponsables = {
            table_name:"usg.responsables",
            id:responsableId,
            body:responsable
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resResponsables);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 
    $scope.modificarResponsableCargar = function(responsable){
        $scope.only=false;
        $scope.datosResponsable=responsable;
        $scope.boton="upd";
        $scope.titulo="Modificar Responsables";
    };
    $scope.eliminarResponsableCargar = function(responsable){
        $scope.only=true;
        $scope.datosResponsable=responsable;
        $scope.boton="del";
        $scope.titulo="Eliminar Responsables";
    };
    $scope.limpiar = function(){
        $scope.only=false;
        $scope.datosResponsable = '';
        $scope.boton="new";
        $scope.titulo="Registro de Responsables";
    }; 
    $scope.$on('api:ready',function(){
        $scope.getResponsables();       
    });
    $scope.inicioResponsables = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getResponsables();          
        }
    }; 

});