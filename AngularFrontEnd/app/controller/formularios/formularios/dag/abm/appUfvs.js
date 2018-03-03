app.controller('ufvsController', function ($scope, CONFIG, DreamFactory,sessionService,$route,ngTableParams,$filter,sweet) {

    //**** listado usando procedimientos almacenados

    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };

    $scope.startDateOpen1 = function($event) {
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

    $scope.getUfvs = function(dato){
      console.log(dato);
      if (dato == '' || dato == undefined ){
        console.log("entro por verdad");
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",
              "param_type":"IN","value":"select codigo,fecha::date,tipo_cambio,id from dag.dag_dag_ufv"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          var data = JSON.parse(response[0].ejecutartojson);
          $scope.obtTecnicos = JSON.parse(response[0].ejecutartojson);
          console.log(data);
          $scope.tablaUfvs = new ngTableParams({
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
            //$scope.errors["error_usuario"] = error;
        });
      }
      else{
        console.log("entro por falso");
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",
              "param_type":"IN","value":"select * from dag.dag_dag_ufv where  (to_char(fecha, 'YYYY'::text))::integer = '"+parseInt(dato)+"' "
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          var data = JSON.parse(response[0].ejecutartojson);
          console.log(data);
          $scope.obtTecnicos = JSON.parse(response[0].ejecutartojson);
          $scope.tablaUfvs = new ngTableParams({
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
            //$scope.errors["error_usuario"] = error;
        });
      }
    };

    $scope.getGestion = function(){
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",
              "param_type":"IN","value":"(select distinct (to_char(fecha, 'YYYY'::text))::integer as anio from dag.dag_dag_ufv order by anio) union all (select distinct (to_char(fecha, 'YYYY'::text))::integer + 1 as anio from dag.dag_dag_ufv order by  anio desc limit 1)"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          console.log(response);
          $scope.gestiones = JSON.parse(response[0].ejecutartojson);
          console.log($scope.gestiones);
        })
        obj.error(function(error) {
            //$scope.errors["error_usuario"] = error;
        });
    };

    $scope.adicionarUfvs = function(datosUsuario){
      console.log(datosUsuario);
      $scope.fechadel = datosUsuario.fechainicio;
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
      var resUsuario = {
        "procedure_name":"dag.abm_ufvs",
        "body":{
          "params": [
          {
            "name":"id_valor",
            "param_type":"IN",
            "value":null
          },
          {
            "name":"codigo_valor",
            "param_type":"IN",
            "value":null
          },
          {
            "name":"tipo_cambio_valor",
            "param_type":"IN",
            "value":datosUsuario.tipo_cambio
          },
          {
            "name":"fecha_valor",
            "param_type":"IN",
            "value":$scope.fechadel
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
        sweet.show('', 'Registro Almacenado', 'success');
        $route.reload();
      })
      obj.error(function(error) {
        sweet.show('', 'Registro no Almacenado', 'error');
        $route.reload();
      });
    };

    $scope.modificarUfvs = function(datosUsuario){
      console.log(datosUsuario);
      $scope.fechadel = datosUsuario.fechainicio;
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
      var resUsuario = {
        "procedure_name":"dag.abm_ufvs",
        "body":{
          "params": [
          {
            "name":"id_valor",
            "param_type":"IN",
            "value":datosUsuario.id
          },
          {
            "name":"codigo_valor",
            "param_type":"IN",
            "value":null
          },
          {
            "name":"tipo_cambio_valor",
            "param_type":"IN",
            "value":datosUsuario.tipo_cambio
          },
          {
            "name":"fecha_valor",
            "param_type":"IN",
            "value":$scope.fechadel
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
        sweet.show('', 'Registro Modificado', 'success');
        $route.reload();
      })
      obj.error(function(error) {
        sweet.show('', 'Registro no Modificado', 'error');
        $route.reload();
      });
    };


    $scope.eliminarUfvs = function(datos){
      console.log(datosUsuario);
      $scope.fechadel = datosUsuario.fechainicio;
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
      var resUsuario = {
        "procedure_name":"dag.abm_ufvs",
        "body":{
          "params": [
          {
            "name":"id_valor",
            "param_type":"IN",
            "value":datosUsuario.id
          },
          {
            "name":"codigo_valor",
            "param_type":"IN",
            "value":null
          },
          {
            "name":"tipo_cambio_valor",
            "param_type":"IN",
            "value":datosUsuario.tipo_cambio
          },
          {
            "name":"fecha_valor",
            "param_type":"IN",
            "value":$scope.fechadel
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
        sweet.show('', 'Registro Modificado', 'success');
        $route.reload();
      })
      obj.error(function(error) {
        sweet.show('', 'Registro no Modificado', 'error');
        $route.reload();
      });
    };

    $scope.limpiar = function(){
      $scope.datos = "";
        $scope.datosUsuario = '';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de UFVS";
    };
    $scope.modificarGrupoCargar = function(usuario){

      console.log(usuario);
        $scope.datos = usuario;
        $scope.datos.fechainicio = usuario.fecha;
        $scope.datos.tipo_cambio = usuario.tipo_cambio;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar UFVS";
    };

    $scope.eliminarGrupoCargar = function(usuario){
        $scope.datos.tipo = usuario.tipo;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar UFVS";
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
        $scope.getGestion();
        $scope.getUfvs('');
    });
    $scope.inicioUfvs = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getGestion();
            $scope.getUfvs('');
        }
    };
});
