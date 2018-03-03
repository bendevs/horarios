
app.controller('gruposController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.getGrupos = function(){
        var resGrupo = {
           function_name: "gruposlst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resGrupo).success(function (response){
            $scope.obtGrupos = response;
            //$.unblockUI(); //cerrar la mascara
            var data = response; 
            $scope.tablaGrupos = new ngTableParams({
                page: 1,          
                count: 10,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtGrupos.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtGrupos, params.filter()) :
                    $scope.obtGrupos;              
                    var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                $scope.obtGrupos;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            });              
        },function(error) {
            $scope.errors["error"] = error;            
        });        
    };
    $scope.adicionarGrupo = function(datosGrupo){
        var grupo = {};
        //$.blockUI();  
        grupo['grp_grupo'] = datosGrupo.grpGrupo;
        grupo['grp_registrado'] = fechactual;
        grupo['grp_modificado'] = fechactual;
        grupo['grp_usr_id'] = sessionService.get('IDUSUARIO');
        var resGrupo = {"table_name":"_bp_grupos",
                        "body":grupo};      
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resGrupo);
        obj.success(function(data){ 
            sweet.show('', 'Registro insertado', 'success');
            //$.unblockUI();    
            $route.reload();      
        })
        obj.error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
        
    };
    $scope.modificarGrupo = function(grpId,datosGrupo){
        var grupo = {};
        //$.blockUI();  
        grupo['grp_grupo'] = datosGrupo.grpGrupo;
        grupo['grp_modificado'] = fechactual;
        grupo['grp_usr_id'] = sessionService.get('IDUSUARIO');
        var resGrupo = {"table_name":"_bp_grupos", 
                        "body":grupo,
                        "id" : grpId}; 
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resGrupo);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            //$.unblockUI();
            $route.reload();
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })   
    };

    $scope.eliminarGrupo = function(grpId){
        var grupo = {};
        //$.blockUI();
        grupo['grp_modificado'] = fechactual;
        grupo['grp_estado'] = 'B';
        grupo['grp_usr_id'] = sessionService.get('IDUSUARIO');
        var resGrupo = {"table_name":"_bp_grupos", 
                        "body":grupo,
                        "id" : grpId}; 
       var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resGrupo);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            //$.unblockUI(); 
            $route.reload();        
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };
    $scope.modificarGrupoCargar = function(datosGrupo){   //grupo
        $scope.datosGrupo = datosGrupo;   //datosGrupo
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar Grupos";
    };
    $scope.eliminarGrupoCargar = function(datosGrupo){
        $scope.datosGrupo= datosGrupo;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Grupos";
    };
    $scope.limpiar = function(){
        $scope.datosGrupo='';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Grupos";
    };
    $scope.$on('api:ready',function(){            
        $scope.getGrupos();

    });
    $scope.inicioGrupos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getGrupos();
            //$.blockUI();
        }
    };       
});