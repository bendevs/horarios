app.controller('tecnicosController', function ($scope, CONFIG, DreamFactory,sessionService,$route,ngTableParams,$filter,sweet) {

    //**** listado usando procedimientos almacenados
    $scope.getEspaciosTrabajo = function(){
       var resNodo = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",
              "param_type":"IN","value":"select * from _bp_workspace "
            }]
          }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodo)
        .success(function (response) {
          console.log(response);
          $scope.espacios = JSON.parse(response[0].ejecutartojson);
          console.log($scope.espacios);
        //  $scope.nodos = JSON.parse(response[0].ejecutartojson);
        //  console.log($scope.nodos);
        }).error(function(error) {
          console.log("error");
        })
    };
    x = [];
    $scope.getTecnicosNuevos = function(dato){
       var resNodo = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select distinct(prs_id),usr_usuario,concat(prs_nombres,' ',prs_materno,' ',prs_paterno)as nombre from _bp_usuarios_workspace inner join _bp_usuarios on uw_usuario_id = usr_id inner join _bp_personas on usr_prs_id = prs_id  where uw_ws_id = '"+dato+"' order by nombre asc"
            }]
          }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodo)
        .success(function (response) {
          console.log(response);
          $scope.tecnicosnuevos = JSON.parse(response[0].ejecutartojson);
          console.log($scope.espacios);
        //  $scope.nodos = JSON.parse(response[0].ejecutartojson);
        //  console.log($scope.nodos);
        }).error(function(error) {
          console.log("error");
        })
    };
    $scope.getTecnicosNuevos1 = function(dato,usuario){
      $scope.datos.nuevos = "";
      $scope.datos.nuevos = null;
      $scope.datos.nuevos = '';
       var resNodo = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select distinct(prs_id),usr_usuario,concat(prs_nombres,' ',prs_materno,' ',prs_paterno)as nombre from _bp_usuarios_workspace inner join _bp_usuarios on uw_usuario_id = usr_id inner join _bp_personas on usr_prs_id = prs_id  where uw_ws_id = '"+dato+"' order by nombre asc"
            }]
          }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodo)
        .success(function (response) {
          console.log(response);
          $scope.tecnicosnuevos = JSON.parse(response[0].ejecutartojson);
          console.log($scope.espacios);
          $scope.tec_nicos = usuario.usr_usuario +"-"+usuario.tec_prs_id;
          setTimeout(function () {
                $scope.$apply(function () {
                  $scope.datos.nuevos = $scope.tec_nicos;
                  console.log($scope.datos.nuevos);

                  $scope.getNodos($scope.datos.nuevos);
                });
            }, 2000);

        //  $scope.nodos = JSON.parse(response[0].ejecutartojson);
        //  console.log($scope.nodos);
        }).error(function(error) {
          console.log("error");
        })
    };

    $scope.getTecnicos = function(data){
        //$.blockUI();
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",
              "param_type":"IN","value":"select tec_prs_id,usr_usuario,dag_ubm_tecnicos.nodo,dag_ubm_tecnicos.tec_id AS tec_id,dag_ubm_tecnicos.tipo as tipo,concat(_bp_personas.prs_nombres,' ',_bp_personas.prs_paterno,' ',_bp_personas.prs_materno) as tecnombre,ws ,CASE  WHEN dag_ubm_tecnicos.tec_estado='A' THEN 'ACTIVO'  WHEN dag_ubm_tecnicos.tec_estado='B' THEN 'INACTIVO' END AS tec_estado from dag.dag_ubm_tecnicos inner join public._bp_personas on tec_prs_id = prs_id inner join _bp_usuarios on usr_prs_id = prs_id"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          $scope.obtTecnicos = JSON.parse(response[0].ejecutartojson);
            var data = JSON.parse(response[0].ejecutartojson);
            console.log(data);
            $scope.tablaTecnicos = new ngTableParams({
                page: 1,
                count: 10,
                filter: {},
                sorting: {}
            }, {
                total: $scope.obtTecnicos.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtTecnicos, params.filter()) :
                    $scope.obtTecnicos;
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtTecnicos;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        })
        obj.error(function(error) {
        });
    };

    $scope.adicionarTecnicos = function(datosUsuario){
      console.log(datosUsuario);
      var resUsuario = {
        "procedure_name":"dag.abm_tecnicos",
        "body":{
          "params": [
          {
            "name":"id",
            "param_type":"IN",
            "value":0
          },
          {
            "name":"id_tecnico",
            "param_type":"IN",
            "value":parseInt(datosUsuario.id_tec)
          },
          {
            "name":"tipo_valor",
            "param_type":"IN",
            "value":parseInt(datosUsuario.tipo)
          },
          {
            "name":"nodo_valor",
            "param_type":"IN",
            "value":parseInt(datosUsuario.nodo)
          },
          {
            "name":"caso",
            "param_type":"IN",
            "value":"I"
          },
          {
            "name":"sw",
            "param_type":"IN",
            "value": parseInt(datosUsuario.espacios)
          }
        ]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
      obj.success(function(response){
        console.log(response);

        sweet.show('', 'Registro insertado', 'success');
        $route.reload();
        /*$scope.obtTecnicos = JSON.parse(response[0].ejecutartojson);
          var data = JSON.parse(response[0].ejecutartojson);
          console.log(data);*/
      })
      obj.error(function(error) {
        sweet.show('', 'Registro no insertado', 'error');
        $route.reload();
      });
    };

    $scope.modificarTecnicos = function(datos){
      console.log(datos);
      x = datos.nuevos.split('-');
      console.log(x);
        var resUsuario = {
          "procedure_name":"dag.abm_tecnicos",
          "body":{
            "params": [
            {
              "name":"id",
              "param_type":"IN",
              "value":parseInt(datos.tec_id)
            },
            {
              "name":"id_tecnico",
              "param_type":"IN",
              "value":parseInt(x[1])
            },
            {
              "name":"tipo_valor",
              "param_type":"IN",
              "value":parseInt(datos.tipo)
            },
            {
              "name":"nodo_valor",
              "param_type":"IN",
              "value":parseInt(datos.nodo)
            },
            {
              "name":"caso",
              "param_type":"IN",
              "value":"U"
            },
            {
              "name":"sw",
              "param_type":"IN",
              "value": parseInt(datos.espacios)
            }
          ]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);

          sweet.show('', 'Registro Modificado', 'success');
          $route.reload();
          /*$scope.obtTecnicos = JSON.parse(response[0].ejecutartojson);
            var data = JSON.parse(response[0].ejecutartojson);
            console.log(data);*/
        })
        obj.error(function(error) {
          sweet.show('', 'Registro no Modificado', 'error');
          $route.reload();
        });
    };


    $scope.eliminarTecnicos = function(datos){
        //$.blockUI();
        console.log(datos);
        x = datos.nuevos.split('-');
        console.log(x);
          var resUsuario = {
            "procedure_name":"dag.abm_tecnicos",
            "body":{
              "params": [
              {
                "name":"id",
                "param_type":"IN",
                "value":parseInt(datos.tec_id)
              },
              {
                "name":"id_tecnico",
                "param_type":"IN",
                "value":parseInt(x[1])
              },
              {
                "name":"tipo_valor",
                "param_type":"IN",
                "value":parseInt(datos.tipo)
              },
              {
                "name":"nodo_valor",
                "param_type":"IN",
                "value":parseInt(datos.nodo)
              },
              {
                "name":"caso",
                "param_type":"IN",
                "value":"D"
              },
              {
                "name":"sw",
                "param_type":"IN",
                "value": parseInt(datos.espacios)
              }
            ]
            }
          };
          var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
          obj.success(function(response){
            console.log(response);

            sweet.show('', 'Registro Eliminado', 'success');
            $route.reload();
            /*$scope.obtTecnicos = JSON.parse(response[0].ejecutartojson);
              var data = JSON.parse(response[0].ejecutartojson);
              console.log(data);*/
          })
          obj.error(function(error) {
            sweet.show('', 'Registro no Eliminado', 'error');
            $route.reload();
          });
    };

    $scope.limpiar = function(){
      $scope.datos = "";
        $scope.datosUsuario = '';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Tecnicos UBM";
    };
    $scope.modificarGrupoCargar = function(usuario){

      console.log(usuario);
        $scope.datos = usuario;
        $scope.datos.nuevos = "";
        console.log("===>>",$scope.datos.nuevos);
        $scope.datos.espacios = usuario.ws;
        $scope.getTecnicosNuevos1($scope.datos.espacios,usuario);
        $scope.datos.tipo = usuario.tipo;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar Técnicos";
    };

    $scope.eliminarGrupoCargar = function(usuario){
      console.log(usuario);
        $scope.datos = usuario;
        $scope.datos.nuevos = "";
        console.log("===>>",$scope.datos.nuevos);
        $scope.datos.espacios = usuario.ws;
        $scope.getTecnicosNuevos1($scope.datos.espacios,usuario);
        $scope.datos.tipo = usuario.tipo;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Técnicos";
    };

    $scope.getNodos = function(dato){
      console.log(dato);
      x = dato.split('-');
      console.log("este es el datos",x);
      console.log(x[0]);
      $scope.datos.id_tec = x[1];
      dato = dato.trim();
        var resNodo = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",
                "param_type":"IN","value":"select nodo_id,nodo_nombre from _bp_nodos_usuarios inner join ct_nodos on nu_nodo_id = nodo_id where nu_estado <> 'INACTIVO' and nu_usr_usuario like '"+x[0]+"'"
            }]
          }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodo)
        .success(function (response) {
            $scope.nodos = JSON.parse(response[0].ejecutartojson);
            console.log($scope.nodos);
        }).error(function(error) {
        });
    };
    //iniciando el controlador
    $scope.$on('api:ready',function(){
        //alert('gfhdg');
        $scope.getEspaciosTrabajo();
        $scope.getTecnicos();
    });
    $scope.inicioTecnicos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getTecnicos();
            $scope.getEspaciosTrabajo();
        }
    };
});
