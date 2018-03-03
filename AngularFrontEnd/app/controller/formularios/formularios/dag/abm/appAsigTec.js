app.controller('asignacionController', function ($scope, $q,CONFIG, DreamFactory,sessionService,$route,ngTableParams,$filter,sweet,$rootScope) {

    //fechas
    $scope.modelFecha1 = {
          startDate: new Date('09/21/2015'),
          endDate: new Date()
      };

    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };

    $scope.startDateOpen2 = function($event) {
           $event.preventDefault();
           $event.stopPropagation();
           $scope.startDateOpened2 = true;
           $scope.modelFecha = {
                 startDate: new Date('09/21/2015'),
                 endDate: new Date($scope.datos.UBM_FEC_INICIO_RECEPCION)
             };
    };

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

    $scope.getDireccionesAdministrativas = function(dato){
      $scope[name] = 'Running';
      var deferred = $q.defer();
      $scope.exito = "SI";
      var resUsuario = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select * from dag.dag_dag_direccion_administrativa where dag_da_gestion = extract('year' from now()) and dag_da_s = '"+parseInt(dato)+"'"
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
      obj.success(function(response){

        $scope.direcciones = JSON.parse(response[0].ejecutartojson);
        console.log($scope.direcciones);
        $q.all($scope.exito).then(function(data){
             deferred.resolve($scope.exito);
         });
      })
      obj.error(function(error) {
          $scope.errors["error_usuario"] = error;
          $scope.exito = "NO";
          $q.all($scope.exito).then(function(data){
               deferred.resolve($scope.exito);
           });
      });
  };

  $scope.getUnidadEjecutora = function(valor1,valor2){
    var resUsuario = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
        {
          "name":"expression",

          "param_type":"IN","value":"select * from dag.dag_dag_unidad_ejecutora where dag_ue_gestion = extract('year' from now())::smallint and dag_ue_s = '"+parseInt(valor1)+"' and dag_ue_da = '"+parseInt(valor2)+"'"
        }]
      }
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
    obj.success(function(response){

      $scope.ejecutoras = JSON.parse(response[0].ejecutartojson);
      console.log($scope.ejecutoras);
    })
    obj.error(function(error) {
        $scope.errors["error_usuario"] = error;
    });
};

$scope.getUnidadOrganizacional = function(valor1,valor2,valor3){
  var resUsuario = {
    "procedure_name":"ejecutartojson",
    "body":{
      "params": [
      {
        "name":"expression",

        "param_type":"IN","value":"select * from dag.dag_dag_unidad_organizacional where dag_uo_gestion = extract('year' from now())::smallint and dag_uo_s = '"+valor1+"' and dag_uo_da = '"+valor2+"' and dag_uo_ue = '"+valor3+"'"
      }]
    }
  };
  var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
  obj.success(function(response){

    $scope.unidades = JSON.parse(response[0].ejecutartojson);
    console.log($scope.unidades);
  })
  obj.error(function(error) {
      $scope.errors["error_usuario"] = error;
  });
};

$scope.getTecnicosasignar = function(){
  var resUsuario = {
    "procedure_name":"ejecutartojson",
    "body":{
      "params": [
      {
        "name":"expression",

        "param_type":"IN","value":"select *, concat(prs_nombres,' ',prs_paterno,' ',prs_materno) as nombres from dag.dag_ubm_tecnicos inner join public._bp_personas on prs_id = tec_prs_id"
      }]
    }
  };
  var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
  obj.success(function(response){

    $scope.Tecnicosasignados = JSON.parse(response[0].ejecutartojson);
    console.log("TECNICOS",$scope.Tecnicosasignados);
  })
  obj.error(function(error) {
      $scope.errors["error_usuario"] = error;
  });

  var resUsuario = {
    "procedure_name":"ejecutartojson",
    "body":{
      "params": [
      {
        "name":"expression",

        "param_type":"IN","value":"select * from ct_nodos where nodo_nombre like '%ANALISTA PRESUPUESTARIO%'"
      }]
    }
  };
  var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
  obj.success(function(response){

    $scope.analistas = JSON.parse(response[0].ejecutartojson);
    console.log($scope.analistas);
  })
  obj.error(function(error) {
      $scope.errors["error_usuario"] = error;
  });
};



    $scope.datasector = function(){
      var deferred = $q.defer();
      $scope[name] = 'Running';
       $scope.exito = "SI";
        //$.blockUI();
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select * from dag.dag_dag_sectores where dag_s_gestion = extract('year' from now())::integer and dag_s_estado <> 'B'"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){

          $scope.sector = JSON.parse(response[0].ejecutartojson);
          console.log($scope.sector);
          $q.all($scope.exito).then(function(data){
               deferred.resolve($scope.exito);
           });
        })
        obj.error(function(error) {
            $scope.errors["error_usuario"] = error;
            $scope.exito = "NO";
            $q.all($scope.exito).then(function(data){
                 deferred.resolve($scope.exito);
             });
        });
        return deferred.promise;
    };

    x = [];


    $scope.getAsigTecnicos = function(data){
        //$.blockUI();
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",
              "param_type":"IN","value":"select *,concat(prs_paterno,' ',prs_materno,' ',prs_nombres) as nombre from dag.dag_ubm_asignacion_tecnico inner join dag.dag_ubm_tecnicos on asig_tec_id = tec_id inner join public._bp_personas on tec_prs_id = prs_id and asig_estado = 'A' order by  asig_id "
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

    $scope.adicionarAsignacion = function(datosUsuario){
      console.log(datosUsuario);
      $scope.fechadel = datosUsuario.fecha_inicio;
      var fec0 = $scope.fechadel;
      var fecnac = new Date(fec0);
      var mes = fecnac.getMonth() + 1;
        var dia = fecnac.getDate()
        if(fecnac.getDate()<10){
          dia = "0"+ dia;
        }
        if(fecnac.getMonth()<9){
          mes = "0"+ mes;
        }
        var validadorFichas = false;
      $scope.fechadel  = fecnac.getFullYear()+"-"+mes+"-"+dia;
      console.log("************1",$scope.fechadel);
      $scope.fechadal = datosUsuario.fecha_fin;
      var fec0 = $scope.fechadal;
      var fecnac = new Date(fec0);
      var mes = fecnac.getMonth() + 1;
        var dia = fecnac.getDate()
        if(fecnac.getDate()<10){
          dia = "0"+ dia;
        }
        if(fecnac.getMonth()<9){
          mes = "0"+ mes;
        }
        var validadorFichas = false;
      $scope.fechadal  = fecnac.getFullYear()+"-"+mes+"-"+dia;
      console.log("************2",$scope.fechadal);
      if(datosUsuario.tipo == 1){
        var resUsuario = {
          "procedure_name":"dag.abm_tecnicos_asignados",
          "body":{
            "params": [
            {
              "name":"id_valor",
              "param_type":"IN",
              "value":0
            },
            {
              "name":"sector_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.sector)
            },
            {
              "name":"direcciones_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.da)
            },
            {
              "name":"ejecutora_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.ue)
            },
            {
              "name":"organizacional_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.uo)
            },
            {
              "name":"tecnico",
              "param_type":"IN",
              "value":parseInt(datosUsuario.tecnicoasignado)
            },
            {
              "name":"fecha_inicio_valor",
              "param_type":"IN",
              "value":$scope.fechadel
            },
            {
              "name":"fecha_fin_valor",
              "param_type":"IN",
              "value":$scope.fechadal
            },
            {
              "name":"nodo_valor",
              "param_type":"IN",
              "value": null
            },
            {
              "name":"tipo_asignacion_valor",
              "param_type":"IN",
              "value": $scope.datos.tipo_tecnico
            },
            {
              "name":"caso",
              "param_type":"IN",
              "value":"I"
            }
          ]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          sweet.show('', 'Registro insertado', 'success');
          $route.reload();
        })
        obj.error(function(error) {
          sweet.show('', 'Registro no insertado', 'error');
          $route.reload();
        });
      }
      if(datosUsuario.tipo == 2){
        var resUsuario = {
          "procedure_name":"dag.abm_tecnicos_asignados",
          "body":{
            "params": [
            {
              "name":"id_valor",
              "param_type":"IN",
              "value":0
            },
            {
              "name":"sector_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.sector)
            },
            {
              "name":"direcciones_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.da)
            },
            {
              "name":"ejecutora_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.ue)
            },
            {
              "name":"organizacional_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.uo)
            },
            {
              "name":"tecnico",
              "param_type":"IN",
              "value":parseInt(datosUsuario.tecnicoasignado)
            },
            {
              "name":"fecha_inicio_valor",
              "param_type":"IN",
              "value":$scope.fechadel
            },
            {
              "name":"fecha_fin_valor",
              "param_type":"IN",
              "value":$scope.fechadal
            },
            {
              "name":"nodo_valor",
              "param_type":"IN",
              "value": datosUsuario.nodo
            },
            {
              "name":"tipo_asignacion_valor",
              "param_type":"IN",
              "value": $scope.datos.tipo_tecnico
            },
            {
              "name":"caso",
              "param_type":"IN",
              "value":"I"
            }
          ]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          sweet.show('', 'Registro insertado', 'success');
          $route.reload();
        })
        obj.error(function(error) {
          sweet.show('', 'Registro no insertado', 'error');
          $route.reload();
        });
      }
      if(datosUsuario.tipo == 3){
        var resUsuario = {
          "procedure_name":"dag.abm_tecnicos_asignados",
          "body":{
            "params": [
            {
              "name":"id_valor",
              "param_type":"IN",
              "value":0
            },
            {
              "name":"sector_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.sector)
            },
            {
              "name":"direcciones_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.da)
            },
            {
              "name":"ejecutora_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.ue)
            },
            {
              "name":"organizacional_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.uo)
            },
            {
              "name":"tecnico",
              "param_type":"IN",
              "value":parseInt(datosUsuario.tecnicoasignado)
            },
            {
              "name":"fecha_inicio_valor",
              "param_type":"IN",
              "value":$scope.fechadel
            },
            {
              "name":"fecha_fin_valor",
              "param_type":"IN",
              "value":$scope.fechadal
            },
            {
              "name":"nodo_valor",
              "param_type":"IN",
              "value": datosUsuario.analista
            },
            {
              "name":"tipo_asignacion_valor",
              "param_type":"IN",
              "value": $scope.datos.tipo_tecnico
            },
            {
              "name":"caso",
              "param_type":"IN",
              "value":"I"
            }
          ]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          sweet.show('', 'Registro insertado', 'success');
          $route.reload();
        })
        obj.error(function(error) {
          sweet.show('', 'Registro no insertado', 'error');
          $route.reload();
        });
      }
      if(datosUsuario.tipo == 4){
        var resUsuario = {
          "procedure_name":"dag.abm_tecnicos_asignados",
          "body":{
            "params": [
            {
              "name":"id_valor",
              "param_type":"IN",
              "value":0
            },
            {
              "name":"sector_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.sector)
            },
            {
              "name":"direcciones_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.da)
            },
            {
              "name":"ejecutora_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.ue)
            },
            {
              "name":"organizacional_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.uo)
            },
            {
              "name":"tecnico",
              "param_type":"IN",
              "value":parseInt(datosUsuario.nodo)
            },
            {
              "name":"fecha_inicio_valor",
              "param_type":"IN",
              "value":$scope.fechadel
            },
            {
              "name":"fecha_fin_valor",
              "param_type":"IN",
              "value":$scope.fechadal
            },
            {
              "name":"nodo_valor",
              "param_type":"IN",
              "value": 7600
            },
            {
              "name":"tipo_asignacion_valor",
              "param_type":"IN",
              "value": $scope.datos.tipo_tecnico
            },
            {
              "name":"caso",
              "param_type":"IN",
              "value":"I"
            }
          ]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          sweet.show('', 'Registro insertado', 'success');
          $route.reload();
        })
        obj.error(function(error) {
          sweet.show('', 'Registro no insertado', 'error');
          $route.reload();
        });
      }
    };

    $scope.modificarAsignacion = function(datosUsuario){
      console.log(datosUsuario);
      console.log(datosUsuario.fecha_fin);
      $scope.fechadel = datosUsuario.fecha_inicio;
      var fec0 = $scope.fechadel;
      var fecnac = new Date(fec0);
      var mes = fecnac.getMonth() + 1;
        var dia = fecnac.getDate()
        if(fecnac.getDate()<10){
          dia = "0"+ dia;
        }
        if(fecnac.getMonth()<9){
          mes = "0"+ mes;
        }
        var validadorFichas = false;
      $scope.fechadel  = fecnac.getFullYear()+"-"+mes+"-"+dia;
      console.log("************1",$scope.fechadel);
      $scope.fechadal = datosUsuario.fecha_fin;
      var fec0 = $scope.fechadal;
      var fecnac = new Date(fec0);
      var mes = fecnac.getMonth() + 1;
        var dia = fecnac.getDate()
        if(fecnac.getDate()<10){
          dia = "0"+ dia;
        }
        if(fecnac.getMonth()<9){
          mes = "0"+ mes;
        }
        var validadorFichas = false;
      $scope.fechadal  = fecnac.getFullYear()+"-"+mes+"-"+dia;
      console.log("************2",$scope.fechadal);
      var resUsuario = {
        "procedure_name":"dag.abm_tecnicos_asignados",
        "body":{
          "params": [
          {
            "name":"id_valor",
            "param_type":"IN",
            "value":datosUsuario.asig_id
          },
          {
            "name":"sector_valor",
            "param_type":"IN",
            "value":parseInt(datosUsuario.sector)
          },
          {
            "name":"direcciones_valor",
            "param_type":"IN",
            "value":parseInt(datosUsuario.da)
          },
          {
            "name":"ejecutora_valor",
            "param_type":"IN",
            "value":parseInt(datosUsuario.ue)
          },
          {
            "name":"organizacional_valor",
            "param_type":"IN",
            "value":parseInt(datosUsuario.uo)
          },
          {
            "name":"tecnico",
            "param_type":"IN",
            "value":parseInt(datosUsuario.tec_id)
          },
          {
            "name":"fecha_inicio_valor",
            "param_type":"IN",
            "value":$scope.fechadel
          },
          {
            "name":"fecha_fin_valor",
            "param_type":"IN",
            "value":$scope.fechadal
          },
          {
            "name":"nodo_valor",
            "param_type":"IN",
            "value": datosUsuario.analista
          },
          {
            "name":"tipo_asignacion_valor",
            "param_type":"IN",
            "value": $scope.datos.tipo_tecnico
          },
          {
            "name":"caso",
            "param_type":"IN",
            "value":"U"
          }
        ]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
      obj.success(function(response){
        console.log(response);
        sweet.show('', 'Registro insertado', 'success');
        $route.reload();
      })
      obj.error(function(error) {
        sweet.show('', 'Registro no insertado', 'error');
        $route.reload();
      });
    };


    $scope.eliminarTecnicos = function(datosUsuario){
        //$.blockUI();
        console.log(datosUsuario);
        var resUsuario = {
          "procedure_name":"dag.abm_tecnicos_asignados",
          "body":{
            "params": [
            {
              "name":"id_valor",
              "param_type":"IN",
              "value":datosUsuario.asig_id
            },
            {
              "name":"sector_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.sector)
            },
            {
              "name":"direcciones_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.da)
            },
            {
              "name":"ejecutora_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.ue)
            },
            {
              "name":"organizacional_valor",
              "param_type":"IN",
              "value":parseInt(datosUsuario.uo)
            },
            {
              "name":"tecnico",
              "param_type":"IN",
              "value":parseInt(datosUsuario.tec_id)
            },
            {
              "name":"fecha_inicio_valor",
              "param_type":"IN",
              "value":$scope.fechadel
            },
            {
              "name":"fecha_fin_valor",
              "param_type":"IN",
              "value":$scope.fechadal
            },
            {
              "name":"nodo_valor",
              "param_type":"IN",
              "value": datosUsuario.analista
            },
            {
              "name":"tipo_asignacion_valor",
              "param_type":"IN",
              "value": $scope.datos.tipo_tecnico
            },
            {
              "name":"caso",
              "param_type":"IN",
              "value":"D"
            }
          ]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          sweet.show('', 'Registro insertado', 'success');
          $route.reload();
        })
        obj.error(function(error) {
          sweet.show('', 'Registro no insertado', 'error');
          $route.reload();
        });
    };

    $scope.limpiar = function(){
      $scope.datos = "";
        $scope.datosUsuario = '';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Asignación";
    };
    $scope.limpiardata = function(){
      console.log("limpiar data");
      $scope.datos = " ";
      $scope.datos.tecnicoasignado = " ";
      $scope.datos.analista = " ";
      /*$scope.datos.sector = null;
      $scope.datos.da = null;
      $scope.datos.ue = null;
      $scope.datos.uo = null;
      $scope.datos.tecnicoasignado = null;
      $scope.datos.analista = null;*/
    }
    $scope.modificardata = function(usuario){
      $scope.datos = " ";
      $scope.getTecnicosasignar();
      setTimeout(function () {
          $scope.$apply(function () {
            if(usuario.tipo_asignacion == 3 ){
              $scope.valor = true;
            }
            else {
              $scope.valor = false;
            }
          });
      }, 2000);

        console.log(usuario);
        $scope.datos = usuario;
        $scope.datos.sector = usuario.dag_uo_s;
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select * from dag.dag_dag_direccion_administrativa where dag_da_gestion = extract('year' from now()) and dag_da_s = '"+parseInt(usuario.dag_uo_s)+"'"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){

          $scope.direcciones = JSON.parse(response[0].ejecutartojson);
          var resUsuario = {
            "procedure_name":"ejecutartojson",
            "body":{
              "params": [
              {
                "name":"expression",

                "param_type":"IN","value":"select * from dag.dag_dag_unidad_ejecutora where dag_ue_gestion = extract('year' from now())::smallint and dag_ue_s = '"+parseInt(usuario.dag_uo_s)+"' and dag_ue_da = '"+parseInt(usuario.dag_uo_da)+"'"
              }]
            }
          };
          var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
          obj.success(function(response){

            $scope.ejecutoras = JSON.parse(response[0].ejecutartojson);
            console.log($scope.ejecutoras);
            var resUsuario = {
              "procedure_name":"ejecutartojson",
              "body":{
                "params": [
                {
                  "name":"expression",

                  "param_type":"IN","value":"select * from dag.dag_dag_unidad_organizacional where dag_uo_gestion = extract('year' from now())::smallint and dag_uo_s = '"+parseInt(usuario.dag_uo_s)+"' and dag_uo_da = '"+parseInt(usuario.dag_uo_da)+"' and dag_uo_ue = '"+parseInt(usuario.dag_uo_ue)+"'"
                }]
              }
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
            obj.success(function(response){

              $scope.unidades = JSON.parse(response[0].ejecutartojson);

              setTimeout(function () {
                  $scope.$apply(function () {
                    $scope.datos.da = usuario.dag_uo_da;
                    $scope.datos.ue = usuario.dag_uo_ue;
                    $scope.datos.uo = usuario.dag_uo_uo;
                   document.getElementById("da").value = usuario.dag_uo_da;
                   document.getElementById("ue").value = usuario.dag_uo_ue;
                   document.getElementById("uo").value = usuario.dag_uo_uo;
                   document.getElementById("analista").value = usuario.asig_rpc;
                   document.getElementById("tecnicoasignado").value = usuario.asig_tec_id;
                   $scope.datos.analista = usuario.asig_rpc;
                   $scope.datos.tecnicoasignado = usuario.asig_tec_id;
                  });
              }, 1000);
              console.log($scope.unidades);
            })
            obj.error(function(error) {
                $scope.errors["error_usuario"] = error;
            });
          })
          obj.error(function(error) {
              $scope.errors["error_usuario"] = error;
          });

        })
        obj.error(function(error) {
            $scope.errors["error_usuario"] = error;

        });
        $scope.datos.fecha_inicio = usuario.asig_fecha_inicio;
        $scope.datos.fecha_fin = usuario.asig_fecha_fin;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar Asignación";
    };

    $scope.cargarTecnicos = function (tipo){
      if (tipo == 1 || tipo == 4){
        $scope.valor = false;
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select *, concat(prs_nombres,' ',prs_paterno,' ',prs_materno) as nombres from dag.dag_ubm_tecnicos inner join public._bp_personas on prs_id = tec_prs_id where tipo = '"+tipo+"'"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          $scope.Tecnicosasignados = JSON.parse(response[0].ejecutartojson);
          console.log($scope.Tecnicosasignados);
        })
        obj.error(function(error) {
            $scope.errors["error_usuario"] = error;
        });
      }
      if(tipo == 2){
        $scope.valor = false;
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select *,concat(prs_nombres,' ',prs_paterno,' ',prs_materno) as nombres from dag.dag_ubm_tecnicos inner join public._bp_personas on prs_id = tec_prs_id where tipo = 2 or tipo = 3"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          $scope.Tecnicosasignados = JSON.parse(response[0].ejecutartojson);
          console.log($scope.Tecnicosasignados);
        })
        obj.error(function(error) {
            $scope.errors["error_usuario"] = error;
        });
      }
      if(tipo == 3){
        $scope.getTecnicosasignar();
        $scope.valor = true;
      }

    }
    $scope.datosTecnicos = function(datos){
      console.log("datos del tecnico",datos);
      for (var i = 0; i < datos.length; i++) {
        if(datos[i].tec_id == $scope.datos.tecnicoasignado){
          console.log(datos[i]);
            console.log("este es su nodo",datos[i].nodo);
            $scope.datos.nodo = datos[i].nodo;
            $scope.datos.tipo_tecnico = parseInt(datos[i].tipo);
        }
      }
    }

    $scope.eliminarGrupoCargar = function(usuario){
      $scope.datos = " ";
      $scope.getTecnicosasignar();
      setTimeout(function () {
          $scope.$apply(function () {
            if(usuario.tipo_asignacion == 3 ){
              $scope.valor = true;
            }
            else {
              $scope.valor = false;
            }
          });
      }, 2000);

        console.log(usuario);
        $scope.datos = usuario;
        $scope.datos.sector = usuario.dag_uo_s;
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",
              "param_type":"IN","value":"select * from dag.dag_dag_direccion_administrativa where dag_da_gestion = extract('year' from now()) and dag_da_s = '"+parseInt(usuario.dag_uo_s)+"'"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){

          $scope.direcciones = JSON.parse(response[0].ejecutartojson);
          var resUsuario = {
            "procedure_name":"ejecutartojson",
            "body":{
              "params": [
              {
                "name":"expression",

                "param_type":"IN","value":"select * from dag.dag_dag_unidad_ejecutora where dag_ue_gestion = extract('year' from now())::smallint and dag_ue_s = '"+parseInt(usuario.dag_uo_s)+"' and dag_ue_da = '"+parseInt(usuario.dag_uo_da)+"'"
              }]
            }
          };
          var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
          obj.success(function(response){

            $scope.ejecutoras = JSON.parse(response[0].ejecutartojson);
            console.log($scope.ejecutoras);
            var resUsuario = {
              "procedure_name":"ejecutartojson",
              "body":{
                "params": [
                {
                  "name":"expression",

                  "param_type":"IN","value":"select * from dag.dag_dag_unidad_organizacional where dag_uo_gestion = extract('year' from now())::smallint and dag_uo_s = '"+parseInt(usuario.dag_uo_s)+"' and dag_uo_da = '"+parseInt(usuario.dag_uo_da)+"' and dag_uo_ue = '"+parseInt(usuario.dag_uo_ue)+"'"
                }]
              }
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
            obj.success(function(response){

              $scope.unidades = JSON.parse(response[0].ejecutartojson);

              setTimeout(function () {
                  $scope.$apply(function () {
                    $scope.datos.da = usuario.dag_uo_da;
                    $scope.datos.ue = usuario.dag_uo_ue;
                    $scope.datos.uo = usuario.dag_uo_uo;
                   document.getElementById("da").value = usuario.dag_uo_da;
                   document.getElementById("ue").value = usuario.dag_uo_ue;
                   document.getElementById("uo").value = usuario.dag_uo_uo;
                   document.getElementById("analista").value = usuario.asig_rpc;
                   document.getElementById("tecnicoasignado").value = usuario.asig_tec_id;
                   $scope.datos.analista = usuario.asig_rpc;
                   $scope.datos.tecnicoasignado = usuario.asig_tec_id;
                  });
              }, 1000);
              console.log($scope.unidades);
            })
            obj.error(function(error) {
                $scope.errors["error_usuario"] = error;
            });
          })
          obj.error(function(error) {
              $scope.errors["error_usuario"] = error;
          });

        })
        obj.error(function(error) {
            $scope.errors["error_usuario"] = error;

        });
        $scope.datos.fecha_inicio = usuario.asig_fecha_inicio;
        $scope.datos.fecha_fin = usuario.asig_fecha_fin;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Asignacion";
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
        $scope.valor = false;
        $scope.getAsigTecnicos();
        $scope.datasector();
        //$scope.getTecnicosasignar();
    });
    $scope.inicioTecnicos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getAsigTecnicos();
            $scope.datasector();
          //  $scope.getTecnicosasignar();
        }
    };
});
