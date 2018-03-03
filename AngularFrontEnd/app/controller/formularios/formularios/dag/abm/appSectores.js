
app.controller('sectorController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.fecactu = function(){
        //$.blockUI();
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select distinct(dag_s_gestion) from dag.dag_dag_sectores"
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

    /*
    WHILE (fecha_inic <= fecha_fin){
      fecha_inic = fecha_inic + 1;
      print(fecha_inic);
    }
    listado de fechas
    ningun campo debe estar vacio

    | FECHASSS| |tipo cambio|=> 5 DECIMALES MAXIMO


            DIRECCION ADMINISTRATIVA
      label para identificas codigo da
      nombre de la da
      codigo de la gestion 
      cuando se selecciona una fecha anterior a la del 2017 debe bloquearse el boton de nueva DIRECCION
      en las gestiones anteriores no se debe poder editar informacion
    */




    /*$scope.getSectores2 = function(datoan){
      $scope.getSectores(datoan);
      $route.reload();
    }*/
    $scope.getSectores = function(datoan){
        var resGrupo = {
           function_name: "dag.sectorlst3",
           "body":{
               "params": [
                 {
                   "name": "dato",
                     "value": datoan
                 }
               ]
           }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resGrupo).success(function (response){
          console.log(response);
            $scope.obtSectores = response;
            var data = response;
            $scope.data2 = response;
            $scope.tablaGrupos = new ngTableParams({
                page: 1,
                count: 10,
                filter: {},
                sorting: {}
            }, {
                total: $scope.obtSectores.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtSectores, params.filter()):
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
    };
    $scope.adicionarSector = function(datosSector){
      var Sectores = {
             "procedure_name":"dag.sp_adicionar_sectores",
             "body":{
                 "params": [
                   {
                     "name": "sector_id",
                       "value": datosSector.idsctor
                   },
                     {
                       "name": "descripcion",
                         "value": datosSector.sctSctor
                     },
                     {
                       "name": "tipo",
                         "value": 'I'
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
      console.log(datosSector);
      var Sectores = {
             "procedure_name":"dag.sp_adicionar_sectores",
             "body":{
                 "params": [
                     {
                         "name": "sector_id",
                         "value": parseInt(datosSector.id_serial)
                     },
                     {
                       "name": "descripcion",
                         "value": datosSector.sctSctor
                     },
                     {
                       "name": "tipo",
                         "value": 'U'
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
      console.log(datosSector);
      var Sectores = {
             "procedure_name":"dag.sp_adicionar_sectores",
             "body":{
                 "params": [
                     {
                         "name": "sector_id",
                         "value": parseInt(datosSector.id_serial)
                     },
                     {
                       "name": "descripcion",
                         "value": ''
                     },
                     {
                       "name": "tipo",
                         "value": 'D'
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
      console.log("------->",datosGrupo);
        $scope.datosSector = datosGrupo;
        $scope.datosSector.idsctor = datosGrupo.dag;
        $scope.datosSector.sctSctor = datosGrupo.descripcion;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar Grupos";
    };
    $scope.eliminarGrupoCargar = function(datosGrupo){
      console.log(datosGrupo);
      $scope.datosSector= datosGrupo;
      $scope.datosSector.idsctor = datosGrupo.dag;
      $scope.datosSector.sctSctor = datosGrupo.descripcion;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Grupos";
    };
    $scope.limpiar = function(){
        $scope.datosSector='';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Sectores";
    };
    $scope.an = 2017;
    $scope.$on('api:ready',function(){
        $scope.getSectores($scope.an);
        $scope.fecactu();

    });
    $scope.inicioSector = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getSectores($scope.an);
            $scope.fecactu();
            //$.blockUI();
        }
    };
});
