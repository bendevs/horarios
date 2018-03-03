app.controller('unidadorganizacionalController', function ($scope, CONFIG, DreamFactory,sessionService,$route,ngTableParams,$filter,sweet) {

  $scope.datasector = function(){
      //$.blockUI();
      var resUsuario = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select dag_s_s,dag_s_descripcion from dag.dag_dag_sectores where dag_s_gestion = (to_char(now(), 'YYYY'::text))::integer "
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
      obj.success(function(response){
        $scope.sector = JSON.parse(response[0].ejecutartojson);

      })
      obj.error(function(error) {
          $scope.errors["error_usuario"] = error;
      });
  };

  $scope.cboadminist = function(sect){
    console.log(sect);
      //$.blockUI();
      var resUsuario = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select dag_da_da,dag_da_descripcion from dag.dag_dag_direccion_administrativa where dag_da_s = '" +parseInt(sect)+ "' and dag_da_gestion = (to_char(now(), 'YYYY'::text))::integer "
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
      obj.success(function(response){
        $scope.administ = JSON.parse(response[0].ejecutartojson);
          var data = JSON.parse(response[0].ejecutartojson);


      })
      obj.error(function(error) {
          $scope.errors["error_usuario"] = error;
      });
  };

  $scope.unidadejecutora2 = function(add){
      //$.blockUI();
      var resUsuario = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select dag_ue_ue,dag_ue_descripcion from dag.dag_dag_unidad_ejecutora where dag_ue_da = '"+ add +"' and dag_ue_estado = 'A'"
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
      obj.success(function(response){
        $scope.unidadejecutora = JSON.parse(response[0].ejecutartojson);
          var data = JSON.parse(response[0].ejecutartojson);


      })
      obj.error(function(error) {
          $scope.errors["error_usuario"] = error;
      });
  };

  $scope.adicionarunidad = function(dato){
      var resPartida = {
          "function_name":"dag.sp_insertarunidadorganizacional",
          "body":{
              "params": [
                  {
                      "name": "id_s",
                      "value": dato.secid
                  },
                  {
                      "name": "id_da",
                      "value": dato.ejecutora
                  },
                  {
                      "name": "cod_cod",
                      "value": dato.codej
                  },
                  {
                      "name": "descrip",
                      "value": dato.desceje
                  },
                  {
                      "name": "uni_eje",
                      "value": dato.adminis
                  }
              ]
          }

      };
      DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resPartida).success(function (response){
          sweet.show('', 'Registro Insertado correctamente', 'success');
          $route.reload();
      }).error(function(error) {
          sweet.show('', 'Registro No Insertado correctamente', 'warning');
          $scope.errors["error_rol"] = error;
      });
  }
  $scope.getUsuarios = function(){
      //$.blockUI();
      var resUsuario = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select * from dag.dag_dag_unidad_organizacional where dag_uo_estado = 'A'"
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
      obj.success(function(response){
        $scope.obtUsuarios = JSON.parse(response[0].ejecutartojson);
        console.log($scope.obtUsuarios);
          var data = JSON.parse(response[0].ejecutartojson);
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

  $scope.limpiar = function(){
      $scope.getPersonasUsuarios("new");
      $scope.datosUsuario = '';
      $scope.desabilitado=false;
      $scope.boton="new";
      $scope.titulo="Registro de Unidad";
  };
  $scope.modificarUsuarioCargar = function(usuario){
      $scope.getPersonasUsuarios("upd",usuario.dag_uo_id);
      $scope.datosUsuario=usuario;
      $scope.boton="upd";
      $scope.desabilitado=false;
      $scope.titulo="Modificar Usuarios";
  };
  $scope.eliminarUsuarioCargar = function(usuario){
      $scope.getPersonasUsuarios("upd",usuario.dag_uo_id);
      $scope.datosUsuario=usuario;
      $scope.desabilitado=true;
      $scope.boton="del";
      $scope.titulo="Eliminar Unidad";
  };


  $scope.modificareje = function(dato){
    console.log(dato);
      var resPartida = {
          "function_name":"dag.sp_modificarunidadorganizacional",
          "body":{
              "params": [
                  {
                      "name": "id",
                      "value": dato.dag_uo_id
                  },
                  {
                      "name": "id_s",
                      "value": dato.secid
                  },
                  {
                      "name": "id_da",
                      "value": dato.dag_uo_da
                  },
                  {
                      "name": "cod_cod",
                      "value": dato.codej
                  },
                  {
                      "name": "descrip",
                      "value": dato.desceje
                  },
                  {
                      "name": "uni_eje",
                      "value": dato.adminis
                  }
              ]
          }

      };
      DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resPartida).success(function (response){
        sweet.show('', 'Registro Modificado correctamente', 'success');
          $route.reload();
      }).error(function(error) {
        sweet.show('', 'Registro No Modificado correctamente', 'warning');
          $scope.errors["error_rol"] = error;
      });
  }
  $scope.eliminareje = function(dato){
      var resPartida = {
          "function_name":"dag.sp_eliminarunidadorganizacional",
          "body":{
              "params": [
                  {
                      "name": "id",
                      "value": dato.dag_uo_id
                  }
              ]
          }

      };
      DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resPartida).success(function (response){
        sweet.show('', 'Registro Eliminado correctamente', 'success');
          $route.reload();
      }).error(function(error) {
        sweet.show('', 'Registro No Eliminado correctamente', 'warning');


          $scope.errors["error_rol"] = error;
      });
  }

    //**** listado usando procedimientos almacenados
    $scope.getPersonasUsuarios = function(a,b){
        if(a=='new'){
            var resPersonasUsuarios = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select concat(prs_nombres,' ',prs_paterno,' ',prs_materno) as Prs,prs_id as idPrs from _bp_personas where prs_id not in ( select usr_prs_id from _bp_usuarios where usr_estado<>'B') and prs_estado<>'B' ORDER BY prs_id ASC"
            }]
          }
        };

        }
        else{
        var resPersonasUsuarios = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select * from dag.dag_dag_unidad_organizacional where dag_uo_id = "+b+""
            }]
          }
        };

        }
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resPersonasUsuarios)
        .success(function (response) {
            $scope.rep = JSON.parse(response[0].ejecutartojson);

            $scope.cboadminist($scope.rep[0].dag_uo_s);
            $scope.unidadejecutora2($scope.rep[0].dag_uo_da);
            $scope.datosUsuario.secid  = $scope.rep[0].dag_uo_s;
            setTimeout(function () {
                $scope.$apply(function () {
                  $scope.datosUsuario.secid  = $scope.rep[0].dag_uo_s;
                  $scope.datosUsuario.ejecutora  = $scope.rep[0].dag_uo_da;
                  $scope.datosUsuario.adminis  = $scope.rep[0].dag_uo_ue;
                  document.getElementById("ejecutora").value = $scope.rep[0].dag_uo_da;
                  document.getElementById("adminis").value = $scope.rep[0].dag_uo_ue;
                });
            }, 2000);

            $scope.datosUsuario.codej  = $scope.rep[0].dag_uo_uo;
            $scope.datosUsuario.desceje  = $scope.rep[0].dag_uo_descripcion;


        }).error(function(error) {
            $scope.errors["error_persona"] = error;
        });
    };








    //iniciando el controlador
    $scope.$on('api:ready',function(){
        //alert('gfhdg');
        $scope.getUsuarios();
        $scope.datasector();
    });
    $scope.inicioUnidad = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getUsuarios();
            $scope.datasector();

        }
    };
});
