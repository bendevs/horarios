app.controller('busquedaController' , function ($scope, $timeout, $route, $rootScope, ngTableParams,$filter, $routeParams, $location, $http, Data, sessionService, CONFIG,sweet, LogGuardarInfo, DreamFactory) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var fechactualnuevoformasto=fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " - " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();    
    $scope.errors = {};
    $scope.obtDatos="";
    $scope.tablaDatosRecuperados={};
    $scope.limpiar = function()
    {
        $scope.tipoTramite = "";
        $scope.subTipoTramite = "";
        $scope.tipoHojaRuta = "";
        $scope.asunto = "";
        $scope.ubicacion = "";
        $scope.zona ="";
        if($scope.datos != undefined) {
        $scope.datos.subTipoTramite=""; }
        $scope.ubicacion ="";
        $scope.nroformulario = "";
        $scope.planilla="";
    };
    
    $scope.buscarDatos = function (datos) {  
    $rootScope.datosBusqueda2 = datos;     
    var datos1 = datos;
        var rolesId1 = $scope.nodoId;        
        if(datos1 === undefined)
        {
          var misDatos = {
            "procedure_name":"sp_buscar_tramites",
            "body":{
                "params": [
                    {
                      "name": "v_tipo_id",
                      "value": ''
                    },{
                      "name": "v_suptipo_id",
                      "value": null
                    },{
                      "name": "v_correlativo1",
                      "value": null
                    },{
                      "name": "v_correlativo2",
                      "value": null
                    },{
                      "name": "v_tipoHr",
                      "value": ''
                    },{
                      "name": "v_asunto",
                      "value": ''
                    },{
                      "name": "v_nodo_origen",
                      "value": $scope.nodoId
                    },{
                      "name": "v_create_date1",
                      "value": null
                    },{
                      "name": "v_create_date2",
                      "value": null
                    },{
                      "name": "v_estado",
                      "value": ''
                    }
                ]
            }
          };
        }
        /*********VALIDAR LOS CAMPOS PARA NO RECIBIR INDEFINIDO*********/
        else{
            var filtroUid1 = datos.app_uid1;
            var filtroUid2 = datos.app_uid2;
            var filtroTipoTramite = datos.tipoTramite;
            var filtroSubTipoTramite = datos.subTipoTramite;
            var filtroTipoHojaRuta = datos.tipoHojaRuta;
            var filtroAsunto = datos.asunto;
            var filtroEstado = datos.estado;
            var filtroFchDesde = datos.fchDesde;
            var filtroFchHasta = datos.fchHasta;
            if(filtroUid1){
                var filtroUid1_v = datos.app_uid1;
                if(filtroUid2){ 
                var filtroUid2_v = datos.app_uid2;}
                else{var filtroUid2_v = datos.app_uid1;}
                }
                else{var filtroUid1_v = null; var filtroUid2_V = null;}
            
            if(filtroTipoTramite){var filtroTipoTramite_v = datos.tipoTramite;}
            else{ var filtroTipoTramite_v = '';}
            
            if(filtroSubTipoTramite){var filtroSubTipoTramite_v = datos.subTipoTramite;}
            else{var filtroSubTipoTramite_v = null;}
            
            if(filtroTipoHojaRuta){ var filtroTipoHojaRuta_v = filtroTipoHojaRuta;}
            else{var filtroTipoHojaRuta_v = '';}
            
            if(filtroAsunto){ var filtroAsunto_v = datos.asunto;}
            else{var filtroAsunto_v = '';}
            
            if(filtroEstado){var filtroEstado_v = datos.estado;}
            else{ var filtroEstado_v = '';}
            
            if(filtroFchDesde){
            var filtroFchDesde_v = datos.fchDesde.getFullYear() + "-" + (datos.fchDesde.getMonth()+1) + "-" + datos.fchDesde.getDate();
            if(filtroFchHasta){ 
            var filtroFchHasta_v = datos.fchHasta.getFullYear() + "-" + (datos.fchHasta.getMonth()+1) + "-" + datos.fchHasta.getDate();}
            else{var filtroFchHasta_v = datos.fchDesde.getFullYear() + "-" + (datos.fchDesde.getMonth()+1) + "-" + datos.fchDesde.getDate();}
            }
            else{var filtroFchDesde_v = null; var filtroFchHasta_v = null;}
        }
        if(rolesId1 === undefined)
        {
            var misDatos = {
                "procedure_name":"sp_buscar_tramites",
                "body":{
                    "params": [
                        {
                          "name": "v_tipo_id",
                          "value": filtroTipoTramite_v
                        },{
                          "name": "v_suptipo_id",
                          "value": filtroSubTipoTramite_v
                        },{
                          "name": "v_correlativo1",
                          "value": filtroUid1_v
                        },{
                          "name": "v_correlativo2",
                          "value": filtroUid2_v
                        },{
                          "name": "v_tipoHr",
                          "value": filtroTipoHojaRuta_v
                        },{
                          "name": "v_asunto",
                          "value": filtroAsunto_v
                        },{
                          "name": "v_nodo_origen",
                          "value": null
                        },{
                          "name": "v_create_date1",
                          "value": filtroFchDesde_v
                        },{
                          "name": "v_create_date2",
                          "value": filtroFchHasta_v
                        },{
                          "name": "v_estado",
                          "value": filtroEstado_v
                        }
                    ]
                }
            };
        }
        if(rolesId1 !== undefined && datos1 !== undefined)
        {
            var misDatos = {
              "procedure_name":"sp_buscar_tramites",
              "body":{
                "params": [
                    {
                      "name": "v_tipo_id",
                      "value": filtroTipoTramite_v
                    },{
                      "name": "v_suptipo_id",
                      "value": filtroSubTipoTramite_v
                    },{
                      "name": "v_correlativo1",
                      "value": filtroUid1_v
                    },{
                      "name": "v_correlativo2",
                      "value": filtroUid2_v
                    },{
                      "name": "v_tipoHr",
                      "value": filtroTipoHojaRuta_v
                    },{
                      "name": "v_asunto",
                      "value": filtroAsunto_v
                    },{
                      "name": "v_nodo_origen",
                      "value": $scope.nodoId
                    },{
                      "name": "v_create_date1",
                      "value": filtroFchDesde_v
                    },{
                      "name": "v_create_date2",
                      "value": filtroFchHasta_v
                    },{  
                      "name": "v_estado",
                      "value": filtroEstado_v
                    }
                ]
              }
            };
        }
        //$.blockUI();
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (response){
            if(response.length > 0){ 
                $scope.formFormulario = true;
                $scope.ResultadoBusqueda = true;
                $scope.tablaDatos = true;
                $scope.MostrarCopias = false;
                $scope.formActuacion = false;
                $scope.filtros = false;
                $scope.obtDatos = response;
                var data = response;
                $scope.tablaDatosRecuperados.reload();
                $scope.Recargar();
                //$.unblockUI(); 
            } else {
                sweet.show('', "No hay Registros con los criterios de busqueda", 'error');
                $scope.tablaDatos = false;
                $scope.Recargar();
                $.unblockUI(); 
            }
        }).error(function(response){
            $.unblockUI();             
            sweet.show('', "Error al realizar la consulta", 'error');
        });
    };

    $scope.tablaDatosRecuperados = new ngTableParams({
        page: 1,
        count: 20,
        filter: {},
        sorting: {}
        }, {
        total: $scope.obtDatos.length,
        getData: function($defer, params) {
            var filteredData = params.filter() ?
            $filter('filter')($scope.obtDatos, params.filter()) :
            $scope.obtDatos;              
            var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            $scope.obtDatos;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
        }
    });

    $scope.habilitaActuacion = function(opcion, index,idNodo, correlativo, nroCopia, asunto, tipo_tramite)
    {  
        $.blockUI(); 
        switch(opcion) {
            case 1: // mostrar Tramite       
                $scope.formActuacion = true;
                $scope.formFormulario = false;
                $scope.MostrarCopias = true;
                sessionService.set('TRAMITE_UID', index);
                sessionService.set('TRAMITE_IDNODO', idNodo);   
                sessionService.set('TRAMITE_NROCOPIA', nroCopia);
                if(nroCopia == 0){ nroCopia="Original";}
                $scope.titulo = correlativo+" - "+nroCopia+" |  Asunto: "+asunto+" | Tipo de Tramite:"+tipo_tramite;
                $.unblockUI(); 
            break;
            case 2: // volver a bandeja de entrada
                $scope.formActuacion = false;
                $scope.formFormulario = true;
                $scope.MostrarCopias = false;
                sessionService.destroy('TRAMITE_UID');
                sessionService.destroy('TRAMITE_IDNODO');
                sessionService.destroy('TRAMITE_NROCOPIA');
                $.unblockUI(); 
            break;
        }
    };
    
    $scope.verCopias = function (tramiteuid) {
        $.blockUI();
        $scope.formActuacion = false;
        $scope.ResultadoBusqueda = false;
        $scope.formFormulario = true;
        $scope.MostrarCopias = true;
        $scope.filtros = false;
        var datosCopia = {
            "procedure_name":"sp_mostrar_hijos",
            "body":{
                "params": [
                    {
                      "name": "prm_tramite_uid",
                      "value": tramiteuid
                    }
                ]
            }                
        };        
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosCopia).success(function (response){
            if(response.length > 0){
                $scope.DataTable = response;
                $.unblockUI(); 
            } else {
                sweet.show('', "No hay Registros con los criterios de busqueda", 'error');
                $scope.tablaDatos = false;
                $.unblockUI(); 
            }
        }).error(function(response){
        });
    };
    $scope.seleccionaTramite = function (tramite) {
        $scope.datos=JSON.parse(tramite.datos);
        $scope.trmFormulario = $scope.datos;
        console.log($scope.trmFormulario);
    };
    $scope.verHisto = function (a) {
        $.blockUI();
        $scope.formActuacion = false;
        $scope.ResultadoBusqueda = false;
        $scope.formFormulario = true;
        $scope.MostrarCopias = true;
        $scope.filtros = false;
        var datosCopia = {
            "procedure_name":"sp_mostrar_historico",
            "body":{
                "params": [
                    {
                      "name": "cas_id",
                      "value": a
                    }
                ]
            }                
        };        
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosCopia).success(function (response){
            if(response.length > 0){
              $scope.DataTable = response;
              $.unblockUI(); 
            } else {
                sweet.show('', "No hay Registros con los criterios de busqueda", 'error');
                $scope.tablaDatos = false;
                $.unblockUI(); 
            }
        }).error(function(response){
        });
    };
      
    $scope.VerActuacion = function(opcion,uid, idNodo, correlativo, nroCopia, asunto, tipo)
    {   
      switch(opcion) {
        case 1: // mostrar Tramite 
          $scope.formActuacion = true;
          $scope.formFormulario = true;
          $scope.MostrarCopias = false;
          $scope.ResultadoBusqueda = false;
          $scope.filtros = false;
          sessionService.set('TRAMITE_UID', uid);
          sessionService.set('TRAMITE_IDNODO', idNodo);   
          sessionService.set('TRAMITE_NROCOPIA', nroCopia);
          if(nroCopia == 0){ nroCopia="Original";}
          $scope.titulocorrelativo = correlativo;
          $scope.titulonroCopia = nroCopia;
          $scope.tituloasunto = asunto;
          $scope.titulotipo_tramite = tipo;
          $scope.tituloCodigo = sessionService.get('TRAMITE_UID');              
          $scope.btnImprimir = true;
          break;
        case 2: // volver a bandeja de entrada
          $scope.formActuacion = false;
          $scope.formFormulario = false;
          $scope.MostrarCopias = false;
          sessionService.destroy('TRAMITE_UID');
          sessionService.destroy('TRAMITE_IDNODO');
          sessionService.destroy('TRAMITE_NROCOPIA');
          break;
      }
    };
    
    $scope.cargarCopias=function(){
       $scope.formActuacion = false;
       $scope.formFormulario = true;
       $scope.ResultadoBusqueda = false;
       $scope.MostrarCopias = true;
       $scope.filtros = false;
    };
    
    $scope.cargarBuscador=function(){
         $scope.formActuacion = false;
         $scope.formFormulario = true;
         $scope.ResultadoBusqueda = true;
         $scope.MostrarCopias = false;
         $scope.filtros = false;
    };
    
    $scope.cargarNuevaBusqueda=function(){
         $scope.formFormulario = true;
         $scope.tablaDatos = false;
         $scope.formActuacion = false; 
         $scope.ResultadoBusqueda = false;
         $scope.MostrarCopias = false;
         $scope.filtros = true;
    };
    
    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };
    
    $scope.startDateOpen1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened1 = true;
    };
    
    $scope.Recargar = function () {
        sessionService.destroy('TRAMITE_UID');
        sessionService.destroy('TRAMITE_IDNODO');
        sessionService.destroy('TRAMITE_NROCOPIA');
        if($scope.datos != undefined) {$scope.datos = ''; }
        $scope.nodoNombre = null;
        $scope.nodoId = null;
    };
    /////////////////////////////////// ARBOL DERIVACION PARA NEXO //////////////////////////////////////
    $scope.jsonArbol = "";
    $scope.obtDatos = "";
    $scope.arbolNodos = function () {
        $.ajax({ 
            data:{ } ,            
            url: [CONFIG.DSP]+'/dreamfactory/dist/storeArbolAjax.php',
            type: 'post',  
            dataType: "json",
            success: function (response) { 
                $timeout(function () {
                    var tempJsonArbol =JSON.stringify(response);
                    $scope.jsonArbol = JSON.parse(tempJsonArbol);
                    $('#tree1').tree({
                        data:  $scope.jsonArbol,
                        closedIcon: $('<i class="fa fa-plus-circle"/>'),
                        openedIcon: $('<i class="fa fa-minus-circle"/>')
                    });
                }, 1000);
            }
        });
    };

    $scope.activarTramite = function(uid, nro_copia){
        $.blockUI();
        var resActivar = {
            "procedure_name":"sp_cerrar_tramite",
            "body":{
                "params": [  
                    {
                        "name": "uid",
                        "value": uid
                    },{
                        "name": "nro_copia",
                        "value": nro_copia
                    },{
                        "name": "usuario",
                        "value": sessionService.get('USUARIO')
                    },{
                        "name": "estado",
                        "value": 'ACTIVO'
                    }
                ]
            }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resActivar);
        obj.success(function (response) {
            sweet.show('', 'Trámite Activado', 'success');  //grabamos la respuesta para el paginado
            $scope.buscarDatos($rootScope.datosBusqueda2);
            $.unblockUI();
        })
        .error(function(data){
            sweet.show('', 'Trámite no Activado', 'error');
            $.unblockUI(); 
        })
    };

    $scope.tomarTramite = function (datos, opcion,opcion2, uid) {
        if(opcion == 'dejar')
        {
            sessionService.set('TRAMITE_US_ACTUAL', 'NO');
            $scope.usuario = '';
        }
        var misDatos = {
            "procedure_name":"sp_tomar_tramite_creados",
            "body":{
                "params": [
                    {"name": "uid","value": datos.uid},
                    {"name": "nro_copia","value": datos.nro_copia},
                    {"name": "usuario","value": $scope.usuario}
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (response){
          console.log("el response es:   ",response);
            if(response[0].sp_tomar_tramite_creados){
                $scope.verCopias(uid);
                sweet.show('', "El trámite ha sido dejado", 'success');
            } else {
                sweet.show('', "El tramite ya fue tomado por otro Usuario", 'error');
            }
        }).error(function(response){
        });
    };

    // ojo no borrar la funcion q no hace nada
    $scope.alestra = function () {
    };

    $('#tree1').bind(
        'tree.click',
        function(e) {
            var selected_node = e.node;
            $scope.nodoNombre=selected_node.name;
            $scope.nodoId=selected_node.id;
        }
    );
    ////////////// HISTORICO PARA NEXO ///////////
    $scope.$on('api:ready',function(){
        //$.blockUI();
        $scope.formFormulario = true;
        $scope.formActuacion = false;
        $scope.MostrarCopias = false;
        $scope.filtros = true;
        $.unblockUI();
    });

    $scope.inicioNexoForm = function () {
        //$.blockUI();
        $scope.formFormulario= true;
        $scope.filtros = true;
        if(DreamFactory.isReady()){
            $scope.formFormulario = true;
        }
        setTimeout(function(){ 
          //$.unblockUI();
        },1000);
    }; 
});