app.controller('ambienteController', function ($scope, CONFIG, DreamFactory,sessionService,$route,ngTableParams,$filter,sweet) {
    $scope.getMacrodistritos = function(){
        var parametros = {
             "procedure_name":"ae.sp_lst_macrodistritos"            
        };
        var ss =  DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            $scope.datosMacrodistritos= response;
        });
        ss.error(function(results){
             alert("error");
        });
    }
    $scope.dist = 0;
    $scope.macro = 0;
    $scope.zona = 0;
     $scope.GetValueMacrodistrito = function () {
        var e = document.getElementById("macro");
        $scope.datosAmbiente.macrodistrito = e.options[e.selectedIndex].text;
    }
    $scope.GetValueDistrito = function () {
        var e = document.getElementById("dist");
        $scope.datosAmbiente.distrito = e.options[e.selectedIndex].text;
    }
    $scope.GetValueZonaActividad = function () {
        var e = document.getElementById("zona");
        $scope.datosAmbiente.zonas = e.options[e.selectedIndex].text;
    }
    $scope.getDistritos = function(macro){
       var parametros = {
            "procedure_name":"ae.sp_lst_distritos",
            "body":{"params": [{"name":"id_macrodistrito","param_type":"IN","value":macro}]}            
        };
        var ss =  DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            $scope.datosDistritos= response;
        });
        ss.error(function(results){
             alert("error");
        });
    }

    $scope.getZonas = function(distrito){
        var parametros = {
            "procedure_name":"ae.sp_lst_zonas",
            "body":{"params": [{"name":"id_distrito","param_type":"IN","value":distrito}]}            
        };
        var ss =  DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (response){
            $scope.datosZonas= response;
        });
        ss.error(function(results){
             alert("error");
        });
    }
    $scope.getAmbientes = function(){
        var resAmbiente = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"SELECT inm_id as id, inm_cod_cat as codcat, inm_cod_inm as codfin, inm_lat as lat, inm_long as long,inm_nombre as nombre, inm_zona_id as zona, inm_direccion as dir, inm_destino as dest, inm_clasificacion as clas, inm_macro_id as macro, inm_distrito_id as dist, inm_sup_edif as suped, inm_sup_terr as supter, inm_registrado, inm_modificado, inm_usr_id, inm_estado, inm_valor as valinm FROM ubi._ubi_inmueble WHERE inm_estado = 'A'"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resAmbiente);
        obj.success(function(response){
          $scope.obtAmbientes = JSON.parse(response[0].ejecutartojson);
            var data = JSON.parse(response[0].ejecutartojson);   
            $scope.tablaAmbientes = new ngTableParams({
                page: 1,          
                count: 10,  
                filter: {},
                sorting: {}    
            }, {
                total: $scope.obtAmbientes.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtAmbientes, params.filter()) :
                    $scope.obtAmbientes;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtAmbientes;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        })
        obj.error(function(error) {
            $scope.errors["error_ambiente"] = error;            
        });
    };
    
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        
    $scope.adicionarAmbiente = function(datosAmbiente){
        console.log($scope.dist,datosAmbiente);
        var ambiente = {}; 
        ambiente['inm_cod_cat'] = datosAmbiente.codcat;
        ambiente['inm_cod_inm'] = datosAmbiente.codfin;
        ambiente['inm_lat'] = datosAmbiente.lat;
        ambiente['inm_long'] = datosAmbiente.long;
        ambiente['inm_nombre'] = datosAmbiente.nombre;
        ambiente['inm_macro_id'] = datosAmbiente.macro;
        ambiente['inm_distrito_id'] = datosAmbiente.dist;
        ambiente['inm_zona_id'] = datosAmbiente.zona;
        ambiente['inm_macro'] = datosAmbiente.macrodistrito;
        ambiente['inm_distrito'] = datosAmbiente.distrito;
        ambiente['inm_zona'] = datosAmbiente.zonas;
        ambiente['inm_direccion'] = datosAmbiente.dir;
        ambiente['inm_destino'] = datosAmbiente.dest;
        ambiente['inm_clasificacion'] = datosAmbiente.clas;
        ambiente['inm_sup_edif'] = datosAmbiente.suped;
        ambiente['inm_sup_terr'] = datosAmbiente.supter;
        ambiente['inm_valor'] = datosAmbiente.valinm;
        ambiente['inm_registrado'] = fechactual;
        ambiente['inm_modificado'] = fechactual;
        ambiente['inm_usr_id'] = sessionService.get('IDUSUARIO');
        ambiente['inm_estado'] = 'A';
        var resAmbiente = {
            table_name:"ubi._ubi_inmueble",
            body:ambiente
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resAmbiente);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };
    $scope.modificarAmbiente = function(datosAmbiente){
        console.log(datosAmbiente);
        var ambiente = {};
        ambiente['inm_cod_cat'] = datosAmbiente.codcat;
        ambiente['inm_cod_inm'] = datosAmbiente.codfin;
        ambiente['inm_lat'] = datosAmbiente.lat;
        ambiente['inm_long'] = datosAmbiente.long;
        ambiente['inm_nombre'] = datosAmbiente.nombre;
        ambiente['inm_macro_id'] = datosAmbiente.macro;
        ambiente['inm_distrito_id'] = datosAmbiente.dist;
        ambiente['inm_zona_id'] = datosAmbiente.zona;
        ambiente['inm_macro'] = datosAmbiente.macrodistrito;;
        ambiente['inm_distrito'] = datosAmbiente.distrito;;
        ambiente['inm_zona'] = datosAmbiente.zonas;;
        ambiente['inm_direccion'] = datosAmbiente.dir;;
        ambiente['inm_destino'] = datosAmbiente.dest;;
        ambiente['inm_clasificacion'] = datosAmbiente.clas;;
        ambiente['inm_sup_edif'] = datosAmbiente.suped;;
        ambiente['inm_sup_terr'] = datosAmbiente.supter;;
        ambiente['inm_valor'] = datosAmbiente.valinm;
        ambiente['inm_modificado'] = fechactual;
        ambiente['inm_usr_id'] = sessionService.get('IDUSUARIO');
        ambiente['inm_estado'] = 'A';
        var resAmbiente = {
            table_name:"ubi._ubi_inmueble",
            id:datosAmbiente.id,
            body:ambiente
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resAmbiente);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $route.reload();
        })
        .error(function(data){
            console.log(data);
            sweet.show('', 'Registro no modificado', 'error');
        })
    };
    $scope.eliminarAmbiente = function(usrId){
        var ambiente = {};
        ambiente['inm_modificado'] = fechactual;
        ambiente['inm_usr_id'] = sessionService.get('IDUSUARIO');
        ambiente['inm_estado'] = 'B';
        var resAmbiente = {
            table_name:"ubi._ubi_inmueble",
            id:usrId.id,
            body:ambiente
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resAmbiente);
        obj.success(function(data){
            $.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 
    $scope.limpiar = function(){
        $scope.datosAmbiente = ''; 
        $scope.getMacrodistritos();
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Ambientes";
    };
    $scope.modificarAmbienteCargar = function(ambiente){
        console.log(ambiente);
        $scope.getZonas(ambiente.dist);
        $scope.getDistritos(ambiente.macro);
        $scope.datosAmbiente=ambiente;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar Ambientes";
    };
    $scope.eliminarAmbienteCargar = function(ambiente){
        $scope.datosAmbiente=ambiente;
        $scope.getZonas(ambiente.dist);
        $scope.getDistritos(ambiente.macro);
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Ambientes";
    };
    $scope.$on('api:ready',function(){
        $scope.getAmbientes();   
            $scope.getMacrodistritos();
    });
    $scope.inicioAmbientes = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getAmbientes();  
            $scope.getMacrodistritos();
        }
    }; 
});
