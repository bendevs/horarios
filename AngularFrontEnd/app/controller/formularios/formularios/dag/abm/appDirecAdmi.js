
app.controller('daController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    var solofechactual =fecha.getFullYear();
    $scope.getSectores = function(){
        var resGrupo = {
           function_name: "dag.sectorlst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resGrupo).success(function (response){
          console.log("estos son los sectores",response);
            $scope.sector = response;

        },function(error) {
            $scope.errors["error"] = error;
        });
    };
    $scope.fecactu = function(){
        //$.blockUI();
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select distinct(dag_da_gestion) from dag.dag_dag_direccion_administrativa ORDER BY dag_da_gestion ASC"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){

          $scope.fecan = JSON.parse(response[0].ejecutartojson);

        })
        obj.error(function(error) {
            $scope.errors["error_usuario"] = error;
        });
    };
    $scope.getAdministracion = function(valor){
        //$.blockUI();
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select * from dag.dag_dag_direccion_administrativa where dag_da_gestion = "+valor+" "
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          $scope.obtUsuarios = JSON.parse(response[0].ejecutartojson);
            var data = JSON.parse(response[0].ejecutartojson);
            $scope.data2 = JSON.parse(response[0].ejecutartojson);
            $scope.tablaUsuarios = new ngTableParams({
                page: 1,
                count: 10,
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
            //$.unblockUI();
        })
        obj.error(function(error) {
            $scope.errors["error_usuario"] = error;
        });
    };

    /*$scope.getAdministracion = function(){


        var resGrupo = {
           function_name: "dag.dalst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resGrupo).success(function (response){
          console.log(response);
            $scope.obtSectores = response;
            //$.unblockUI(); //cerrar la mascara
            var data = response;
            $scope.tablaGrupos = new ngTableParams({
                page: 1,
                count: 10,
                filter: {},
                sorting: {}
            }, {
                total: $scope.obtSectores.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtSectores, params.filter()) :
                    $scope.obtSectores;
                    var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                $scope.obtSectores;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        },function(error) {
            $scope.errors["error"] = error;
        });
    };*/
    $scope.adicionarSector = function(datosSector){
      console.log("LKLL",datosSector);
      var Sectores = {
             "procedure_name":"dag.sp_adicionar_direcciones",
             "body":{
                 "params": [
                   {
                     "name": "sector_id",
                       "value":parseInt(datosSector.idsctor)
                   },
                   {
                     "name": "da_id",
                       "value":parseInt( datosSector.sector)
                   },
                     {
                       "name": "descripcion",
                         "value": datosSector.sctSctor
                     },
                     {
                       "name": "tipo",
                         "value": 'I'
                     },
                     {
                         "name": "id_da",
                         "value": 0
                     }
                 ]
             }
         };
         DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(Sectores).success(function (response){
             console.log("response==>",response);
             $route.reload();
             sweet.show('', 'Registro Insertado correctamente', 'success');

         })
         .error(function(data){
             sweet.show('', 'Error al cargar la informacion ', 'error');
         });
    };

    $scope.modificarSector = function(grpId,datosSector){
      console.log(grpId);
      console.log("------------->",datosSector);
      var Sectores = {
             "procedure_name":"dag.sp_adicionar_direcciones",
             "body":{
                 "params": [
                     {
                         "name": "sector_id",
                         "value": parseInt(datosSector.sector)
                     },
                     {
                         "name": "da_id_ubm",
                         "value": parseInt(datosSector.idsctor)
                     },

                     {
                       "name": "descripcion",
                         "value": datosSector.sctSctor
                     },

                     {
                       "name": "tipo",
                         "value": 'U'
                     },
                     {
                         "name": "id_da",
                         "value": parseInt(datosSector.dag_da_id)
                     }
                 ]
             }
         };
         DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(Sectores).success(function (response){
             console.log("response==>",response);
             $route.reload();
             sweet.show('', 'Registro Modificado correctamente', 'success');
         })
         .error(function(data){
             sweet.show('', 'Error al Modificar la informacion ', 'error');
         });
    };

    $scope.eliminarSector = function(grpId,datosSector){
      console.log(grpId);
      console.log(parseInt(grpId.idsctor));

      var Sectores = {
             "procedure_name":"dag.sp_adicionar_direcciones",
             "body":{
                 "params": [
                   {
                       "name": "sector_id",
                       "value": parseInt(datosSector.sector)
                   },
                   {
                       "name": "da_id_ubm",
                       "value": parseInt(datosSector.da_id)
                   },

                   {
                     "name": "descripcion",
                       "value": datosSector.sctSctor
                   },

                   {
                     "name": "tipo",
                       "value": 'D'
                   },
                   {
                       "name": "id_da",
                       "value": parseInt(datosSector.dag_da_id)
                   }
                 ]
             }
         };
         DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(Sectores).success(function (response){
             console.log("response==>",response);
             $route.reload();
             sweet.show('', 'Registro Eliminado correctamente', 'success');
         })
         .error(function(data){
             sweet.show('', 'Error al Eliminar la informacion ', 'error');
         });

    };
    $scope.modificarGrupoCargar = function(datosGrupo){ //grupo
      console.log(datosGrupo);

        $scope.datosSector = datosGrupo;
        $scope.datosSector.sector = datosGrupo.dag_da_s;
        $scope.datosSector.idsctor = datosGrupo.dag_da_da;
        $scope.datosSector.sctSctor = datosGrupo.dag_da_descripcion;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar Direcciones Administrativas";
    };
    $scope.eliminarGrupoCargar = function(datosGrupo){
      console.log(datosGrupo);
      $scope.datosSector= datosGrupo;
      $scope.datosSector.sector = datosGrupo.dag_da_s;
      $scope.datosSector.idsctor = datosGrupo.dag_da_da;
      $scope.datosSector.sctSctor = datosGrupo.dag_da_descripcion;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Direcciones Administrativas";
    };
    $scope.limpiar = function(){
        $scope.datosSector='';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Direcciones Administrativas";
    };
    $scope.$on('api:ready',function(){
        $scope.getAdministracion(solofechactual);
        $scope.getSectores ();
        $scope.fecactu();
    });
    $scope.inicioAdministracion = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getAdministracion(solofechactual);
            $scope.getSectores ();
            $scope.fecactu();
            //$.blockUI();
        }
    };
});
