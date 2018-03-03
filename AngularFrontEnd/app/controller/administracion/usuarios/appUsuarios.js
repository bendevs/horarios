app.controller('usuariosController', function ($scope, CONFIG, DreamFactory,sessionService,$route,ngTableParams,$filter,sweet) {
    
    //**** listado usando procedimientos almacenados
    $scope.getUsuarios = function(){
        //$.blockUI();
        var resUsuario = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"SELECT usr_nodo_id as nodoid,usr_id as usrId, usr_usuario as usrUsuario, concat(prs_nombres,' ',prs_paterno,' ',prs_materno) as usrnombre, usr_clave as usrClave,usr_prs_id as psrid, CASE  WHEN usr_estado='A' THEN 'ACTIVO'  WHEN usr_estado='I' THEN 'INACTIVO' END AS usrEstado FROM _bp_usuarios INNER JOIN _bp_personas ON prs_id=usr_prs_id WHERE usr_estado<>'B' AND prs_estado<>'B'"
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resUsuario);
        obj.success(function(response){
          $scope.obtUsuarios = JSON.parse(response[0].ejecutartojson);
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

              "param_type":"IN","value":"select concat(prs_nombres,' ',prs_paterno,' ',prs_materno) as Prs,prs_id as idPrs from _bp_personas where prs_id="+b+" and prs_estado<>'B' ORDER BY prs_id ASC"
            }]
          }
        };
                
        }
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resPersonasUsuarios)
        .success(function (response) {
            $scope.personas = JSON.parse(response[0].ejecutartojson);            
        }).error(function(error) {
            $scope.errors["error_persona"] = error;            
        });
    };
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        
    $scope.adicionarUsuario = function(datosUsuario){
        //$.blockUI();
        var usuario = {}; 
        usuario['usr_prs_id'] = datosUsuario.psrid;
        usuario['usr_usuario'] = datosUsuario.usrusuario;
        usuario['usr_clave'] = datosUsuario.usrclave;
        usuario['usr_nodo_id'] = datosUsuario.nodoid;
        usuario['usr_controlar_ip'] = '1';
        usuario['usr_registrado'] = fechactual;
        usuario['usr_modificado'] = fechactual;
        usuario['usr_usr_id'] = sessionService.get('IDUSUARIO');
        usuario['usr_estado'] = 'A';
        var resUsuario = {
            table_name:"_bp_usuarios",
            body:usuario
        };
        //servicio insertar usuarios
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resUsuario);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarUsuario = function(usrId, datosUsuario){
        //$.blockUI();
        var usuario = {};
        usuario['usr_prs_id'] = datosUsuario.psrid;
        usuario['usr_usuario'] = datosUsuario.usrusuario;
        usuario['usr_clave'] = datosUsuario.usrclave;
        usuario['usr_nodo_id'] = datosUsuario.nodoid;
        usuario['usr_controlar_ip'] = '1';
        usuario['usr_registrado'] = fechactual;
        usuario['usr_modificado'] = fechactual;
        usuario['usr_usr_id'] = sessionService.get('IDUSUARIO');
        
        var resUsuario = {
            table_name:"_bp_usuarios",
            id:usrId,
            body:usuario
        };
        //servicio modificar usuarios
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resUsuario);
        obj.success(function(data){
            //$.unblockUI(); 
            sweet.show('', 'Registro modificado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };
    $scope.eliminarUsuario = function(usrId){
        //$.blockUI();
        var usuario = {};
        usuario['usr_modificado'] = fechactual;
        usuario['usr_estado'] = 'B';
        usuario['usr_usr_id'] = sessionService.get('IDUSUARIO');
        var resUsuario = {
            table_name:"_bp_usuarios",
            id:usrId,
            body:usuario
        };
        //servicio eliminar usuarios
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resUsuario);
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
        $scope.getPersonasUsuarios("new");
        $scope.datosUsuario = '';  
        $scope.getNodos();
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Usuarios";
    };
    $scope.modificarUsuarioCargar = function(usuario){
        $scope.getPersonasUsuarios("upd",usuario.psrid);
        $scope.datosUsuario=usuario;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.titulo="Modificar Usuarios";
    };
    $scope.eliminarUsuarioCargar = function(usuario){
        $scope.getPersonasUsuarios("upd",usuario.psrid);
        $scope.datosUsuario=usuario;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.titulo="Eliminar Usuarios";
    };
     $scope.buscarNodo = function (datosNodo, tipo) {
        console.log(datosNodo, tipo); 
        $scope.getNodoPadre(datosNodo, tipo);
    };
    $scope.getNodoPadre = function(datosNodo, tipo){
        var textbusq = datosNodo.toUpperCase();
       var resNodo = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select * from ct_nodos where nodo_nombre like '%"+textbusq+"%' limit(15)"
            }]
          }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodo)
        .success(function (response) {
          $scope.nodos = JSON.parse(response[0].ejecutartojson);
          console.log($scope.nodos);
        }).error(function(error) {
            $scope.errors["error_usuario"] = error;            
        })
    };
    $scope.getNodos = function(){
        var resNodo = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select * from ct_nodos "
            }]
          }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resNodo)
        .success(function (response) {
            $scope.nodos = JSON.parse(response[0].ejecutartojson);;           
        }).error(function(error) {
            $scope.errors["error_persona"] = error;            
        });
    };
    //iniciando el controlador
    $scope.$on('api:ready',function(){
        //alert('gfhdg');
        $scope.getUsuarios();   
        $scope.getNodos();       
    });
    $scope.inicioUsuarios = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getUsuarios();  
            $scope.getNodos(); 
            
        }
    }; 
});
